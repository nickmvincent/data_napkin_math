<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Input, Scenario } from '../lib/calculations';
import { formatLabel, formatValue, humanReadable, createCalculationFunction, formatOperation, updateCalculations } from '../lib/calculations';

// Props from Astro
const props = defineProps<{
  initialInputs: Record<string, Input>;
  initialScenarios: Scenario[];
}>();

// UI State
const leftPanelOpen = ref(false);
const rightPanelOpen = ref(false);
const selectedInputKey = ref<string | null>(null);
const selectedScenario = ref("All");

// Data - reactive copies
const inputs = ref<Record<string, Input>>({});
const scenariosData = ref<Scenario[]>([]);
const logs = ref<Record<string, { time: string; value: number }[]>>({});
const fillSelections = ref<Record<string, string>>({});

// Computed
const selectedInputDetails = computed(() => {
  return selectedInputKey.value ? inputs.value[selectedInputKey.value] : null;
});

const filteredScenarios = computed(() => {
  return selectedScenario.value === "All"
    ? scenariosData.value
    : scenariosData.value.filter(s => s.category === selectedScenario.value);
});

const inputsByType = computed(() => {
  return Object.values(inputs.value).reduce((groups: Record<string, Input[]>, input) => {
    if (!groups[input.variable_type]) {
      groups[input.variable_type] = [];
    }
    groups[input.variable_type].push(input);
    return groups;
  }, {});
});

const uniqueCategories = computed(() => {
  const cats = scenariosData.value
    .filter(scenario => scenario.category)
    .map(scenario => scenario.category);
  return ["All", ...new Set(cats)];
});

// Methods
function toggleLeftPanel() {
  leftPanelOpen.value = !leftPanelOpen.value;
}

function toggleRightPanel() {
  rightPanelOpen.value = !rightPanelOpen.value;
}

function toggleCategory(category: string) {
  selectedScenario.value = category;
}

function updateValue(key: string, value: string) {
  if (!key || !inputs.value[key]) return;
  const scale = inputs.value[key].scale || 1;
  const newVal = parseFloat(value) * scale;
  if (isNaN(newVal)) return;
  if (inputs.value[key].value !== newVal) {
    inputs.value[key].value = newVal;
    logChange(key, newVal);
    recalculate();
  }
}

function adjustValue(key: string, factor: number) {
  if (!key || !inputs.value[key]) return;
  const currentVal = parseFloat(String(inputs.value[key].value)) || 0;
  const newVal = currentVal * factor;
  inputs.value[key].value = newVal;
  logChange(key, newVal);
  recalculate();
}

function resetValue(key: string) {
  if (!key || !inputs.value[key]) return;
  const defaultVal = inputs.value[key].default_value;
  inputs.value[key].value = defaultVal;
  logChange(key, defaultVal);
  recalculate();
}

function logChange(key: string, newValue: number) {
  if (!logs.value[key]) {
    logs.value[key] = [];
  }
  const timestamp = new Date().toLocaleTimeString();
  logs.value[key].push({ time: timestamp, value: newValue });
  if (logs.value[key].length > 20) {
    logs.value[key] = logs.value[key].slice(-20);
  }
}

function showDetails(key: string) {
  selectedInputKey.value = key;
  rightPanelOpen.value = true;
}

function toggleExplore(index: number) {
  scenariosData.value[index].showExplore = !scenariosData.value[index].showExplore;
}

function recalculate() {
  scenariosData.value = updateCalculations(scenariosData.value, inputs.value);
}

function onVariableChange(variable: string, value: string) {
  fillSelections.value[variable] = value;
  applyCardVariantChange();
}

function applyCardVariantChange() {
  scenariosData.value.forEach((calc) => {
    if (!(calc as any).originalInputs) {
      (calc as any).originalInputs = [...calc.inputs];
    }
    calc.inputs = (calc as any).originalInputs.map((key: string) => {
      return fillSelections.value[key] || key;
    });
  });
  recalculate();
}

