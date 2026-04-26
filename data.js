/**
 * data.js
 * Quantalox — Asset database loader.
 *
 * Reads assetlist.json from the same directory as index.html.
 * Sets the global ASSET_DB once the file is parsed.
 *
 * Call:  await loadAssetDB()   before using ASSET_DB anywhere.
 * Used by: main.js bootstrapping (DOMContentLoaded handler).
 */

let ASSET_DB = null;

async function loadAssetDB() {
    const response = await fetch('./assetlist.json');

    if (!response.ok) {
        throw new Error(
            `Could not load assetlist.json (HTTP ${response.status}). ` +
            `Make sure the file is in the same folder as index.html.`
        );
    }

    ASSET_DB = await response.json();
}
