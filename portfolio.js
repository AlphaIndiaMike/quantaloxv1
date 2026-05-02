/**
 * portfolio.js
 * Quantalox — Portfolio state manager and computation engine.
 *
 * Responsibilities:
 *   - Hold the current portfolio state (members, target, name)
 *   - Load from / serialise to user JSON
 *   - Expose computed statistics (sector grouping, values, ratios)
 *   - Expose growth projections
 *
 * Depends on: data.js (ASSET_DB)
 */

class Portfolio {

    /**
     * @param {string} name          - Portfolio display name
     * @param {number} target_eur    - Target portfolio size in EUR
     * @param {Array}  members       - [{ISIN, qty, purchase_price_eur}]
     */
    constructor(name = '', target_eur = 100000, members = []) {
        this.name       = name;
        this.target_eur = target_eur;
        this.members    = members;
    }

    /* ──────────────────────────────────────────────────────────────
       Lookups into ASSET_DB
    ─────────────────────────────────────────────────────────────── */

    assetOf(isin) {
        return ASSET_DB.assets.find(a => a.ISIN === isin) || null;
    }

    sectorOf(id) {
        return ASSET_DB.sectors.find(s => s.id === id) || null;
    }

    assetClassOf(id) {
        return ASSET_DB.asset_kl.find(k => k.id === id) || null;
    }

    /* ──────────────────────────────────────────────────────────────
       Member operations
    ─────────────────────────────────────────────────────────────── */

    hasMember(isin) {
        return this.members.some(m => m.ISIN === isin);
    }

    /**
     * Add an asset to the portfolio.
     * Defaults purchase_price_eur to the current market price in the DB.
     */
    addMember(isin) {
        if (this.hasMember(isin)) return false;
        const a = this.assetOf(isin);
        if (!a) return false;
        this.members.push({
            ISIN:               isin,
            qty:                1,
            purchase_price_eur: a.preis_eur   // default: current price
        });
        return true;
    }

    removeMember(isin) {
        const before = this.members.length;
        this.members = this.members.filter(m => m.ISIN !== isin);
        return this.members.length < before;
    }

    setQty(isin, qty) {
        const m = this.members.find(m => m.ISIN === isin);
        if (m) { m.qty = parseFloat(qty) || 0; return true; }
        return false;
    }

    /**
     * Update the purchase price for a member.
     * This is what Rule 3 (don't lose money) is evaluated against.
     * @param {string} isin
     * @param {number} price - purchase price per unit in EUR
     */
    setPurchasePrice(isin, price) {
        const m = this.members.find(m => m.ISIN === isin);
        if (m) { m.purchase_price_eur = parseFloat(price) || 0; return true; }
        return false;
    }

    /* ──────────────────────────────────────────────────────────────
       Statistics — the core computation
       Returns an object consumed by rules.js and render.js
    ─────────────────────────────────────────────────────────────── */

    computeStats() {
        const target = this.target_eur;
        let totalValue = 0;
        const sectorMap = {};

        this.members.forEach(m => {
            const a = this.assetOf(m.ISIN);
            if (!a) return;

            const val = m.qty * a.preis_eur;
            totalValue += val;

            if (!sectorMap[a.sector]) {
                sectorMap[a.sector] = {
                    sector: this.sectorOf(a.sector),
                    value:  0,
                    assets: []
                };
            }
            sectorMap[a.sector].value += val;
            sectorMap[a.sector].assets.push({ member: m, asset: a, value: val });
        });

        // Preserve insertion order of sectors (order assets were added).
        // Sorting is an opt-in toggle in the UI, not applied here.
        // Cash always last regardless.
        const sectors = Object.values(sectorMap).sort((a, b) => {
            if (a.sector.id === 12) return  1;
            if (b.sector.id === 12) return -1;
            return 0; // preserve map insertion order
        });

        // Count non-cash sectors that have assets — used for the equal-weight guide
        const activeSectorCount = sectors.filter(s => s.sector.id !== 12).length;

        return {
            target,
            totalValue,
            ratio:              target > 0 ? totalValue / target : 0,
            sectors,
            activeSectorCount
        };
    }

    /* ──────────────────────────────────────────────────────────────
       Growth projections
       Returns { total, capital, dividends } for a given year horizon.
    ─────────────────────────────────────────────────────────────── */

    /* ──────────────────────────────────────────────────────────────
       Performance projection for a given period.

       Uses actual historical performance fields from assetlist.js:
         perf_m1, perf_m3, perf_m6, perf_1y, perf_3y

       Math: gain = current_value × (perf_Xy - 1)
       e.g.  perf_1y = 1.0706  →  +7.06% gain over 1 year
             perf_3y = 0.9630  →  -3.70% loss over 3 years

       Dividends are shown separately as a flat annual yield
       scaled to the period (no compounding, no tax).

       Returns { gain, dividends, total, perfPct }
    ─────────────────────────────────────────────────────────────── */

    project(perfKey, yearsForDividends = 1) {
        let gain      = 0;
        let dividends = 0;

        this.members.forEach(m => {
            const a = this.assetOf(m.ISIN);
            if (!a) return;

            const currentValue = m.qty * a.preis_eur;
            const perf         = a[perfKey];

            // Capital gain for the period — only if data is available
            if (perf != null) {
                gain += currentValue * (perf - 1);
            }

            // Dividends: flat annual yield scaled to the period
            dividends += m.qty * (a.dividend_y_y_eur || 0) * yearsForDividends;
        });

        const totalValue = this.members.reduce(
            (sum, m) => sum + m.qty * (this.assetOf(m.ISIN)?.preis_eur || 0), 0
        );

        return {
            gain,
            dividends,
            total:    totalValue + gain + dividends,
            perfPct:  totalValue > 0 ? (gain / totalValue) * 100 : 0
        };
    }

    /* ──────────────────────────────────────────────────────────────
       Serialisation — user JSON format
    ─────────────────────────────────────────────────────────────── */

    toJSON() {
        return {
            name:       this.name,
            target_eur: this.target_eur,
            members:    this.members
        };
    }

    /**
     * Validate and load from a plain object (parsed JSON).
     * Returns a Portfolio instance or throws on invalid format.
     */
    static fromJSON(obj) {
        if (!obj || !Array.isArray(obj.members)) {
            throw new Error('Invalid portfolio JSON: missing "members" array.');
        }
        return new Portfolio(
            obj.name       || '',
            obj.target_eur || 100000,
            obj.members
        );
    }
}
