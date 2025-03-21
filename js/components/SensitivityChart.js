/**
 * SensitivityChart Component
 * Handles the creation and management of sensitivity analysis charts
 */
export default {
    name: 'SensitivityChart',

    props: {
        scenario: {
            type: Object,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        inputs: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            chart: null,
            chartError: false,
            isLoading: false
        };
    },

    template: `
      <div class="sensitivity-chart">
        <div class="exploration-visualization" :id="'plot-' + index">
          <div v-if="isLoading" class="chart-placeholder">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div v-else-if="!scenario.plotGenerated" class="chart-placeholder">
            <em>Select a variable below to visualize its impact</em>
          </div>
          <div v-else-if="chartError" class="chart-placeholder chart-error">
            <div>
              <strong>Chart could not be generated</strong>
              <p>Please try a different variable or range</p>
            </div>
          </div>
          <div class="plot-container" :id="'plot-container-' + index"></div>
        </div>
        
        <div class="sensitivity-controls mt-3">
          <h6>Sensitivity Analysis</h6>
          <p>Select a variable to see how changes affect the result:</p>
          <div class="form-group">
            <select class="form-select" v-model="selectedVar" @change="handleVariableChange">
              <option value="">Choose a variable</option>
              <option v-for="inputKey in scenario.inputs" :key="inputKey" :value="inputKey">
                {{ inputs[inputKey]?.nice_name || formatLabel(inputKey) }}
              </option>
            </select>
          </div>
          <div class="range-controls" v-if="selectedVar">
            <label>Range multiplier:
              <span class="range-value">{{ sensitivityRange }}x</span>
            </label>
            <input type="range" class="form-range" min="2" max="100" v-model.number="sensitivityRange"
              @change="generateChart">
          </div>
        </div>
      </div>
    `,

    computed: {
        selectedVar: {
            get() {
                return this.scenario.selectedSensitivityVar || '';
            },
            set(value) {
                this.$emit('update:scenario', {
                    ...this.scenario,
                    selectedSensitivityVar: value
                });
            }
        },

        sensitivityRange: {
            get() {
                return this.scenario.sensitivityRange || 5;
            },
            set(value) {
                this.$emit('update:scenario', {
                    ...this.scenario,
                    sensitivityRange: value
                });
            }
        }
    },

    watch: {
        'scenario.showExplore'(newVal, oldVal) {
            if (!newVal && oldVal && this.chart) {
                this.destroyChart();
            }
        }
    },

    methods: {
        handleVariableChange() {
            if (this.selectedVar) {
                this.generateChart();
            }
        },

        generateChart() {
            this.isLoading = true;
            this.chartError = false;

            // Small delay to show loading state
            setTimeout(() => {
                try {
                    this.createSensitivityChart();
                    this.$emit('update:scenario', {
                        ...this.scenario,
                        plotGenerated: true
                    });
                } catch (error) {
                    console.error('Chart generation error:', error);
                    this.chartError = true;
                } finally {
                    this.isLoading = false;
                }
            }, 100);
        },

        createSensitivityChart() {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js not loaded yet');
                throw new Error('Chart.js not loaded');
            }

            const selectedVar = this.selectedVar;
            if (!selectedVar) return;

            // Get the current value and make a range around it
            const currentValue = this.inputs[selectedVar]?.value;
            if (currentValue === undefined) {
                console.error(`No value found for ${selectedVar}`);
                throw new Error(`No value found for ${selectedVar}`);
            }

            const scale = this.inputs[selectedVar].scale || 1;
            const range = this.sensitivityRange;

            // Generate data points
            const points = 50;
            const minFactor = 1 / range;
            const maxFactor = range;
            const step = (maxFactor - minFactor) / points;

            const chartData = [];

            // Store original value to restore later
            const originalValue = currentValue;

            // Calculate result for each point in the range
            for (let i = 0; i <= points; i++) {
                const factor = minFactor + (step * i);
                const newValue = originalValue * factor;

                // Update the input value temporarily
                this.inputs[selectedVar].value = newValue;

                // Recalculate with the new value
                try {
                    const inputValues = this.scenario.inputs.map(key => this.inputs[key]?.value);
                    if (!inputValues.includes(undefined)) {
                        const result = this.scenario.calculate(...inputValues);

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
                    }
                } catch (e) {
                    console.error('Error calculating sensitivity point:', e);
                    // Skip this point but continue with others
                }
            }

            // Restore original value
            this.inputs[selectedVar].value = originalValue;
            this.$emit('recalculate');

            // Sort data by x value (numerically)
            chartData.sort((a, b) => a.rawX - b.rawX);

            // Extract labels and data for chart
            const labels = chartData.map(point => point.x);
            const data = chartData.map(point => point.y);

            // Validate data
            if (!this.validateChartData(data) || labels.length === 0) {
                throw new Error('Invalid chart data');
            }

            // Create or update chart
            const containerId = `plot-container-${this.index}`;
            const container = document.getElementById(containerId);

            if (!container) {
                throw new Error(`Container ${containerId} not found`);
            }

            // Destroy existing chart if there is one
            this.destroyChart();

            // Create canvas if it doesn't exist
            let canvas = container.querySelector('canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                container.appendChild(canvas);
            }

            // Create the chart
            const ctx = canvas.getContext('2d');

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: `Impact of ${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)}`,
                        data: data,
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
                            text: `How ${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)} affects the result`,
                            font: {
                                size: 14
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    if (context?.raw === undefined) return '';
                                    return `Result: ${this.humanReadable(context.raw)} ${this.scenario.result.units}`;
                                },
                                title: (tooltipItems) => {
                                    if (!tooltipItems?.length || !tooltipItems[0]?.label) return '';
                                    const dataIndex = tooltipItems[0].dataIndex;
                                    if (dataIndex === undefined || !chartData[dataIndex]) return '';
                                    const point = chartData[dataIndex];
                                    return `${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)}: ${this.humanReadable(point.rawX)} ${this.inputs[selectedVar].display_units}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: this.scenario.result.units
                            },
                            ticks: {
                                callback: (value) => {
                                    return this.humanReadable(value);
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: this.inputs[selectedVar].display_units
                            }
                        }
                    }
                }
            });
        },

        destroyChart() {
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
        },

        validateChartData(data) {
            if (!Array.isArray(data) || data.length === 0) {
                return false;
            }

            // Check that all data points are valid numbers
            return data.every(point =>
                point !== undefined &&
                point !== null &&
                !isNaN(parseFloat(point))
            );
        },

        formatLabel(key) {
            return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
        },

        humanReadable(value) {
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
    },

    beforeUnmount() {
        this.destroyChart();
    }
};