/**
 * Utility functions for chart creation and management
 */
import { validateChartData } from './validators.js';
import { humanReadable } from './formatters.js';

/**
 * Load Chart.js library and necessary plugins asynchronously
 * @returns {Promise} - Resolves when Chart.js is loaded
 */
export function loadChartLibrary() {
    return new Promise(async (resolve, reject) => {
        try {
            // Check if Chart.js is already loaded
            if (typeof Chart !== 'undefined') {
                // If Chart.js is loaded, check for annotation plugin
                await loadChartAnnotationPlugin();
                resolve();
                return;
            }

            // Load Chart.js first
            const chartScript = document.createElement('script');
            chartScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js';
            chartScript.async = true;

            chartScript.onload = async () => {
                console.log('Chart.js loaded successfully');

                // Then load annotation plugin
                try {
                    await loadChartAnnotationPlugin();
                    resolve();
                } catch (annotationError) {
                    console.warn('Chart annotation plugin failed to load:', annotationError);
                    // Still resolve since the core Chart.js loaded
                    resolve();
                }
            };

            chartScript.onerror = () => {
                console.error('Failed to load Chart.js');
                reject(new Error('Failed to load Chart.js'));
            };

            document.head.appendChild(chartScript);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Load Chart.js Annotation plugin
 * @returns {Promise} - Resolves when annotation plugin is loaded
 */
function loadChartAnnotationPlugin() {
    return new Promise((resolve, reject) => {
        // Check if plugin is already registered
        if (Chart && Chart.registry &&
            Chart.registry.plugins &&
            Chart.registry.plugins.items &&
            Chart.registry.plugins.items.annotation) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/2.1.0/chartjs-plugin-annotation.min.js';
        script.async = true;

        script.onload = () => {
            console.log('Chart.js Annotation plugin loaded successfully');
            resolve();
        };

        script.onerror = () => {
            console.error('Failed to load Chart.js Annotation plugin');
            reject(new Error('Failed to load Chart.js Annotation plugin'));
        };

        document.head.appendChild(script);
    });
}

/**
 * Create sensitivity analysis chart data
 * @param {Object} scenario - Scenario object
 * @param {string} variableKey - Key of variable to analyze
 * @param {Object} inputs - All input variables
 * @param {number} range - Range multiplier
 * @returns {Object} - Chart data
 */
export function createSensitivityData(scenario, variableKey, inputs, range = 5) {
    const currentValue = inputs[variableKey]?.value;
    if (currentValue === undefined) {
        throw new Error(`No value found for ${variableKey}`);
    }

    const scale = inputs[variableKey].scale || 1;

    // Generate data points
    const points = 50;
    const minFactor = 1 / range;
    const maxFactor = range;
    const step = (maxFactor - minFactor) / points;

    const chartData = [];
    const originalValues = {};

    // Store original values
    scenario.inputs.forEach(key => {
        originalValues[key] = inputs[key].value;
    });

    // Calculate result for each point in the range
    for (let i = 0; i <= points; i++) {
        const factor = minFactor + (step * i);
        const newValue = currentValue * factor;

        // Update the input value temporarily
        inputs[variableKey].value = newValue;

        try {
            const inputValues = scenario.inputs.map(key => inputs[key].value);
            const result = scenario.calculate(...inputValues);

            // Format the label based on scale
            let formattedValue;
            if (scale >= 1000000) {
                formattedValue = `${(newValue / scale).toFixed(1)}M`;
            } else if (scale >= 1000) {
                formattedValue = `${(newValue / scale).toFixed(1)}K`;
            } else {
                formattedValue = newValue.toFixed(1);
            }

            // Add to chart data
            chartData.push({
                x: formattedValue,
                y: result,
                rawX: newValue
            });
        } catch (e) {
            console.error('Error calculating sensitivity point:', e);
            // Skip this point but continue with others
        }
    }

    // Restore original values
    Object.entries(originalValues).forEach(([key, value]) => {
        inputs[key].value = value;
    });

    // Sort data by x value (numerically)
    chartData.sort((a, b) => a.rawX - b.rawX);

    // Extract labels and data for chart
    const labels = chartData.map(point => point.x);
    const data = chartData.map(point => point.y);

    // Validate data
    if (!validateChartData(data) || !labels.length) {
        throw new Error('Invalid chart data');
    }

    return {
        labels,
        data,
        chartData // Full data with metadata
    };
}

/**
 * Create Chart.js configuration for sensitivity chart
 * @param {Object} data - Chart data from createSensitivityData
 * @param {Object} scenario - Scenario object
 * @param {Object} input - Input variable being analyzed
 * @returns {Object} - Chart.js configuration
 */
export function createChartConfig(data, scenario, input) {
    return {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: `Impact of ${input.nice_name || input.variable_name}`,
                data: data.data,
                borderColor: '#10a37f',
                backgroundColor: 'rgba(16, 163, 127, 0.1)',
                tension: 0.2,
                fill: true,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `How ${input.nice_name || input.variable_name} affects the result`,
                    font: {
                        size: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            if (context?.raw === undefined) return '';
                            return `Result: ${humanReadable(context.raw)} ${scenario.result.units}`;
                        },
                        title: (tooltipItems) => {
                            if (!tooltipItems?.length || !tooltipItems[0]?.label) return '';
                            const dataIndex = tooltipItems[0].dataIndex;
                            if (dataIndex === undefined || !data.chartData[dataIndex]) return '';

                            const point = data.chartData[dataIndex];
                            return `${input.nice_name || input.variable_name}: ${humanReadable(point.rawX)} ${input.display_units}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: scenario.result.units
                    },
                    ticks: {
                        callback: (value) => {
                            return humanReadable(value);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: input.display_units
                    }
                }
            }
        }
    };
}

/**
 * Safely destroy a Chart.js instance
 * @param {Chart} chart - Chart.js instance
 */
export function destroyChart(chart) {
    if (chart) {
        chart.destroy();
    }
}