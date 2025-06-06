/**
 * Main Application - Updated for improved UI
 * Entry point for the Data Napkin Math application
 */
import DataService from './services/DataService.js';
import CalculationService from './services/CalculationService.js';
import { loadChartLibrary, createSensitivityData, createChartConfig, destroyChart } from './utils/chartHelpers.js';
import { formatLabel, formatValue, humanReadable } from './utils/formatters.js';

// Import components
import ScenarioCard from './components/ScenarioCard.js';
import InputPanel from './components/InputPanel.js';
import InspectorPanel from './components/InspectorPanel.js';
import CategorySelector from './components/CategorySelector.js';

console.log("Main.js loaded and script execution started");

// Wrap in try-catch to catch initialization errors
try {
    // Register components
    const app = Vue.createApp({
        components: {
            ScenarioCard,
            InputPanel,
            InspectorPanel,
            CategorySelector
        },

        data() {
            return {
                // UI state
                leftPanelOpen: false,
                rightPanelOpen: false,
                isLoading: true,
                error: null,
                isMobile: window.innerWidth < 768,

                // Data
                inputs: {},
                scenariosData: [],
                selectedInputKey: null,
                selectedScenario: "All",
                logs: {},

                // For inline fill dropdown values
                fillSelections: {},

                // Chart state
                plotLibraryLoaded: false,
            };
        },

        computed: {
            selectedInputDetails() {
                return this.selectedInputKey ? this.inputs[this.selectedInputKey] : null;
            },

            filteredScenarios() {
                return this.selectedScenario === "All"
                    ? this.scenariosData
                    : this.scenariosData.filter(scenario => scenario.category === this.selectedScenario);
            },

            // Group inputs by variable_type
            inputsByType() {
                return Object.values(this.inputs).reduce((groups, input) => {
                    if (!groups[input.variable_type]) {
                        groups[input.variable_type] = [];
                    }
                    groups[input.variable_type].push(input);
                    return groups;
                }, {});
            },

            // Get unique categories from scenarios
            uniqueCategories() {
                const cats = this.scenariosData
                    .filter(scenario => scenario.category)
                    .map(scenario => scenario.category);
                return ["All", ...new Set(cats)];
            }
        },

        methods: {
            recalculate() {
                this.updateCalculations();
            },

            // Panel toggling
            toggleLeftPanel() {
                this.leftPanelOpen = !this.leftPanelOpen;
                // Close right panel on mobile if opening left
                if (this.isMobile && this.leftPanelOpen) {
                    this.rightPanelOpen = false;
                }
            },

            toggleRightPanel() {
                if (this.isMobile) {
                    const modalEl = document.getElementById("inspectorModal");
                    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    modal.toggle();
                } else {
                    this.rightPanelOpen = !this.rightPanelOpen;
                    // Close left panel on mobile if opening right
                    if (this.isMobile && this.rightPanelOpen) {
                        this.leftPanelOpen = false;
                    }
                }
            },

            toggleCategory(category) {
                this.selectedScenario = category;
            },

            // Format utilities
            formatLabel,
            formatValue,
            humanReadable,

            // Value modification
            updateValue(payload) {
                try {
                    if (!payload || typeof payload !== 'object') {
                        console.error("Invalid payload in updateValue:", payload);
                        return;
                    }

                    const { key, value } = payload;
                    if (!key || !this.inputs[key]) {
                        console.error("Invalid key in updateValue:", key);
                        return;
                    }

                    const scale = this.inputs[key].scale || 1;

                    let newVal;
                    try {
                        newVal = parseFloat(value) * scale;
                        if (isNaN(newVal)) {
                            console.warn("Invalid number input:", value);
                            return;
                        }
                    } catch (error) {
                        console.error("Error parsing value:", error);
                        return;
                    }

                    if (this.inputs[key].value !== newVal) {
                        this.inputs[key].value = newVal;
                        this.logChange(key, newVal);
                        this.updateCalculations();
                    }
                } catch (error) {
                    console.error("Error in updateValue handler:", error);
                }
            },

            adjustValue(payload) {
                try {
                    if (!payload || typeof payload !== 'object') {
                        console.error("Invalid payload in adjustValue:", payload);
                        return;
                    }

                    const { key, factor } = payload;
                    if (!key || !this.inputs[key]) {
                        console.error("Invalid key in adjustValue:", key);
                        return;
                    }

                    if (factor === undefined || factor === null) {
                        console.error("Invalid factor in adjustValue:", factor);
                        return;
                    }

                    const currentVal = parseFloat(this.inputs[key].value) || 0;
                    const newVal = currentVal * factor;

                    this.inputs[key].value = newVal;
                    this.logChange(key, newVal);
                    this.updateCalculations();
                } catch (error) {
                    console.error("Error in adjustValue handler:", error);
                }
            },

            resetValue(key) {
                try {
                    if (!key || !this.inputs[key]) {
                        console.error("Invalid key in resetValue:", key);
                        return;
                    }

                    const defaultVal = this.inputs[key].default_value;
                    if (defaultVal === undefined) {
                        console.error("No default value for:", key);
                        return;
                    }

                    this.inputs[key].value = defaultVal;
                    this.logChange(key, defaultVal);
                    this.updateCalculations();
                } catch (error) {
                    console.error("Error in resetValue handler:", error);
                }
            },

            logChange(key, newValue) {
                try {
                    if (!key) {
                        console.error("Invalid key in logChange");
                        return;
                    }

                    if (!this.logs[key]) {
                        this.logs[key] = [];
                    }

                    const timestamp = new Date().toLocaleTimeString();
                    this.logs[key].push({ time: timestamp, value: newValue });

                    // Keep only last 20 changes
                    if (this.logs[key].length > 20) {
                        this.logs[key] = this.logs[key].slice(-20);
                    }
                } catch (error) {
                    console.error("Error in logChange:", error);
                }
            },

            showDetails(key) {
                try {
                    if (!key) {
                        console.error("Invalid key in showDetails");
                        return;
                    }

                    this.selectedInputKey = key;

                    if (this.isMobile) {
                        const modalEl = document.getElementById("inspectorModal");
                        if (!modalEl) {
                            console.error("Modal element not found");
                            return;
                        }

                        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                        modal.show();
                    } else {
                        this.rightPanelOpen = true;
                    }
                } catch (error) {
                    console.error("Error in showDetails:", error);
                }
            },

            onCardDropdownChange(payload) {
                try {
                    if (!payload || typeof payload !== 'object') {
                        console.error("Invalid payload in onCardDropdownChange:", payload);
                        return;
                    }

                    const { variable, value } = payload;
                    if (!variable) {
                        console.error("Missing variable in onCardDropdownChange");
                        return;
                    }

                    this.fillSelections[variable] = value;
                    this.applyCardVariantChange();
                } catch (error) {
                    console.error("Error in onCardDropdownChange handler:", error);
                }
            },

            applyCardVariantChange() {
                this.scenariosData.forEach((calc) => {
                    if (!calc.originalInputs) {
                        calc.originalInputs = [...calc.inputs];
                    }

                    calc.inputs = calc.originalInputs.map(key => {
                        return this.fillSelections[key] || key;
                    });
                });

                this.updateCalculations();
            },

            // Calculations
            updateCalculations() {
                this.scenariosData = CalculationService.updateCalculations(this.scenariosData, this.inputs);
            },

            // Description parsing for dropdowns
            parseDescription(desc) {
                const segments = [];
                let lastIndex = 0;
                const regex = /\{([a-z0-9_]+)\}/g;
                let match;

                while ((match = regex.exec(desc)) !== null) {
                    if (match.index > lastIndex) {
                        segments.push({ type: 'text', text: desc.slice(lastIndex, match.index) });
                    }

                    const varName = match[1];
                    if (this.inputs[varName]) {
                        segments.push({ type: 'variable', variable: varName });

                        if (!this.fillSelections[varName]) {
                            this.fillSelections[varName] = varName;
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
            },

            // Get dropdown options
            getFillOptionsForType(variable) {
                if (!this.inputs[variable]) return [];

                const vt = this.inputs[variable].variable_type;
                if (!this.inputsByType[vt]) return [];

                return this.inputsByType[vt].map(input => ({
                    variable: input.variable_name,
                    text: `${input.title || this.formatLabel(input.variable_name)} (${this.formatValue(input.value, input.scale)} ${input.display_units})`
                }));
            },

            // Exploration panel
            toggleExplore(index) {
                const scenario = this.scenariosData[index];

                scenario.showExplore = !scenario.showExplore;

                if (scenario.showExplore && !scenario.hasOwnProperty('plotGenerated')) {
                    scenario.plotGenerated = false;
                    scenario.chartError = false;
                    scenario.selectedSensitivityVar = '';
                    scenario.sensitivityRange = 5;
                }

                if (!scenario.showExplore && scenario.chart) {
                    destroyChart(scenario.chart);
                    scenario.chart = null;
                }
            },

            // Sensitivity chart generation
            async generateSensitivityPlot(index) {
                const scenario = this.scenariosData[index];
                const selectedVar = scenario.selectedSensitivityVar;

                if (!selectedVar) return;

                scenario.chartError = false;

                if (!this.plotLibraryLoaded) {
                    try {
                        await loadChartLibrary();
                        this.plotLibraryLoaded = true;
                    } catch (error) {
                        scenario.chartError = true;
                        scenario.plotGenerated = true;
                        console.error('Failed to load Chart.js:', error);
                        return;
                    }
                }

                try {
                    const chartData = createSensitivityData(
                        scenario,
                        selectedVar,
                        this.inputs,
                        scenario.sensitivityRange
                    );

                    const config = createChartConfig(
                        chartData,
                        scenario,
                        this.inputs[selectedVar]
                    );

                    const containerId = `plot-container-${index}`;
                    const container = document.getElementById(containerId);

                    if (!container) {
                        throw new Error(`Container ${containerId} not found`);
                    }

                    if (scenario.chart) {
                        destroyChart(scenario.chart);
                        scenario.chart = null;
                    }

                    let canvas = container.querySelector('canvas');
                    if (!canvas) {
                        canvas = document.createElement('canvas');
                        container.appendChild(canvas);
                    }

                    const ctx = canvas.getContext('2d');
                    scenario.chart = new Chart(ctx, config);
                    scenario.plotGenerated = true;

                    this.updateCalculations();

                } catch (error) {
                    console.error('Chart generation error:', error);
                    scenario.chartError = true;
                    scenario.plotGenerated = true;
                }
            },

            // Data loading
            async loadData() {
                console.log("App: loadData method called");
                this.isLoading = true;
                this.error = null;

                try {
                    console.log("App: Starting data loading process");

                    try {
                        const data = await DataService.loadData('data/data.json');

                        this.inputs = data.inputs;
                        this.scenariosData = data.scenarios;

                        Object.keys(this.inputs).forEach(key => {
                            this.fillSelections[key] = key;
                        });

                        this.updateCalculations();
                        console.log("App: Data loaded and calculations performed successfully");

                        loadChartLibrary().then(() => {
                            this.plotLibraryLoaded = true;
                            console.log("App: Chart.js loaded successfully");
                        }).catch(error => {
                            console.warn('App: Chart.js preload failed:', error);
                        });

                    } catch (primaryError) {
                        console.error("App: Primary data path failed:", primaryError);

                        try {
                            console.log("App: Trying alternate data path...");
                            const data = await DataService.loadData('/data/data.json');

                            this.inputs = data.inputs;
                            this.scenariosData = data.scenarios;

                            Object.keys(this.inputs).forEach(key => {
                                this.fillSelections[key] = key;
                            });

                            this.updateCalculations();
                            console.log("App: Data loaded from alternate path successfully");
                        } catch (secondaryError) {
                            console.error("App: Secondary data path also failed:", secondaryError);
                            throw new Error(`Data loading failed: ${primaryError.message}. Fallback also failed: ${secondaryError.message}`);
                        }
                    }
                } catch (error) {
                    console.error("App: All data loading attempts failed:", error);
                    this.error = `Failed to load data: ${error.message}`;
                    alert(`Error loading data. Please check if the data/data.json file exists and is properly formatted.\n\nDetails: ${error.message}`);
                } finally {
                    this.isLoading = false;
                    console.log("App: Data loading process completed, loading state set to false");
                }
            }
        },

        mounted() {
            console.log("App: mounted() lifecycle hook called");

            this.loadData();

            // Track window size for responsive design
            this.handleResize = () => {
                this.isMobile = window.innerWidth < 768;
            };
            
            window.addEventListener('resize', this.handleResize);

            // Set up modal events for mobile
            const modalEl = document.getElementById('inspectorModal');
            if (modalEl) {
                modalEl.addEventListener('shown.bs.modal', () => {
                    // Modal is shown
                });

                modalEl.addEventListener('hidden.bs.modal', () => {
                    // Modal is hidden
                });
            }
        },

        unmounted() {
            window.removeEventListener('resize', this.handleResize);

            this.scenariosData.forEach(scenario => {
                if (scenario.chart) {
                    destroyChart(scenario.chart);
                }
            });
        }
    });

    console.log("App created, mounting to #app element");
    app.mount("#app");
    console.log("App mounting complete");

} catch (error) {
    console.error("Fatal error during initialization:", error);
    document.body.innerHTML = `
    <div style="color: red; margin: 20px; padding: 20px; border: 1px solid red;">
      <h2>Application Initialization Error</h2>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}