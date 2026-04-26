/**
 * fmt.js
 * QuantLux — Shared formatting utilities.
 *
 * A plain object (no class needed) with static-style helpers used
 * across rules.js and render.js. Centralising formatting here means
 * locale and precision changes only need to happen in one place.
 */

const fmt = {

    /**
     * Format a number as EUR currency.
     * @param {number} n
     * @param {number} decimals  - decimal places (default 2)
     */
    eur(n, decimals = 2) {
        if (isNaN(n) || n === null) return '€—';
        return '€' + n.toLocaleString('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * Format a number as a percentage string.
     * @param {number} n        - already multiplied (e.g. pass 20 for 20%)
     * @param {number} decimals
     */
    pct(n, decimals = 1) {
        return n.toLocaleString('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + '%';
    },

    /**
     * Truncate a long asset name with an ellipsis.
     * @param {string} name
     * @param {number} maxLen
     */
    shortName(name, maxLen = 34) {
        if (!name || name.length <= maxLen) return name;
        const words = name.split(' ');
        let result = '';
        for (const word of words) {
            if ((result + word).length > maxLen - 1) return result.trim() + '…';
            result += word + ' ';
        }
        return result.trim();
    },

    /**
     * Format a plain number (no currency symbol), used for input placeholders.
     * @param {number} n
     * @param {number} decimals
     */
    num(n, decimals = 2) {
        if (isNaN(n) || n === null) return '';
        return n.toLocaleString('de-DE', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    },

    /**
     * Escape HTML special characters to prevent injection in innerHTML.
     */
    escHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
};
