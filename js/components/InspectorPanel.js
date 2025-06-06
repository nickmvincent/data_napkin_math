/**
 * InspectorPanel Component - Improved for symmetry
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
    <div v-if="!isMobile" class="panel-content">
      <div class="panel-header">
        <h5>Inspector</h5>
        <button class="btn btn-link btn-sm p-0" @click="close" v-if="selectedInput">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div v-if="selectedInput" class="inspector-content">
        <div class="inspector-details">
          <h6>{{ selectedInput.nice_name || formatLabel(selectedKey) }}</h6>
          
          <div class="detail-item">
            <span class="detail-label">Current Value</span>
            <span class="detail-value">{{ formatValue(selectedInput.value, selectedInput.scale) }} {{ selectedInput.display_units }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.default_value">
            <span class="detail-label">Default Value</span>
            <span class="detail-value">{{ formatValue(selectedInput.default_value, selectedInput.scale) }} {{ selectedInput.display_units }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.value_description">
            <span class="detail-label">Description</span>
            <span class="detail-value">{{ selectedInput.value_description }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.variable_type">
            <span class="detail-label">Variable Type</span>
            <span class="detail-value">{{ formatLabel(selectedInput.variable_type) }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.key_assumption">
            <span class="detail-label">Key Assumption</span>
            <span class="detail-value">{{ selectedInput.key_assumption }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.source_notes">
            <span class="detail-label">Source Notes</span>
            <span class="detail-value">{{ selectedInput.source_notes }}</span>
          </div>
          
          <div class="detail-item" v-if="selectedInput.source_url">
            <span class="detail-label">Source</span>
            <span class="detail-value">
              <a :href="selectedInput.source_url" target="_blank" rel="noopener">
                {{ formatUrl(selectedInput.source_url) }}
                <i class="bi bi-box-arrow-up-right ms-1"></i>
              </a>
            </span>
          </div>
        </div>
        
        <div v-if="changeLog.length" class="change-log">
          <h6>Change History</h6>
          <div class="change-log-list">
            <div v-for="(entry, index) in changeLog" :key="index" class="change-log-item">
              <span class="change-log-time">{{ entry.time }}:</span> {{ formatValue(entry.value, selectedInput.scale) }}
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="inspector-empty">
        <i class="bi bi-info-circle" style="font-size: 2rem; color: var(--primary-color);"></i>
        <p class="mt-3">Select an input variable to view its details</p>
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
            <!-- Same content as desktop version -->
            <div v-if="selectedInput" class="inspector-content">
              <div class="inspector-details">
                <h6>{{ selectedInput.nice_name || formatLabel(selectedKey) }}</h6>
                
                <div class="detail-item">
                  <span class="detail-label">Current Value</span>
                  <span class="detail-value">{{ formatValue(selectedInput.value, selectedInput.scale) }} {{ selectedInput.display_units }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.default_value">
                  <span class="detail-label">Default Value</span>
                  <span class="detail-value">{{ formatValue(selectedInput.default_value, selectedInput.scale) }} {{ selectedInput.display_units }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.value_description">
                  <span class="detail-label">Description</span>
                  <span class="detail-value">{{ selectedInput.value_description }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.variable_type">
                  <span class="detail-label">Variable Type</span>
                  <span class="detail-value">{{ formatLabel(selectedInput.variable_type) }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.key_assumption">
                  <span class="detail-label">Key Assumption</span>
                  <span class="detail-value">{{ selectedInput.key_assumption }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.source_notes">
                  <span class="detail-label">Source Notes</span>
                  <span class="detail-value">{{ selectedInput.source_notes }}</span>
                </div>
                
                <div class="detail-item" v-if="selectedInput.source_url">
                  <span class="detail-label">Source</span>
                  <span class="detail-value">
                    <a :href="selectedInput.source_url" target="_blank" rel="noopener">
                      {{ formatUrl(selectedInput.source_url) }}
                      <i class="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                  </span>
                </div>
              </div>
              
              <div v-if="changeLog.length" class="change-log">
                <h6>Change History</h6>
                <div class="change-log-list">
                  <div v-for="(entry, index) in changeLog" :key="index" class="change-log-item">
                    <span class="change-log-time">{{ entry.time }}:</span> {{ formatValue(entry.value, selectedInput.scale) }}
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="inspector-empty">
              <i class="bi bi-info-circle" style="font-size: 2rem; color: var(--primary-color);"></i>
              <p class="mt-3">Select an input variable to view its details</p>
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
      return key.replace(/_/g, ' ').replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    },
    
    formatValue(value, scale) {
      if (value === undefined || value === null) return 'N/A';
      const scaledValue = scale ? value / scale : value;
      
      // Format with appropriate precision
      if (Math.abs(scaledValue) >= 1000) {
        return scaledValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
      } else if (Math.abs(scaledValue) >= 1) {
        return scaledValue.toFixed(2);
      } else {
        return scaledValue.toPrecision(3);
      }
    },
    
    formatUrl(url) {
      if (!url) return '';
      // Remove protocol and www
      let formatted = url.replace(/^https?:\/\/(www\.)?/, '');
      // Truncate if too long
      if (formatted.length > 40) {
        return formatted.substring(0, 37) + '...';
      }
      return formatted;
    },
    
    close() {
      this.$emit('close');
    },
    
    scrollToTop() {
      this.$nextTick(() => {
        const content = this.$el.querySelector('.inspector-content');
        if (content) {
          content.scrollTop = 0;
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