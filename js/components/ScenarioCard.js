/**
 * ScenarioCard Component
 * Renders a single scenario card with exploration capabilities
 */
export default {
    name: 'ScenarioCard',

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
        },
        fillSelections: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            isLoading: false
        };
    },

    template: `
      <div class="card">
        <header>
          <h4>{{ scenario.title }}</h4>
          <!-- Description with variable selectors -->
          <p>
            <template v-for="(segment, idx) in parsedDescription" :key="idx">
              <template v-if="segment.type === 'text'">
                {{ segment.text }}
              </template>
              <template v-else>
                <select class="form-select form-select-sm inline-select" v-model="fillSelections[segment.variable]"
                  @change="onVariableChange(segment.variable, $event.target.value)">
                  <option v-for="option in getFillOptions(segment.variable)" :key="option.variable"
                    :value="option.variable">
                    {{ option.text }}
                  </option>
                </select>
              </template>
            </template>
          </p>
          <!-- Result output -->
          <div class="result-output">
            {{ scenario.result.value }} {{ scenario.result.units }}
          </div>
        </header>
  
        <!-- Explore button -->
        <button class="btn btn-primary explore-button" @click="toggleExplore">
          {{ scenario.showExplore ? 'Hide Exploration Tools' : 'Explore what would happen if these numbers changed' }}
        </button>
  
        <!-- Exploration area -->
        <div v-if="scenario.showExplore" class="exploration-area">
          <!-- Visualization area -->
          <div class="visualization-area">
            <div class="row">
              <div class="col-md-6">
                <div class="exploration-visualization" :id="'plot-' + index">
                  <div v-if="!scenario.plotGenerated" class="chart-placeholder">
                    <em>Select a variable below to visualize its impact</em>
                  </div>
                  <div v-else-if="scenario.chartError" class="chart-placeholder chart-error">
                    <div>
                      <strong>Chart could not be generated</strong>
                      <p>Please try a different variable or range</p>
                    </div>
                  </div>
                  <div class="plot-container" :id="'plot-container-' + index"></div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="sensitivity-controls">
                  <h6>Sensitivity Analysis</h6>
                  <p>Select a variable to see how changes affect the result:</p>
                  <div class="form-group">
                    <select class="form-select" v-model="scenario.selectedSensitivityVar"
                      @change="generateSensitivityPlot">
                      <option value="">Choose a variable</option>
                      <option v-for="inputKey in scenario.inputs" :key="inputKey" :value="inputKey">
                        {{ inputs[inputKey]?.nice_name || formatLabel(inputKey) }}
                      </option>
                    </select>
                  </div>
                  <div class="range-controls" v-if="scenario.selectedSensitivityVar">
                    <label>Range multiplier:
                      <span class="range-value">{{ scenario.sensitivityRange || 5 }}x</span>
                    </label>
                    <input type="range" class="form-range" min="2" max="100" v-model.number="scenario.sensitivityRange"
                      @change="generateSensitivityPlot">
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Input controls area -->
          <div class="input-controls mt-4">
            <h5>Adjust Input Values</h5>
            <div v-for="inputKey in scenario.inputs" :key="inputKey" class="mb-3 input-control-row">
              <label class="form-label">
                {{ inputs[inputKey]?.nice_name || formatLabel(inputKey) }}
                <small class="text-muted"> ({{ inputs[inputKey].display_units }})</small>
              </label>
              <div class="input-group">
                <input type="number" class="form-control"
                  :value="formatValue(inputs[inputKey].value, inputs[inputKey].scale)"
                  @input="updateValue($event, inputKey)" />
                <button class="btn btn-outline-secondary" type="button" @click="adjustValue(inputKey, 10)">×10</button>
                <button class="btn btn-outline-secondary" type="button" @click="adjustValue(inputKey, 0.1)">×0.1</button>
                <button class="btn btn-outline-secondary" type="button" @click="resetValue(inputKey)">Reset</button>
                <button class="btn btn-secondary" type="button" @click="inspectInput(inputKey)">
                  <i class="bi bi-info-circle"></i>
                </button>
              </div>
            </div>
          </div>
  
          <!-- Calculation details toggle -->
          <div class="mt-3">
            <button class="btn btn-outline-info btn-sm" @click="scenario.showCalcDetails = !scenario.showCalcDetails">
              {{ scenario.showCalcDetails ? "Hide" : "Show" }} Calculation Details
            </button>
            <div v-if="scenario.showCalcDetails" class="calc-details mt-2">
              <strong>Calculation Function:</strong>
              <pre>{{ scenario.calculate?.toString() }}</pre>
              <strong>Raw Value:</strong> {{ scenario.result.rawValue }}<br />
              <div v-if="scenario.unitDetails">
                <strong>Unit Details:</strong> {{ scenario.unitDetails }}
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    computed: {
        parsedDescription() {
            return this.parseDescription(this.scenario.description);
        }
    },

    methods: {
        toggleExplore() {
            this.$emit('toggle-explore', this.index);
        },

        updateValue(event, key) {
            this.$emit('update-value', { event, key });
        },

        adjustValue(key, factor) {
            this.$emit('adjust-value', { key, factor });
        },

        resetValue(key) {
            this.$emit('reset-value', key);
        },

        inspectInput(key) {
            this.$emit('inspect-input', key);
        },

        onVariableChange(variable, value) {
            this.$emit('variable-change', { variable, value });
        },

        generateSensitivityPlot() {
            this.$emit('generate-plot', this.index);
        },

        parseDescription(desc) {
            if (!desc) return [];

            const segments = [];
            let lastIndex = 0;
            // Match variable patterns like {variable_name}
            const regex = /\{([a-z0-9_]+)\}/g;
            let match;

            while ((match = regex.exec(desc)) !== null) {
                if (match.index > lastIndex) {
                    segments.push({ type: 'text', text: desc.slice(lastIndex, match.index) });
                }

                const varName = match[1];
                if (this.inputs[varName]) {
                    // This is a valid variable we can replace
                    segments.push({ type: 'variable', variable: varName });
                } else {
                    // If it's not a known variable, just keep the original text
                    segments.push({ type: 'text', text: match[0] });
                }

                lastIndex = regex.lastIndex;
            }

            if (lastIndex < desc.length) {
                segments.push({ type: 'text', text: desc.slice(lastIndex) });
            }

            return segments;
        },

        getFillOptions(variable) {
            if (!this.inputs[variable]) return [];

            // Group inputs by variable_type
            const inputsByType = {};
            Object.values(this.inputs).forEach(input => {
                if (!inputsByType[input.variable_type]) {
                    inputsByType[input.variable_type] = [];
                }
                inputsByType[input.variable_type].push(input);
            });

            const vt = this.inputs[variable].variable_type;
            if (!inputsByType[vt]) return [];

            return inputsByType[vt].map(input => ({
                variable: input.variable_name,
                text: `${input.title || this.formatLabel(input.variable_name)} (${this.formatValue(input.value, input.scale)} ${input.display_units})`
            }));
        },

        formatLabel(key) {
            return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
        },

        formatValue(value, scale) {
            return scale ? value / scale : value;
        }
    }
};