function parseDescription(desc: string) {
  const segments: { type: 'text' | 'variable'; text?: string; variable?: string }[] = [];
  let lastIndex = 0;
  const regex = /\{([a-z0-9_]+)\}/g;
  let match;

  while ((match = regex.exec(desc)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: desc.slice(lastIndex, match.index) });
    }
    const varName = match[1];
    if (inputs.value[varName]) {
      segments.push({ type: 'variable', variable: varName });
      if (!fillSelections.value[varName]) {
        fillSelections.value[varName] = varName;
      }
    } else {
      segments.push({ type: 'text', text: match[0] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < desc.length) {
    segments.push({ type: 'text', text: desc.slice(lastIndex) });
  }

  return segments;
}

function getFillOptions(variable: string) {
  if (!inputs.value[variable]) return [];
  const vt = inputs.value[variable].variable_type;
  if (!inputsByType.value[vt]) return [];
  return inputsByType.value[vt].map(input => ({
    variable: input.variable_name,
    text: `${input.title || formatLabel(input.variable_name)} (${formatValue(input.value, input.scale)} ${input.display_units})`
  }));
}

// Initialize on mount
onMounted(() => {
  // Deep clone the props to make them reactive
  inputs.value = JSON.parse(JSON.stringify(props.initialInputs));
  scenariosData.value = JSON.parse(JSON.stringify(props.initialScenarios));

  // Initialize fill selections
  Object.keys(inputs.value).forEach(key => {
    fillSelections.value[key] = key;
  });

  // Create calculate functions and do initial calculation
  scenariosData.value.forEach(scenario => {
    scenario.calculate = createCalculationFunction(scenario);
  });

  recalculate();
});
</script>

<template>
  <div id="app">
    <!-- Control Bar -->
    <div class="control-bar">
      <div class="control-bar-left">
        <button class="btn btn-sm" :class="leftPanelOpen ? 'btn-primary' : 'btn-outline-primary'" @click="toggleLeftPanel">
          {{ leftPanelOpen ? "Hide" : "Show" }} Inputs
        </button>
      </div>

      <div class="control-bar-center">
        <button
          v-for="cat in uniqueCategories"
          :key="cat"
          class="category-chip"
          :class="{ active: selectedScenario === cat }"
          @click="toggleCategory(cat)"
        >
          {{ cat }}
        </button>
      </div>

      <div class="control-bar-right">
        <button class="btn btn-sm" :class="rightPanelOpen ? 'btn-primary' : 'btn-outline-primary'" @click="toggleRightPanel">
          {{ rightPanelOpen ? "Hide" : "Show" }} Inspector
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="app-layout">
      <!-- Left Panel: Inputs -->
      <aside :class="['side-panel', 'left-panel', { 'panel-open': leftPanelOpen }]">
        <div class="panel-content">
          <div class="panel-header">
            <h5>All Inputs</h5>
            <span class="text-muted">{{ Object.keys(inputs).length }} variables</span>
          </div>
          <div class="input-list">
            <div v-for="(input, key) in inputs" :key="key" class="input-row">
              <div class="input-header">
                <span class="input-name">{{ input.title || formatLabel(String(key)) }}</span>
                <small class="input-units">({{ input.display_units }})</small>
              </div>
              <div class="input-controls">
                <input
                  type="number"
                  class="form-control form-control-sm"
                  :value="formatValue(input.value, input.scale)"
                  @input="updateValue(String(key), ($event.target as HTMLInputElement).value)"
                />
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="adjustValue(String(key), 10)">x10</button>
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="adjustValue(String(key), 0.1)">x0.1</button>
                <button class="btn btn-outline-secondary btn-sm" type="button" @click="resetValue(String(key))">Reset</button>
              </div>
              <div class="input-actions">
                <button class="btn btn-link btn-sm p-0" @click="showDetails(String(key))">Details</button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header id="headerContent" class="page-header">
          <h1>Napkin Math for Training Data Value</h1>
          <p>
            Napkin math, back-of-the-envelope estimates, and ballpark figures – this interactive page explores
            order-of-magnitude estimates for important "data value" questions.
            How will the proceeds and benefits of AI be distributed?
          </p>
        </header>

        <section id="napkinMath">
          <h2 class="section-title">Scenarios</h2>
          <p class="section-description">
            Explore the various scenarios below. Modify input values and choose fill options to see how outcomes change.
          </p>

          <!-- Scenario Cards -->
          <div class="scenarios-container">
            <div v-for="(scenario, index) in filteredScenarios" :key="scenario.id" class="card">
              <header>
                <h4>{{ scenario.title }}</h4>
                <p>
                  <template v-for="(segment, idx) in parseDescription(scenario.description)" :key="idx">
                    <template v-if="segment.type === 'text'">{{ segment.text }}</template>
                    <template v-else>
                      <select
                        class="inline-select"
                        :value="fillSelections[segment.variable!]"
                        @change="onVariableChange(segment.variable!, ($event.target as HTMLSelectElement).value)"
                      >
                        <option
                          v-for="option in getFillOptions(segment.variable!)"
                          :key="option.variable"
                          :value="option.variable"
                        >
                          {{ option.text }}
                        </option>
                      </select>
                    </template>
                  </template>
                </p>
                <div class="result-output">
                  {{ scenario.result.value }} {{ scenario.result.units }}
                </div>
              </header>

              <button class="btn btn-primary explore-button" @click="toggleExplore(index)">
                {{ scenario.showExplore ? 'Hide Details' : 'Explore what would happen if these numbers changed' }}
              </button>

              <!-- Exploration area -->
              <div v-if="scenario.showExplore" class="exploration-area">
                <div class="input-controls">
                  <h5>Adjust Input Values</h5>
                  <div v-for="inputKey in scenario.inputs" :key="inputKey" class="input-control-row">
                    <label class="form-label">
                      {{ inputs[inputKey]?.title || formatLabel(inputKey) }}
                      <small class="text-muted"> ({{ inputs[inputKey]?.display_units }})</small>
                    </label>
                    <div class="input-group">
                      <input
                        type="number"
                        class="form-control"
                        :value="formatValue(inputs[inputKey]?.value, inputs[inputKey]?.scale)"
                        @input="updateValue(inputKey, ($event.target as HTMLInputElement).value)"
                      />
                      <button class="btn btn-outline-secondary" type="button" @click="adjustValue(inputKey, 10)">x10</button>
                      <button class="btn btn-outline-secondary" type="button" @click="adjustValue(inputKey, 0.1)">x0.1</button>
                      <button class="btn btn-outline-secondary" type="button" @click="resetValue(inputKey)">Reset</button>
                      <button class="btn btn-secondary" type="button" @click="showDetails(inputKey)">Info</button>
                    </div>
                  </div>
                </div>

                <div class="mt-3">
                  <button
                    class="btn btn-outline-info btn-sm"
                    @click="scenario.showCalcDetails = !scenario.showCalcDetails"
                  >
                    {{ scenario.showCalcDetails ? "Hide" : "Show" }} Calculation Details
                  </button>
                  <div v-if="scenario.showCalcDetails" class="calc-details mt-2">
                    <h6>Calculation Details</h6>
                    <div class="operation-description mb-2">
                      <strong>Operation:</strong>
                      <span>{{ formatOperation(scenario.operations, inputs) }}</span>
                    </div>
                    <div class="calculation-inputs mb-2">
                      <strong>Input Values:</strong>
                      <ul class="list-unstyled ms-3">
                        <li v-for="inputKey in scenario.inputs" :key="inputKey">
                          {{ inputs[inputKey]?.title || formatLabel(inputKey) }}:
                          <span class="text-primary">
                            {{ formatValue(inputs[inputKey]?.value, inputs[inputKey]?.scale) }} {{ inputs[inputKey]?.display_units }}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div class="mb-2">
                      <strong>Result:</strong>
                      <span class="text-primary">{{ humanReadable(scenario.result.rawValue) }} {{ scenario.result.units }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="aboutContent" class="about-section">
          <details open>
            <summary>About this page</summary>
            <div class="about-content">
              <p>
                <strong>This website is in an early beta state!</strong> Head over to our GitHub page for details and to
                contribute.
                There are many open debates about policy and norms around the use of data for AI systems – and often,
                back-of-the-envelope estimates like these are the starting point.
              </p>
              <p>
                This interactive tool allows you to adjust assumptions and play with the numbers. The underlying math is
                simple arithmetic, yet it provides a framework to reason about order-of-magnitude estimates.
              </p>
              <p>
                To participate in the discussion regarding reasonable default values, check out the
                <a href="https://github.com/nickmvincent/data_napkin_math" target="_blank">GitHub page</a>.
              </p>
            </div>
          </details>
        </section>
      </main>

      <!-- Right Panel: Inspector -->
      <aside :class="['side-panel', 'right-panel', { 'panel-open': rightPanelOpen }]">
        <div class="panel-content">
          <div class="panel-header">
            <h5>Inspector</h5>
            <button class="btn btn-sm btn-outline-secondary" @click="toggleRightPanel">Close</button>
          </div>
          <div class="inspector-content">
            <div v-if="!selectedInputDetails" class="inspector-empty">
              Click "Details" on any input to inspect it here.
            </div>
            <div v-else class="inspector-details">
              <h6>{{ selectedInputDetails.title }}</h6>
              <div class="detail-item">
                <span class="detail-label">Variable Name</span>
                <span class="detail-value">{{ selectedInputDetails.variable_name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Current Value</span>
                <span class="detail-value">
                  {{ formatValue(selectedInputDetails.value, selectedInputDetails.scale) }} {{ selectedInputDetails.display_units }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Default Value</span>
                <span class="detail-value">
                  {{ formatValue(selectedInputDetails.default_value, selectedInputDetails.scale) }} {{ selectedInputDetails.display_units }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Type</span>
                <span class="detail-value">{{ selectedInputDetails.variable_type }}</span>
              </div>
              <div v-if="selectedInputDetails.source_url" class="detail-item">
                <span class="detail-label">Source</span>
                <span class="detail-value">
                  <a :href="selectedInputDetails.source_url" target="_blank">{{ selectedInputDetails.source_url }}</a>
                </span>
              </div>
            </div>

            <div v-if="selectedInputKey && logs[selectedInputKey]?.length" class="change-log">
              <h6>Change Log</h6>
              <div class="change-log-list">
                <div v-for="(log, idx) in logs[selectedInputKey]" :key="idx" class="change-log-item">
                  <span class="change-log-time">{{ log.time }}</span>: {{ humanReadable(log.value) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>
