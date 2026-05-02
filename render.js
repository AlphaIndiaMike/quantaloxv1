/**
 * render.js
 * Quantalox — DOM rendering engine.
 *
 * Responsible for all visual updates to the page.
 * Never modifies portfolio state — it only reads and draws.
 *
 * Public methods (called from main.js):
 *   render.library(filter, heldISINs)
 *   render.progressBar(stats)
 *   render.composition(stats)
 *   render.advisory(recs, projections, currentValue)
 *   render.showWorkArea(targetEur)
 *   render.updateHeader(name)
 *   render.setHeaderPortfolioMode(active)  — controls New Portfolio / Save button visibility
 *   render.showAdvisoryEmpty()
 *
 * Depends on: data.js (ASSET_DB), fmt.js
 */

class Renderer {

    constructor() {
        // Cache element references once on construction
        this.elLibrary       = document.getElementById('assetLibrary');
        this.elWelcome       = document.getElementById('welcomeState');
        this.elWorkArea      = document.getElementById('workArea');
        this.elTrackFill     = document.getElementById('trackFill');
        this.elProgCurrent   = document.getElementById('progCurrent');
        this.elProgTarget    = document.getElementById('progTarget');
        this.elProgStatus    = document.getElementById('progStatus');
        this.elProgPct       = document.getElementById('progPct');
        this.elComposition   = document.getElementById('compositionArea');
        this.elCompGuide     = document.getElementById('compGuide');
        this.elAdvisory      = document.getElementById('advisoryPanel');
        this.elPortfolioPill = document.getElementById('portfolioNamePill');
        this.elTargetInp     = document.getElementById('targetInp');
    }

    /* ──────────────────────────────────────────────────────────────
       Left pane — asset library
    ─────────────────────────────────────────────────────────────── */

    library(filter = '', heldISINs = new Set()) {
        const q = filter.trim().toLowerCase();
        let html = '';

        ASSET_DB.sectors.forEach(sec => {
            const assets = ASSET_DB.assets.filter(a =>
                a.sector === sec.id &&
                (!q ||
                    a.name.toLowerCase().includes(q) ||
                    a.ISIN.toLowerCase().includes(q) ||
                    sec.name.toLowerCase().includes(q)
                )
            );
            if (!assets.length) return;

            html += `
                <div class="lib-sector">
                    <span class="lib-dot" style="background:${sec.color}"></span>
                    ${fmt.escHtml(sec.name)}
                </div>`;

            assets.forEach(a => {
                const held = heldISINs.has(a.ISIN);
                html += `
                <div class="lib-asset${held ? ' held' : ''}"
                     onclick="main.onLibraryAssetClick('${a.ISIN}')"
                     title="${fmt.escHtml(a.name)} · ${a.ISIN}">
                    <div class="lib-asset-name">${fmt.shortName(a.name)}</div>
                    <div class="lib-asset-price">${fmt.eur(a.preis_eur)}</div>
                    <span class="lib-add">+</span>
                </div>`;
            });
        });

        this.elLibrary.innerHTML = html ||
            '<div style="padding:1rem 0.75rem;font-size:0.7rem;color:var(--text-dim)">No assets found.</div>';
    }

    /* ──────────────────────────────────────────────────────────────
       Middle pane — progress bar
    ─────────────────────────────────────────────────────────────── */

    progressBar(stats) {
        const { totalValue, ratio, target } = stats;
        const color    = this._deployColor(ratio);
        const clampPct = Math.min(ratio * 100, 100);

        this.elTrackFill.style.width      = clampPct + '%';
        this.elTrackFill.style.background = color;
        this.elProgCurrent.textContent    = fmt.eur(totalValue);
        this.elProgCurrent.style.color    = color;
        this.elProgTarget.textContent     = fmt.eur(target);
        this.elProgStatus.textContent     = this._deployLabel(ratio);
        this.elProgStatus.style.color     = color;
        this.elProgPct.textContent        = fmt.pct(ratio * 100);
    }

    _deployColor(r) {
        if (r === 0)   return 'var(--text-dim)';
        if (r < 0.96)  return 'var(--red)';
        if (r < 0.99)  return 'var(--amber)';
        if (r <= 1.01) return 'var(--green)';
        if (r <= 1.05) return 'var(--amber)';
        return 'var(--red)';
    }

    _deployLabel(r) {
        if (r === 0)   return 'NO POSITIONS';
        if (r < 0.96)  return 'UNDERDEPLOYED';
        if (r < 0.99)  return 'APPROACHING TARGET';
        if (r <= 1.01) return 'OPTIMAL';
        if (r <= 1.05) return 'SLIGHTLY OVER TARGET';
        return 'REBALANCE REQUIRED';
    }

    /* ──────────────────────────────────────────────────────────────
       Middle pane — equal weight guide (shown next to "Portfolio
       Composition" label)

       Logic:
         - Count active non-cash sectors
         - Equal sector budget = min(target / numSectors, target × 20%)
         - Equal asset budget  = target × 5% (hard cap)
    ─────────────────────────────────────────────────────────────── */

