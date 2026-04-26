/**
 * main.js
 * Quantalox — Application orchestrator.
 *
 * Wires together Portfolio, RulesEngine, and Renderer.
 * Handles all user events and file I/O.
 * Exposes a single global `main` object so HTML onclick attributes
 * have a clean, explicit call surface.
 *
 * Depends on: data.js, fmt.js, portfolio.js, rules.js, render.js
 */

const TAX_RATE = 0.26; // Capital gains tax rate — adjust here for different jurisdictions

const main = (() => {

    /* ──────────────────────────────────────────────────────────────
       Module-level state
    ─────────────────────────────────────────────────────────────── */

    let portfolio = null;   // Portfolio instance, or null when none loaded
    let renderer  = null;   // Renderer instance
    let engine    = null;   // RulesEngine instance

    /* ──────────────────────────────────────────────────────────────
       Initialisation (called on DOMContentLoaded)
    ─────────────────────────────────────────────────────────────── */

    function init() {
        renderer = new Renderer();
        renderer.library('', new Set());
        renderer.showAdvisoryEmpty();
        renderer.setHeaderPortfolioMode(false); // start: no portfolio active
        _bindEvents();
    }

    function _bindEvents() {
        document.getElementById('fileInput')
            .addEventListener('change', _handleUpload);

        document.getElementById('targetInp')
            .addEventListener('change', e => onTargetChange(e.target.value));

        document.getElementById('searchInput')
            .addEventListener('input', e => _refreshLibrary(e.target.value));
    }

    /* ──────────────────────────────────────────────────────────────
       Full render cycle — called after any state change
    ─────────────────────────────────────────────────────────────── */

    function _render() {
        if (!portfolio) return;

        const stats = portfolio.computeStats();
        engine      = new RulesEngine(portfolio, TAX_RATE);
        const recs  = engine.generate(stats);

        const projections = {
            taxRate:  TAX_RATE,
            horizons: [
                { label: '1 Year',   data: portfolio.project(1,  TAX_RATE) },
                { label: '5 Years',  data: portfolio.project(5,  TAX_RATE) },
                { label: '10 Years', data: portfolio.project(10, TAX_RATE) }
            ]
        };

        renderer.progressBar(stats);
        renderer.composition(stats);
        renderer.advisory(recs, projections, stats.totalValue);
        renderer.updateHeader(portfolio.name);
        _refreshLibrary(document.getElementById('searchInput').value);
    }

    function _refreshLibrary(filter) {
        const held = portfolio
            ? new Set(portfolio.members.map(m => m.ISIN))
            : new Set();
        renderer.library(filter, held);
    }

    /* ──────────────────────────────────────────────────────────────
       Public event handlers — called by HTML onclick
    ─────────────────────────────────────────────────────────────── */

    function onLibraryAssetClick(isin) {
        if (!portfolio) {
            alert('Please create or load a portfolio first.');
            return;
        }
        if (portfolio.addMember(isin)) {
            _render();
        }
    }

    function onRemoveAsset(isin) {
        if (!portfolio) return;
        portfolio.removeMember(isin);
        _render();
    }

    /**
     * Called on every keystroke in a row's inputs.
     * Marks the ✓ button as dirty so the user knows there are uncommitted changes.
     * Does NOT re-render — that only happens on explicit ✓ click.
     */
    function onRowDirty(isin) {
        const btn = document.getElementById(`validate-${isin}`);
        if (btn) btn.classList.add('dirty');
    }

    /**
     * Reads both qty and purchase price directly from the DOM inputs
     * for a given ISIN, commits them to the portfolio, then re-renders.
     * Called by the ✓ button on each asset row.
     */
    function onValidateRow(isin) {
        if (!portfolio) return;

        const qtyEl   = document.getElementById(`qty-${isin}`);
        const priceEl = document.getElementById(`price-${isin}`);

        if (qtyEl)   portfolio.setQty(isin, qtyEl.value);
        if (priceEl) portfolio.setPurchasePrice(isin, priceEl.value);

        _render();
    }

    function onTargetChange(value) {
        if (!portfolio) return;
        portfolio.target_eur = parseFloat(value) || 0;
        _render();
    }

    /* ──────────────────────────────────────────────────────────────
       Header actions — called by HTML onclick
    ─────────────────────────────────────────────────────────────── */

    function triggerUpload() {
        document.getElementById('fileInput').click();
    }

    function newPortfolio() {
        const name = (prompt('Portfolio name (optional):', '') ?? '').trim();
        if (name === null) return;

        const rawTarget = prompt('Portfolio target in EUR:', '100000');
        if (rawTarget === null) return;

        const target = parseFloat(rawTarget.replace(/[^0-9.]/g, ''));
        if (isNaN(target) || target <= 0) {
            alert('Please enter a valid target amount.');
            return;
        }

        portfolio = new Portfolio(name, target, []);
        _activatePortfolio();
    }

    function downloadPortfolio() {
        if (!portfolio) return;

        const json = JSON.stringify(portfolio.toJSON(), null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = (portfolio.name || 'portfolio').replace(/\s+/g, '_') + '.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    /* ──────────────────────────────────────────────────────────────
       File upload handler
    ─────────────────────────────────────────────────────────────── */

    function _handleUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                portfolio = Portfolio.fromJSON(parsed);
                _activatePortfolio();
            } catch (err) {
                alert('Could not load portfolio: ' + err.message);
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // allow re-uploading the same file
    }

    /**
     * Shared activation path for both newPortfolio() and _handleUpload().
     * Switches the UI into work mode and triggers a full render.
     */
    function _activatePortfolio() {
        renderer.showWorkArea(portfolio.target_eur);
        renderer.setHeaderPortfolioMode(true);  // show Save, hide New Portfolio
        _render();
    }

    /* ──────────────────────────────────────────────────────────────
       Expose public interface
    ─────────────────────────────────────────────────────────────── */

    return {
        init,
        onLibraryAssetClick,
        onRemoveAsset,
        onRowDirty,
        onValidateRow,
        onTargetChange,
        triggerUpload,
        newPortfolio,
        downloadPortfolio
    };

})();

/* ──────────────────────────────────────────────────────────────────
   Bootstrapping — ASSET_DB is already available because assetlist.js
   is loaded as a <script> tag before this file in index.html.
────────────────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    if (typeof ASSET_DB === 'undefined') {
        document.body.innerHTML = `
            <div style="
                display:flex; flex-direction:column; align-items:center;
                justify-content:center; height:100vh; gap:1rem;
                font-family:'Outfit',sans-serif; color:#c0392b;
                background:#fdf2f2; text-align:center; padding:2rem;">
                <div style="font-size:1.1rem; font-weight:600;">Asset database not found</div>
                <div style="font-size:0.82rem; color:#555; max-width:420px; line-height:1.6;">
                    Make sure <code>assetlist.js</code> is in the same folder as <code>index.html</code>.
                </div>
                <div style="font-size:0.75rem; color:#888;">
                    The file must start with: <code>const ASSET_DB = {</code>
                </div>
            </div>`;
        return;
    }
    main.init();
});
