/**
 * Enhanced SensitivityChart Component
 * Features min/max range sliders and shows current value on chart
 * Fixed for recursion issues
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
      chartData: null,
      chartError: false,
      isLoading: false,
      minFactor: 0.2,  // Default: 20% of current value
      maxFactor: 5,    // Default: 500% of current value
      currentVariableValue: null,
      isUpdatingChart: false, // Flag to prevent recursion
      previousInputHash: '' // Track previous input values
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
        
        <div v-if="selectedVar" class="range-controls mt-3">
          <!-- Min range slider -->
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between">
              <span>Minimum value: <span class="range-value">{{ getFormattedRangeValue(minFactor) }}</span></span>
              <span class="text-muted">{{ minFactor.toFixed(2) }}x</span>
            </label>
            <input type="range" class="form-range" min="0.01" max="0.99" step="0.01" v-model.number="minFactor"
              @change="generateChart">
          </div>
          
          <!-- Max range slider -->
          <div class="mb-3">
            <label class="form-label d-flex justify-content-between">
              <span>Maximum value: <span class="range-value">{{ getFormattedRangeValue(maxFactor) }}</span></span>
              <span class="text-muted">{{ maxFactor.toFixed(2) }}x</span>
            </label>
            <input type="range" class="form-range" min="1.01" max="10" step="0.01" v-model.number="maxFactor"
              @change="generateChart">
          </div>
          
          <!-- Current value indicator -->
          <div class="current-value-indicator p-2 border rounded bg-light">
            <div class="d-flex justify-content-between">
              <span>Current value:</span>
              <strong>{{ getFormattedCurrentValue() }}</strong>
            </div>
            <div v-if="currentVariableValue !== null" class="text-center mt-1">
              <small class="text-muted">{{ getFactorOfCurrent().toFixed(2) }}x of baseline</small>
            </div>
          </div>
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
    
    // Create a hash of relevant input values to detect changes
    inputValuesHash() {
      if (!this.selectedVar || !this.inputs) return '';
      
      // Only track the inputs used in this scenario
      const relevantInputs = {};
      for (const key of this.scenario.inputs || []) {
        if (this.inputs[key]) {
          relevantInputs[key] = this.inputs[key].value;
        }
      }
      
      return JSON.stringify(relevantInputs);
    }
  },
  
  watch: {
    'scenario.showExplore'(newVal, oldVal) {
      if (!newVal && oldVal && this.chart) {
        this.destroyChart();
      }
    },
    
    // Use computed hash to detect changes without recursion
    inputValuesHash(newHash, oldHash) {
      // Skip if we're already updating or no chart is present
      if (this.isUpdatingChart || !this.chart || !this.selectedVar) {
        return;
      }
      
      try {
        // Set the flag to prevent recursion
        this.isUpdatingChart = true;
        
        // Update current variable value
        this.updateCurrentVariableValue();
        
        // If current value is outside min/max range, adjust and regenerate
        if (this.shouldUpdateRange()) {
          this.adjustRangeToFitCurrentValue();
          this.generateChart();
        } else {
          // Otherwise just update the marker line
          this.updateCurrentValueMarker();
        }
      } finally {
        // Always reset the flag when done
        this.isUpdatingChart = false;
      }
    }
  },
  
  methods: {
    handleVariableChange() {
      if (this.selectedVar) {
        // Reset ranges to defaults when selecting a new variable
        this.minFactor = 0.2;
        this.maxFactor = 5;
        
        // Store the current value of the selected variable
        this.updateCurrentVariableValue();
        
        // Generate the chart
        this.generateChart();
      } else {
        this.currentVariableValue = null;
      }
    },
    
    updateCurrentVariableValue() {
      if (this.selectedVar && this.inputs[this.selectedVar]) {
        this.currentVariableValue = this.inputs[this.selectedVar].value;
      } else {
        this.currentVariableValue = null;
      }
    },
    
    shouldUpdateRange() {
      if (this.currentVariableValue === null || !this.selectedVar) return false;
      
      const baselineValue = this.inputs[this.selectedVar].default_value;
      if (!baselineValue) return false;
      
      const currentFactor = this.currentVariableValue / baselineValue;
      
      // If current factor is outside our min/max range (with a small buffer)
      return currentFactor < (this.minFactor * 1.1) || currentFactor > (this.maxFactor * 0.9);
    },
    
    adjustRangeToFitCurrentValue() {
      if (this.currentVariableValue === null || !this.selectedVar) return;
      
      const baselineValue = this.inputs[this.selectedVar].default_value;
      if (!baselineValue) return;
      
      const currentFactor = this.currentVariableValue / baselineValue;
      
      // Adjust ranges with some padding
      if (currentFactor < this.minFactor) {
        this.minFactor = Math.max(0.01, currentFactor * 0.8);
      }
      
      if (currentFactor > this.maxFactor) {
        this.maxFactor = currentFactor * 1.2;
      }
    },
    
    getFactorOfCurrent() {
      if (this.currentVariableValue === null || !this.selectedVar) return 1;
      
      const baselineValue = this.inputs[this.selectedVar].default_value;
      if (!baselineValue) return 1;
      
      return this.currentVariableValue / baselineValue;
    },
    
    getFormattedRangeValue(factor) {
      if (!this.selectedVar || !this.inputs[this.selectedVar]) return '';
      
      const baseValue = this.inputs[this.selectedVar].default_value;
      const scale = this.inputs[this.selectedVar].scale || 1;
      const rangeValue = baseValue * factor;
      
      return this.formatValue(rangeValue, scale) + ' ' + this.inputs[this.selectedVar].display_units;
    },
    
    getFormattedCurrentValue() {
      if (this.currentVariableValue === null || !this.selectedVar || !this.inputs[this.selectedVar]) return 'N/A';
      
      const scale = this.inputs[this.selectedVar].scale || 1;
      return this.formatValue(this.currentVariableValue, scale) + ' ' + this.inputs[this.selectedVar].display_units;
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

      // Get the baseline value (default value)
      const baselineValue = this.inputs[selectedVar].default_value;
      if (baselineValue === undefined) {
        console.error(`No default value found for ${selectedVar}`);
        throw new Error(`No default value found for ${selectedVar}`);
      }

      const scale = this.inputs[selectedVar].scale || 1;

      // Generate data points
      const points = 75; // More points for smoother curve
      const step = (this.maxFactor - this.minFactor) / points;

      const chartData = [];
      
      // Store original value to restore later
      const originalValue = this.inputs[selectedVar].value;

      // Calculate result for each point in the range
      for (let i = 0; i <= points; i++) {
        const factor = this.minFactor + (step * i);
        const newValue = baselineValue * factor;

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
              rawX: newValue,
              factor: factor
            });
          }
        } catch (e) {
          console.error('Error calculating sensitivity point:', e);
          // Skip this point but continue with others
        }
      }

      // Restore original value
      this.inputs[selectedVar].value = originalValue;
      
      // Emit recalculate but use setTimeout to break the potential reactivity chain
      setTimeout(() => {
        this.$emit('recalculate');
      }, 0);

      // Sort data by x value (numerically)
      chartData.sort((a, b) => a.rawX - b.rawX);
      
      // Store for annotations
      this.chartData = chartData;
      
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
      
      // Find the point closest to the current value
      const currentFactor = this.getFactorOfCurrent();
      const currentValueIndex = this.findClosestPointIndex(chartData, currentFactor);

      // Create the chart
      const ctx = canvas.getContext('2d');
      
      // Create a gradient for the fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(16, 163, 127, 0.2)');
      gradient.addColorStop(1, 'rgba(16, 163, 127, 0)');
      
      try {
        // Only create chart if Chart.js annotation plugin is available
        const hasAnnotations = typeof Chart !== 'undefined' && 
                              Chart.registry && 
                              Chart.registry.plugins && 
                              Chart.registry.plugins.items && 
                              Chart.registry.plugins.items.annotation;

        // Create chart options
        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500
          },
          plugins: {
            title: {
              display: true,
              text: `How ${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)} affects ${this.scenario.result_label}`,
              font: {
                size: 14
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  if (context?.raw === undefined) return '';
                  return `${this.scenario.result_label}: ${this.humanReadable(context.raw)} ${this.scenario.result.units}`;
                },
                title: (tooltipItems) => {
                  if (!tooltipItems?.length || !tooltipItems[0]?.label) return '';
                  const dataIndex = tooltipItems[0].dataIndex;
                  if (dataIndex === undefined || !chartData[dataIndex]) return '';
                  const point = chartData[dataIndex];
                  return `${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)}: ${this.humanReadable(point.rawX)} ${this.inputs[selectedVar].display_units}`;
                },
                afterLabel: (context) => {
                  const dataIndex = context.dataIndex;
                  if (dataIndex === undefined || !chartData[dataIndex]) return '';
                  return `Factor: ${chartData[dataIndex].factor.toFixed(2)}x`;
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
        };
        
        // Only add annotations if the plugin is available
        if (hasAnnotations) {
          chartOptions.plugins.annotation = {
            annotations: {
              currentValue: {
                type: 'line',
                xMin: currentValueIndex,
                xMax: currentValueIndex,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                borderWidth: 2,
                borderDash: [5, 5],
                label: {
                  content: 'Current',
                  enabled: true,
                  position: 'top'
                }
              },
              baseline: {
                type: 'line',
                xMin: this.findClosestPointIndex(chartData, 1),
                xMax: this.findClosestPointIndex(chartData, 1),
                borderColor: 'rgba(53, 162, 235, 0.8)', 
                borderWidth: 2,
                label: {
                  content: 'Baseline',
                  enabled: true,
                  position: 'bottom'
                }
              }
            }
          };
        }
        
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: `Impact of ${this.inputs[selectedVar]?.nice_name || this.formatLabel(selectedVar)}`,
              data: data,
              borderColor: '#10a37f',
              backgroundColor: gradient,
              tension: 0.2,
              fill: true,
              pointRadius: 2,
              pointHoverRadius: 5
            }]
          },
          options: chartOptions
        });
      } catch (e) {
        console.error('Error creating chart:', e);
        throw e;
      }
    },
    
    // Find the index of the point closest to the given factor
    findClosestPointIndex(chartData, targetFactor) {
      if (!chartData || !chartData.length) return 0;
      
      let closestIndex = 0;
      let minDiff = Number.MAX_VALUE;
      
      chartData.forEach((point, index) => {
        const diff = Math.abs(point.factor - targetFactor);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });
      
      return closestIndex;
    },
    
    // Update the current value marker line on the chart
    updateCurrentValueMarker() {
      // Prevent recursion by checking flag
      if (this.isUpdatingChart || !this.chart || !this.chartData) return;
      
      try {
        this.isUpdatingChart = true;
        
        const currentFactor = this.getFactorOfCurrent();
        const currentValueIndex = this.findClosestPointIndex(this.chartData, currentFactor);
        
        // Update the annotation position if annotation plugin is available
        if (this.chart.options.plugins.annotation && 
            this.chart.options.plugins.annotation.annotations &&
            this.chart.options.plugins.annotation.annotations.currentValue) {
          this.chart.options.plugins.annotation.annotations.currentValue.xMin = currentValueIndex;
          this.chart.options.plugins.annotation.annotations.currentValue.xMax = currentValueIndex;
          
          // Use setTimeout to break potential reactivity chains
          setTimeout(() => {
            // Only update if chart still exists
            if (this.chart) {
              this.chart.update('none'); // Use 'none' mode for faster updates
            }
          }, 0);
        }
      } finally {
        this.isUpdatingChart = false;
      }
    },
    
    destroyChart() {
      if (this.chart) {
        try {
          this.chart.destroy();
        } catch (e) {
          console.error('Error destroying chart:', e);
        }
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
    
    formatValue(value, scale) {
      if (value === undefined || value === null) return 'N/A';
      const scaledValue = scale ? value / scale : value;
      
      // Format with appropriate precision
      if (Math.abs(scaledValue) >= 1000) {
        return Math.round(scaledValue).toLocaleString();
      } else if (Math.abs(scaledValue) >= 100) {
        return scaledValue.toFixed(1);
      } else if (Math.abs(scaledValue) >= 10) {
        return scaledValue.toFixed(2);
      } else {
        return scaledValue.toFixed(3);
      }
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