/**
 * rules.js
 * QuantLux — Investment rules engine and advisory generator.
 *
 * Encodes the three portfolio rules:
 *   P  — Portfolio has a target size in EUR
 *   R1 — No GICS sector above 20% of target
 *   R2 — No single asset above 5% of target
 *   R3 — Never sell at a loss (purchase_price_eur guard)
 *
 * Input:  stats object from Portfolio.computeStats()
 *         members array for purchase price lookups
 * Output: Array of recommendation objects consumed by render.js
 *
 * Depends on: data.js (ASSET_DB), portfolio.js (Portfolio)
 */

class RulesEngine {

    /**
     * @param {Portfolio} portfolio
     * @param {number}    taxRate   - Capital gains tax rate (default 26%)
     */
    constructor(portfolio, taxRate = 0.26) {
        this.portfolio = portfolio;
        this.taxRate   = taxRate;
    }

    /* ──────────────────────────────────────────────────────────────
       Main entry — returns array of recommendation objects:
       { sev: 'high'|'medium'|'info'|'ok', title, body, actions[] }
    ─────────────────────────────────────────────────────────────── */

    generate(stats) {
        if (!stats || this.portfolio.members.length === 0) return [];

        const recs = [];

        recs.push(...this._checkDeployment(stats));
        recs.push(...this._checkSectors(stats));
        recs.push(...this._checkAssets(stats));

        if (recs.length === 0) {
            recs.push(...this._allClearMessage(stats));
        }

        return recs;
    }

    /* ──────────────────────────────────────────────────────────────
       Deployment status (Primitive — portfolio size)
    ─────────────────────────────────────────────────────────────── */

    _checkDeployment({ target, totalValue, ratio }) {
        const recs = [];

        if (ratio < 0.96) {
            const gap = target - totalValue;
            recs.push({
                sev:     'info',
                title:   'Capital Not Fully Deployed',
                body:    `Portfolio is ${fmt.pct(ratio * 100)} deployed — ${fmt.eur(gap)} idle.`,
                actions: this._suggestBuys(gap, target)
            });
        }

        if (ratio > 1.05) {
            recs.push({
                sev:     'high',
                title:   'Portfolio Overweight',
                body:    `Value exceeds target by ${fmt.eur(totalValue - target)} (${fmt.pct((ratio - 1) * 100)}). ` +
                         `Reduce positions or raise the portfolio target.`,
                actions: []
            });
        }

        return recs;
    }

    /* ──────────────────────────────────────────────────────────────
       Rule 1 — No sector above 20% of target
    ─────────────────────────────────────────────────────────────── */

    _checkSectors({ target, sectors }) {
        const recs = [];

        sectors.forEach(({ sector, value, assets }) => {
            if (sector.id === 12) return; // Cash is exempt from sector limit

            const ratio = value / target;
            if (ratio <= 0.20) return;

            // Target: reduce to 18.5% to give a comfortable margin under the 20% ceiling
            const excessValue = value - target * 0.185;
            const sellPlan    = this._buildSellPlan(assets, excessValue);

            const swapNames = (sector.swap_recommendations || [])
                .map(id => this.portfolio.sectorOf(id)?.name)
                .filter(Boolean)
                .slice(0, 2)
                .join(', ');

            recs.push({
                sev:     'high',
                title:   `R1 Violation · ${sector.name}`,
                body:    `At ${fmt.pct(ratio * 100)} of target — maximum is 20%. ` +
                         `Reduce by ${fmt.eur(excessValue)}.` +
                         (swapNames ? `\nAlternate sectors: ${swapNames}.` : ''),
                actions: sellPlan
            });
        });

        return recs;
    }

    /* ──────────────────────────────────────────────────────────────
       Rule 2 — No single asset above 5% of target
    ─────────────────────────────────────────────────────────────── */