    _updateEqualGuide(stats) {
        const { target, activeSectorCount } = stats;
        if (!this.elCompGuide) return;

        if (activeSectorCount === 0 || target === 0) {
            this.elCompGuide.textContent = '';
            return;
        }

        const equalPerSector = Math.min(target / activeSectorCount, target * 0.20);
        const equalPerAsset  = target * 0.05;

        this.elCompGuide.innerHTML =
            `Equal weight · <strong>${fmt.eur(equalPerSector, 0)}</strong>/sector` +
            ` &nbsp;|&nbsp; <strong>${fmt.eur(equalPerAsset, 0)}</strong>/asset (5% max)`;
    }

    /* ──────────────────────────────────────────────────────────────
       Middle pane — portfolio composition
       Columns: Asset name | Qty | Buy @ | Current value | % target | ✕
    ─────────────────────────────────────────────────────────────── */

    composition(stats, sortByValue = false) {
        this._updateEqualGuide(stats);

        if (!stats.sectors.length) {
            this.elComposition.innerHTML =
                '<div class="empty-comp">← Click any asset in the library to add it to your portfolio.</div>';
            return;
        }

        // Sort is opt-in — insertion order is the default
        const sectors = sortByValue
            ? [...stats.sectors].sort((a, b) => {
                if (a.sector.id === 12) return  1;
                if (b.sector.id === 12) return -1;
                return b.value - a.value;
              })
            : stats.sectors;

        // Update sort button appearance
        const btnSort = document.getElementById('btnSort');
        if (btnSort) btnSort.classList.toggle('sort-active', sortByValue);

        const { target } = stats;
        let html = '';

        sectors.forEach(({ sector, value, assets }) => {
            const sectorPct = value / target * 100;
            const isOver    = sector.id !== 12 && sectorPct > 20;
            const isWarn    = sector.id !== 12 && sectorPct > 18;
            const badgeCls  = isOver ? 'badge-over' : isWarn ? 'badge-warn' : 'badge-ok';

            // Sector color comes from the DB (sector.color), not hardcoded here
            html += `
            <div class="sector-block">
                <div class="sector-hd">
                    <div class="sector-bar" style="background:${sector.color}"></div>
                    <div class="sector-hd-name">${fmt.escHtml(sector.name)}</div>
                    <div class="sector-hd-val">${fmt.eur(value)}</div>
                    <span class="badge ${badgeCls}">${fmt.pct(sectorPct)}</span>
                </div>
                <div class="asset-cols-hd">
                    <div>Asset</div>
                    <div class="tr">Qty</div>
                    <div class="tr">Buy @</div>
                    <div></div>
                    <div class="tr">Current Value</div>
                    <div class="tr">% Tgt</div>
                    <div></div>
                </div>`;

            assets.forEach(({ member: m, asset: a, value: av }) => {
                const assetPct = av / target * 100;

                // P&L: current price vs purchase price (used for colour signal and Rule 3)
                const purchasePrice = m.purchase_price_eur || 0;
                const pnl           = purchasePrice > 0 ? a.preis_eur - purchasePrice : null;
                const pnlPct        = (pnl !== null && purchasePrice > 0)
                                        ? (pnl / purchasePrice * 100) : null;
                const pnlCls        = pnl !== null ? (pnl >= 0 ? 'pnl-pos' : 'pnl-neg') : '';
                const pnlStr        = pnlPct !== null
                                        ? ((pnlPct >= 0 ? '+' : '') + fmt.pct(pnlPct) + ' P&L')
                                        : '';

                const pctCls = (assetPct > 5   && a.sector !== 12) ? 'pct-over'
                             : (assetPct > 4.5  && a.sector !== 12) ? 'pct-warn'
                             : 'pct-ok';

                html += `
                <div class="asset-row">
                    <div class="asset-row-name">
                        ${fmt.shortName(a.name, 30)}
                        <span class="asset-row-isin">
                            ${a.ISIN} · ${fmt.eur(a.preis_eur)}${pnlStr ? ` <span class="${pnlCls}">· ${pnlStr}</span>` : ''}
                        </span>
                    </div>
                    <div>
                        <input class="cell-inp" type="number" min="0" step="1"
                            id="qty-${m.ISIN}"
                            value="${m.qty}"
                            oninput="main.onRowDirty('${m.ISIN}')"
                            title="Quantity held">
                    </div>
                    <div>
                        <input class="cell-inp" type="number" min="0" step="0.01"
                            id="price-${m.ISIN}"
                            value="${purchasePrice || ''}"
                            placeholder="${fmt.num(a.preis_eur)}"
                            oninput="main.onRowDirty('${m.ISIN}')"
                            title="Purchase price per unit">
                    </div>
                    <div>
                        <button class="btn-validate"
                            id="validate-${m.ISIN}"
                            onclick="main.onValidateRow()"
                            title="Confirm changes">✓</button>
                    </div>
                    <div class="asset-row-val">${fmt.eur(av)}</div>
                    <div class="asset-row-pct ${pctCls}">${fmt.pct(assetPct)}</div>
                    <div>
                        <button class="btn-rm"
                            onclick="main.onRemoveAsset('${m.ISIN}')"
                            title="Remove from portfolio">✕</button>
                    </div>
                </div>`;
            });

            html += '</div>'; // sector-block
        });

        this.elComposition.innerHTML = html;
    }

