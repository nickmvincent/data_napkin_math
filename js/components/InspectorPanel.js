/**
 * InspectorPanel Component
 * Renders the right sidebar for inspecting input details
 */
export default {
  name: 'InspectorPanel',
  
  props: {
    selectedKey: {
      type: String,
      default: null
    },
    selectedInput: {
      type: Object,
      default: null
    },
    inputs: {
      type: Object,
      required: true
    },
    logs: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  
  computed: {
    changeLog() {
      return (this.selectedKey && this.logs[this.selectedKey]) ? this.logs[this.selectedKey] : [];
    }
  },
  
  template: `
    <div v-if="!isMobile" ref="inspectorPanel" :class="['right-panel', { hidden: !visible }]" id="desktopInspector">
      <button class="btn btn-outline-secondary btn-sm" @click="close">Hide Inspector</button>
      <h5>Inspector</h5>
      <div v-if="selectedInput" class="inspector-content">
        <h6>{{ selectedInput.nice_name || formatLabel(selectedKey) }}</h6>
        <p><em>({{ selectedInput.display_units }})</em></p>
        <ul class="list-unstyled" style="font-size: 0.95rem;">
          <li><strong>Raw Value:</strong> {{ selectedInput.value }}</li>
          <li v-if="selectedInput.default_value"><strong>Default Value:</strong> {{ selectedInput.default_value }}</li>
          <li v-if="selectedInput.value_description"><strong>Description:</strong> {{ selectedInput.value_description }}</li>
          <li v-if="selectedInput.variable_type"><strong>Variable Type:</strong> {{ selectedInput.variable_type }}</li>
          <li v-if="selectedInput.key_assumption"><strong>Assumption:</strong> {{ selectedInput.key_assumption }}</li>
          <li v-if="selectedInput.source_notes"><strong>Source Notes:</strong> {{ selectedInput.source_notes }}</li>
          <li v-if="selectedInput.units"><strong>Units:</strong> {{ selectedInput.units }}</li>
          <li v-if="selectedInput.source_url">
            <strong>Source URL:</strong>
            <a :href="selectedInput.source_url" target="_blank">{{ selectedInput.source_url }}</a>
          </li>
        </ul>
        <div v-if="changeLog.length" class="change-log">
          <h6>Change Log:</h6>
          <ul>
            <li v-for="(entry, index) in changeLog" :key="index">
              {{ entry.time }}: {{ entry.value }}
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <p>Click on an input (from the left panel or a scenario card) to inspect its details here.</p>
      </div>
    </div>
    
    <!-- Mobile Inspector Modal -->
    <div v-else class="modal fade" id="inspectorModal" tabindex="-1" aria-labelledby="inspectorModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="inspectorModalLabel">Inspector</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedInput" class="inspector-content">
              <h6>{{ selectedInput.nice_name || formatLabel(selectedKey) }}</h6>
              <p><em>({{ selectedInput.display_units }})</em></p>
              <ul class="list-unstyled" style="font-size: 0.95rem;">
                <li><strong>Raw Value:</strong> {{ selectedInput.value }}</li>
                <li v-if="selectedInput.default_value"><strong>Default Value:</strong> {{ selectedInput.default_value }}</li>
                <li v-if="selectedInput.value_description"><strong>Description:</strong> {{ selectedInput.value_description }}</li>
                <li v-if="selectedInput.variable_type"><strong>Variable Type:</strong> {{ selectedInput.variable_type }}</li>
                <li v-if="selectedInput.key_assumption"><strong>Assumption:</strong> {{ selectedInput.key_assumption }}</li>
                <li v-if="selectedInput.source_notes"><strong>Source Notes:</strong> {{ selectedInput.source_notes }}</li>
                <li v-if="selectedInput.units"><strong>Units:</strong> {{ selectedInput.units }}</li>
                <li v-if="selectedInput.source_url">
                  <strong>Source URL:</strong>
                  <a :href="selectedInput.source_url" target="_blank">{{ selectedInput.source_url }}</a>
                </li>
              </ul>
              <div v-if="changeLog.length" class="change-log">
                <h6>Change Log:</h6>
                <ul>
                  <li v-for="(entry, index) in changeLog" :key="index">
                    {{ entry.time }}: {{ entry.value }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else>
              <p>Click on an input (from the left panel or a scenario card) to inspect its details here.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  
  methods: {
    formatLabel(key) {
      if (!key) return '';
      return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    },
    
    close() {
      this.$emit('close');
    },
    
    scrollToTop() {
      this.$nextTick(() => {
        if (this.$refs.inspectorPanel) {
          this.$refs.inspectorPanel.scrollTop = 0;
        }
      });
    }
  },
  
  watch: {
    selectedKey() {
      this.scrollToTop();
    }
  }
};