/**
 * Utility functions for data validation
 */

/**
 * Validate that a value is a number
 * @param {any} value - Value to check
 * @returns {boolean} - True if value is a valid number
 */
export function isValidNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Validate chart data points
 * @param {Array} data - Array of data points
 * @returns {boolean} - True if all points are valid
 */
export function validateChartData(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return false;
    }

    // Check that all data points are valid numbers
    return data.every(point =>
        point !== undefined &&
        point !== null &&
        isValidNumber(point)
    );
}

/**
 * Validate a scenario object
 * @param {Object} scenario - Scenario to validate
 * @returns {Object} - Object with validation result and errors
 */
export function validateScenario(scenario) {
    const errors = [];

    if (!scenario.title) {
        errors.push('Missing scenario title');
    }

    if (!scenario.description) {
        errors.push('Missing scenario description');
    }

    if (!Array.isArray(scenario.input_variables) || scenario.input_variables.length === 0) {
        errors.push('Missing or empty input variables');
    }

    if (!scenario.calculation_type) {
        errors.push('Missing calculation type');
    }

    if (scenario.calculation_type === 'operations' && !scenario.operations) {
        errors.push('Missing operations for calculation');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate an input object
 * @param {Object} input - Input to validate
 * @returns {Object} - Object with validation result and errors
 */
export function validateInput(input) {
    const errors = [];

    if (!input.variable_name) {
        errors.push('Missing variable name');
    }

    if (input.value === undefined) {
        errors.push('Missing value');
    }

    if (!input.variable_type) {
        errors.push('Missing variable type');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate the entire data object
 * @param {Object} data - Data object to validate
 * @returns {Object} - Object with validation result and errors
 */
export function validateData(data) {
    const errors = [];

    if (!data) {
        return {
            isValid: false,
            errors: ['Missing data object']
        };
    }

    if (!Array.isArray(data.inputs) || data.inputs.length === 0) {
        errors.push('Missing or empty inputs array');
    }

    if (!Array.isArray(data.scenarios) || data.scenarios.length === 0) {
        errors.push('Missing or empty scenarios array');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}