    /* ──────────────────────────────────────────────────────────────
       Right pane — advisory panel
    ─────────────────────────────────────────────────────────────── */

    advisory(recs, projections, currentValue) {
        let html = '';

        recs.forEach(r => {
            html += `
            <div class="rec-card sev-${r.sev}">
                <div class="rec-title ${r.sev}">${fmt.escHtml(r.title)}</div>
                <div class="rec-body">${r.body.replace(/\n/g, '<br>')}</div>
                ${r.actions.map(a => `<span class="rec-action">${fmt.escHtml(a)}</span>`).join('')}
            </div>`;
        });

        // Performance Estimation — only show if all portfolio assets have perf fields
        const PERF_FIELDS = ['perf_m1', 'perf_m3', 'perf_m6', 'perf_1y', 'perf_3y'];
        const missingAssets = [];

        if (projections && projections.horizons) {
            // Check which assets are missing perf data
            // We access ASSET_DB directly since renderer knows about it
            if (typeof ASSET_DB !== 'undefined') {
                const heldISINs = projections.heldISINs || [];
                heldISINs.forEach(isin => {
                    const a = ASSET_DB.assets.find(x => x.ISIN === isin);
                    if (!a) return;
                    const missing = PERF_FIELDS.filter(f => a[f] == null);
                    if (missing.length > 0) missingAssets.push(a.name);
                });
            }
        }

        html += `<div class="growth-block"><div class="growth-hd">Performance Estimation</div>`;

        if (missingAssets.length > 0) {
            html += `
            <div class="rec-card sev-info">
                <div class="rec-title info">Cannot be calculated</div>
                <div class="rec-body">
                    One or more assets are missing historical performance data.
                    Add the following fields to each asset in <code>assetlist.js</code>:
                </div>
                <span class="rec-action">"perf_m1": 1.0281</span>
                <span class="rec-action">"perf_m3": 1.0588</span>
                <span class="rec-action">"perf_m6": 1.0861</span>
                <span class="rec-action">"perf_1y": 1.0706</span>
                <span class="rec-action">"perf_3y": 0.9630</span>
            </div>`;
        } else if (projections && projections.horizons) {
            projections.horizons.forEach(({ label, data }) => {
                const gainCls = data.gain >= 0 ? 'g-pos' : 'g-neg';
                const gainStr = (data.gain >= 0 ? '+' : '') + fmt.eur(data.gain, 0);
                const pctStr  = (data.perfPct >= 0 ? '+' : '') + fmt.pct(data.perfPct);

                html += `
                <div class="growth-row">
                    <div class="growth-period">${label}</div>
                    <div class="growth-right">
                        <div class="growth-total">${fmt.eur(data.total, 0)}</div>
                        <div class="growth-detail">
                            <span class="${gainCls}">${gainStr} (${pctStr})</span>
                            &nbsp;· Div: ${fmt.eur(data.dividends, 0)}
                        </div>
                    </div>
                </div>`;
            });
        }

        html += '</div>';
        this.elAdvisory.innerHTML = html;
    }

    /* ──────────────────────────────────────────────────────────────
       UI state helpers
    ─────────────────────────────────────────────────────────────── */

    showWorkArea(targetEur) {
        this.elWelcome.style.display        = 'none';
        this.elWorkArea.style.display       = 'flex';
        this.elWorkArea.style.flexDirection = 'column';
        this.elTargetInp.value              = targetEur;
    }

    /**
     * Switches the header between "no portfolio" mode and "active portfolio" mode.
     *   active = false  →  "New Portfolio" visible (outline), "Save" hidden
     *   active = true   →  "Save" visible (primary/highlighted), "New Portfolio" hidden
     *
     * Uses getElementById directly (not cached refs) to be safe against
     * any timing edge-cases during initialisation.
     */
    setHeaderPortfolioMode(active) {
        const btnSave = document.getElementById('btnSave');
        const btnNew  = document.getElementById('btnNew');
        if (!btnSave || !btnNew) return;

        btnSave.style.display = active ? 'inline-flex' : 'none';
        btnNew.style.display  = active ? 'none'        : 'inline-flex';
    }

    updateHeader(name) {
        if (name) {
            this.elPortfolioPill.textContent   = name;
            this.elPortfolioPill.style.display = '';
        } else {
            this.elPortfolioPill.style.display = 'none';
        }
    }

    showAdvisoryEmpty() {
        this.elAdvisory.innerHTML =
            '<div class="advisory-empty">Load or create a portfolio to see recommendations and growth projections.</div>';
    }
}
