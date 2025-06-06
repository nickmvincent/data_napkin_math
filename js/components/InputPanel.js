/**
 * InputPanel Component - Improved for symmetry
 * Renders the left sidebar containing all input variables
 */
export default {
    name: 'InputPanel',

    props: {
        inputs: {
            type: Object,
            required: true
        },
        visible: {
            type: Boolean,
            default: false
        }
    },

    template: `
      <div class="panel-content">
        <div class="panel-header">
          <h5>All Inputs</h5>
          <span class="text-muted">{{ Object.keys(inputs).length }} variables</span>
        </div>
        <div class="input-list">
          <div v-for="(input, key) in inputs" :key="key" class="input-row">
            <div class="input-header">
              <span class="input-name">{{ input.nice_name || formatLabel(key) }}</span>
              <small class="input-units">({{ input.display_units }})</small>
            </div>
            <div class="input-controls">
              <input 
                type="number" 
                class="form-control form-control-sm" 
                :value="formatValue(input.value, input.scale)"
                @input="updateValue($event, key)" 
              />
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="adjustValue(key, 10)">
                ×10
              </button>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="adjustValue(key, 0.1)">
                ×0.1
              </button>
              <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetValue(key)">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
            <div class="input-actions">
              <button class="btn btn-link btn-sm p-0" @click="inspect(key)">
                <i class="bi bi-info-circle"></i> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    `,

    methods: {
        formatLabel(key) {
            return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
        },

        formatValue(value, scale) {
            return scale ? value / scale : value;
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

        inspect(key) {
            this.$emit('inspect', key);
        }
    }
};