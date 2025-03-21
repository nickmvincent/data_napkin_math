/**
 * Utility functions for formatting values
 */

/**
 * Format a variable key into a readable label
 * @param {string} key - Variable key
 * @returns {string} - Formatted label
 */
export function formatLabel(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

/**
 * Format a value according to its scale
 * @param {number} value - Raw value
 * @param {number} scale - Scale factor
 * @returns {number} - Formatted value
 */
export function formatValue(value, scale) {
    return scale ? value / scale : value;
}

/**
 * Format a number in a human-readable way
 * @param {number} value - Number to format
 * @returns {string} - Formatted string
 */
export function humanReadable(value) {
    if (value === 0) return "0";

    if (Math.abs(value) < 1) {
        let valueStr = value.toString();
        let firstNonZeroIndex = valueStr.indexOf(valueStr.match(/[1-9]/));
        return value.toFixed(firstNonZeroIndex + 1);
    }

    const units = ["", "thousand", "million", "billion", "trillion"];
    const order = Math.floor(Math.log10(Math.abs(value)) / 3);

    if (order === 0) {
        return value.toFixed(2);
    }

    const unitName = units[order] || `10^${order * 3}`;
    const adjustedValue = value / Math.pow(10, 3 * order);

    return `${adjustedValue.toFixed(2)} ${unitName}`;
}

/**
 * Format a date to a locale string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    return date.toLocaleString();
}

/**
 * Format a URL for display
 * @param {string} url - URL to format
 * @param {number} maxLength - Maximum display length
 * @returns {string} - Formatted URL
 */
export function formatUrl(url, maxLength = 40) {
    if (!url) return '';
    if (url.length <= maxLength) return url;

    // Remove protocol
    let formatted = url.replace(/^https?:\/\//, '');

    if (formatted.length <= maxLength) return formatted;

    // Truncate middle
    const start = formatted.substring(0, Math.floor(maxLength / 2) - 2);
    const end = formatted.substring(formatted.length - Math.floor(maxLength / 2) + 2);

    return `${start}...${end}`;
}