    _checkAssets({ target, sectors }) {
        const recs = [];

        sectors.forEach(({ assets }) => {
            assets.forEach(({ member: m, asset: a, value }) => {
                if (a.sector === 12) return; // Cash exempt

                const ratio = value / target;
                if (ratio <= 0.05) return;

                // Target: reduce to 4.7% to sit comfortably under 5%
                const targetValue = target * 0.047;
                const excess      = value - targetValue;
                const unitsToSell = Math.ceil(excess / a.preis_eur);
                const canSell     = a.preis_eur >= (m.purchase_price_eur || 0);
                const pnl         = (a.preis_eur - (m.purchase_price_eur || 0)) * unitsToSell;

                const actions = canSell
                    ? [
                        `Sell ${unitsToSell} × ${fmt.eur(a.preis_eur)} = ${fmt.eur(unitsToSell * a.preis_eur)}` +
                        ` (P&L: ${fmt.eur(pnl)})`
                      ]
                    : [
                        `⚠ Cannot sell — would realise a loss ` +
                        `(bought at ${fmt.eur(m.purchase_price_eur)}, now ${fmt.eur(a.preis_eur)}). ` +
                        `Rule 3 prevents this sale.`
                      ];

                recs.push({
                    sev:     'medium',
                    title:   `R2 Violation · ${fmt.shortName(a.name, 28)}`,
                    body:    `At ${fmt.pct(ratio * 100)} of target — maximum is 5%. ` +
                             `Sell ${unitsToSell} unit(s) to reach ~4.7%.`,
                    actions
                });
            });
        });

        return recs;
    }

    /* ──────────────────────────────────────────────────────────────
       All-clear message (no violations found)
    ─────────────────────────────────────────────────────────────── */

    _allClearMessage({ totalValue, ratio, target }) {
        const actions = [];
        if (ratio > 1.0) {
            const nextTarget = Math.ceil((totalValue * 1.20) / 10000) * 10000;
            actions.push(`Consider raising target to ${fmt.eur(nextTarget, 0)} to accommodate growth.`);
        }
        return [{
            sev:     'ok',
            title:   '✓ Portfolio Balanced',
            body:    'All three rules satisfied. No corrective action required.',
            actions
        }];
    }

    /* ──────────────────────────────────────────────────────────────
       Build a sell plan for a sector — respects Rule 3 (no loss sales).
       Sells most profitable positions first.
    ─────────────────────────────────────────────────────────────── */

    _buildSellPlan(assets, totalToReduce) {
        const plan = [];
        let remaining = totalToReduce;

        // Sort by profitability descending (sell winners first)
        const sorted = [...assets].sort((a, b) => {
            const profitA = a.asset.preis_eur - (a.member.purchase_price_eur || 0);
            const profitB = b.asset.preis_eur - (b.member.purchase_price_eur || 0);
            return profitB - profitA;
        });

        sorted.forEach(({ member: m, asset: a }) => {
            if (remaining <= 0) return;

            const isAtLoss = a.preis_eur < (m.purchase_price_eur || 0);
            if (isAtLoss) {
                // Rule 3: flag it, do not sell
                plan.push(
                    `⚠ ${fmt.shortName(a.name, 28)}: held at loss ` +
                    `(bought ${fmt.eur(m.purchase_price_eur)} → now ${fmt.eur(a.preis_eur)}). Skipped.`
                );
                return;
            }

            const unitsToSell = Math.min(Math.ceil(remaining / a.preis_eur), m.qty);
            if (unitsToSell > 0) {
                plan.push(
                    `Sell ${unitsToSell} × ${fmt.shortName(a.name, 24)} @ ${fmt.eur(a.preis_eur)}`
                );
                remaining -= unitsToSell * a.preis_eur;
            }
        });

        return plan;
    }

    /* ──────────────────────────────────────────────────────────────
       Suggest buys for underdeployed capital.

       Iterates all unrepresented sectors. Once a sector is picked,
       its swap_recommendations are added to an exclusion set so we
       never suggest two sectors that are swappable with each other.
    ─────────────────────────────────────────────────────────────── */

    _suggestBuys(gap, target) {
        const held        = new Set(this.portfolio.members.map(m => m.ISIN));
        const heldSectors = new Set(
            this.portfolio.members
                .map(m => this.portfolio.assetOf(m.ISIN)?.sector)
                .filter(Boolean)
        );

        const excluded    = new Set(); // grows as we pick sectors
        const suggestions = [];
        const budget      = Math.min(gap * 0.04, target * 0.04);

        ASSET_DB.sectors.forEach(sec => {
            if (suggestions.length >= 3) return;
            if (sec.id === 12)            return; // skip Cash
            if (heldSectors.has(sec.id)) return; // already held
            if (excluded.has(sec.id))    return; // swap-partner of a picked sector

            const candidates = ASSET_DB.assets.filter(
                a => a.sector === sec.id && !held.has(a.ISIN)
            );
            if (!candidates.length) return;

            const a   = candidates[0];
            const qty = Math.floor(budget / a.preis_eur);
            if (qty < 1) return;

            suggestions.push(
                `Consider: ${qty} × ${fmt.shortName(a.name, 26)} (${sec.name})`
            );

            // Exclude this sector's swap partners from future picks
            (sec.swap_recommendations || []).forEach(id => excluded.add(id));
        });

        return suggestions;
    }
}
