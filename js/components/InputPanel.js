/**
 * InputPanel Component
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
      <div :class="['left-panel', { hidden: !visible }]">
        <h5 style="margin-bottom: 20px;">All Inputs</h5>
        <div v-for="(input, key) in inputs" :key="key" class="input-row">
          <div>
            <strong>{{ input.nice_name || formatLabel(key) }}</strong>
            <small class="text-muted"> ({{ input.display_units }})</small>
          </div>
          <div class="input-group input-group-sm">
            <input type="number" class="form-control" :value="formatValue(input.value, input.scale)"
              @input="updateValue($event, key)" />
            <button class="btn btn-outline-secondary" type="button" @click="adjustValue(key, 10)">×10</button>
            <button class="btn btn-outline-secondary" type="button" @click="adjustValue(key, 0.1)">×0.1</button>
            <button class="btn btn-outline-secondary" type="button" @click="resetValue(key)">Reset</button>
          </div>
          <div class="mt-1">
            <button class="btn btn-outline-secondary btn-sm" @click="inspect(key)">Inspect</button>
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