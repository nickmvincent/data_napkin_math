/**
 * ScenarioCard Component
 * Renders a single scenario card with exploration capabilities
 */

import SensitivityChart from './SensitivityChart.js';


export default {
  name: 'ScenarioCard',

  components: {
    SensitivityChart
  },

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
          <div class="col-lg-12">
            <!-- Use SensitivityChart component instead of inline implementation -->
            <sensitivity-chart
              :scenario="scenario"
              :index="index"
              :inputs="inputs"
              @recalculate="$emit('recalculate')"
              @update:scenario="updateScenario"
            ></sensitivity-chart>
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
  <h6>Calculation Details</h6>
  
  <!-- Human-readable operation description -->
  <div class="operation-description mb-2">
    <strong>Operation:</strong> 
    <span v-if="scenario.calculation_type === 'operations'">
      {{ formatOperation(scenario.operations) }}
    </span>
    <span v-else>
      {{ scenario.calculation_type }}
    </span>
  </div>
  
  <!-- Input values used in calculation -->
    <div class="calculation-inputs mb-2">
      <strong>Input Values:</strong>
      <ul class="list-unstyled ms-3">
        <li v-for="inputKey in scenario.inputs" :key="inputKey">
          {{ inputs[inputKey]?.nice_name || formatLabel(inputKey) }}: 
          <span class="text-primary">{{ formatValue(inputs[inputKey]?.value, inputs[inputKey]?.scale) }} {{ inputs[inputKey]?.display_units }}</span>
        </li>
      </ul>
    </div>
    
    <!-- Raw result value -->
    <div class="mb-2">
      <strong>Result:</strong> 
      <span class="text-primary">{{ humanReadable(scenario.result.rawValue) }} {{ scenario.result.units }}</span>
    </div>
    
    <div v-if="scenario.unitDetails" class="mt-2">
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

    // Updated to safely emit events with proper payload structure
    updateValue(event, key) {
      if (!event || !key) {
        console.error("Missing event or key in updateValue:", { event, key });
        return;
      }

      // Create a safe payload with the data needed by the parent
      const payload = {
        key: key,
        value: event.target.value // Pass the raw input value
      };

      this.$emit('update-value', payload);
    },

    // Updated to safely emit events
    adjustValue(key, factor) {
      if (!key || factor === undefined) {
        console.error("Missing key or factor in adjustValue:", { key, factor });
        return;
      }

      this.$emit('adjust-value', { key, factor });
    },

    // Updated to safely emit events
    resetValue(key) {
      if (!key) {
        console.error("Missing key in resetValue");
        return;
      }

      this.$emit('reset-value', key);
    },

    inspectInput(key) {
      if (!key) {
        console.error("Missing key in inspectInput");
        return;
      }

      this.$emit('inspect-input', key);
    },

    onVariableChange(variable, value) {
      if (!variable || value === undefined) {
        console.error("Missing variable or value in onVariableChange");
        return;
      }

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
      if (!key) return '';
      return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    },

    formatValue(value, scale) {
      if (value === undefined || value === null) return '';
      return scale ? value / scale : value;
    },

    updateScenario(updatedScenario) {
      // Update properties that might be changed by the sensitivity chart
      this.scenario.selectedSensitivityVar = updatedScenario.selectedSensitivityVar;
      this.scenario.plotGenerated = updatedScenario.plotGenerated;
      this.scenario.chartError = updatedScenario.chartError;

      // Emit an event to parent if needed
      this.$emit('update-scenario', this.index, this.scenario);
    },
    /**
 * Add this method to the methods section of ScenarioCard.js
 */
    formatOperation(operationsJson) {
      try {
        // Parse the operations JSON
        const operations = JSON.parse(operationsJson);

        if (!operations || !operations.length) {
          return 'No operations defined';
        }

        // Format each operation in a human-readable way
        const descriptions = operations.map(op => {
          // Format the arguments
          const formattedArgs = op.args.map(arg => {
            if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
              const varName = arg.slice(1, -1);
              // Try to get the nice name for the variable
              return this.inputs[varName]?.nice_name || this.formatLabel(varName);
            }
            return arg;
          });

          // Create operation description based on function type
          switch (op.func) {
            case 'multiply':
              return `Multiply ${formattedArgs.join(' × ')}`;
            case 'divide':
              return `Divide ${formattedArgs[0]} by ${formattedArgs[1]}`;
            case 'add':
              return `Add ${formattedArgs.join(' + ')}`;
            case 'subtract':
              return `Subtract ${formattedArgs[1]} from ${formattedArgs[0]}`;
            case 'power':
              return `Raise ${formattedArgs[0]} to the power of ${formattedArgs[1]}`;
            default:
              return `${op.func}(${formattedArgs.join(', ')})`;
          }
        });

        // Join all operations with steps
        return descriptions.map((desc, index) => `Step ${index + 1}: ${desc}`).join('\n');
      } catch (error) {
        console.error('Error formatting operation:', error);
        return 'Error parsing operations';
      }
    },

    /**
     * Add this helper method if you don't already have it
     */
    humanReadable(value) {
      if (value === undefined || value === null) return 'N/A';
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
  }
};