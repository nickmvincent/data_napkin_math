/**
 * DataService
 * Handles loading and processing data for the application
 */
import CalculationService from './CalculationService.js';

export default class DataService {
  /**
   * Load data from the server
   * @param {string} url - URL to fetch data from
   * @returns {Promise<Object>} - Processed data
   */
  static async loadData(url = 'data/data.json') {
    try {
      console.log("DataService: Attempting to fetch data from:", url);
      
      // Add a timeout to the fetch to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      console.log("DataService: Fetch response received:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.status} ${response.statusText}`);
      }
      
      console.log("DataService: Response is OK, parsing JSON...");
      const text = await response.text(); // Get as text first for debugging
      
      // Check if we got valid data back
      if (!text || text.trim() === '') {
        throw new Error("DataService: Empty response received");
      }
      
      console.log("DataService: Raw response (first 100 chars):", text.substring(0, 100));
      
      // Try parsing the JSON
      let data;
      try {
        data = JSON.parse(text);
        console.log("DataService: JSON parsed successfully, data keys:", Object.keys(data));
      } catch (parseError) {
        console.error("DataService: JSON parse error:", parseError);
        throw new Error(`Invalid JSON: ${parseError.message}`);
      }
      
      // Validate data structure
      if (!data.inputs || !Array.isArray(data.inputs)) {
        throw new Error("DataService: Invalid data structure - missing inputs array");
      }
      
      if (!data.scenarios || !Array.isArray(data.scenarios)) {
        throw new Error("DataService: Invalid data structure - missing scenarios array");
      }
      
      console.log("DataService: Processing data...");
      const processed = this.processData(data);
      console.log("DataService: Data processing complete");
      
      return processed;
    } catch (error) {
      console.error("DataService: Data loading failed:", error);
      
      // Provide detailed error info based on error type
      if (error.name === 'AbortError') {
        throw new Error("Request timed out. The server took too long to respond.");
      } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error("Network error. Check your connection and make sure the server is running.");
      } else {
        throw error;
      }
    }
  }
  
  /**
   * Process raw data into application format
   * @param {Object} data - Raw data from server
   * @returns {Object} - Processed data
   */
  static processData(data) {
    // Process inputs
    const inputs = this.processInputs(data.inputs);
    console.log(`DataService: Processed ${Object.keys(inputs).length} inputs`);
    
    // Process scenarios
    const scenarios = this.processScenarios(data.scenarios, inputs);
    console.log(`DataService: Processed ${scenarios.length} scenarios`);
    
    return { inputs, scenarios };
  }
  
  /**
   * Process input variables
   * @param {Array} inputsArray - Array of input objects
   * @returns {Object} - Processed inputs keyed by variable_name
   */
  static processInputs(inputsArray) {
    const processed = inputsArray.reduce((acc, input) => {
      const key = input.variable_name;
      
      if (!key) {
        console.error("DataService: Input missing variable_name:", input);
        return acc;
      }
      
      acc[key] = {
        ...input,
        default_value: input.value,
        value: input.value,
        nice_name: input.title || this.formatLabel(key),
        display_units: input.display_units || "",
        variable_type: input.variable_type || "",
        key_assumption: input.content ?
          input.content.match(/## Key Assumption\n\n(.*?)\n\n/s)?.[1] : "",
        source_notes: input.content ?
          input.content.match(/## Source\n\n(.*)/s)?.[1] : "",
        value_description: input.content ?
          input.content.match(/## Description\n\n(.*?)\n\n/s)?.[1] : ""
      };
      
      // Create a phrase_for_card property for dropdown display
      acc[key].phrase_for_card = input.title ?
        `${input.title} (${input.value} ${input.display_units})` :
        `${this.formatLabel(key)} (${input.value} ${input.display_units})`;
      
      return acc;
    }, {});
    
    return processed;
  }
  
  /**
   * Process scenario objects
   * @param {Array} scenariosArray - Array of scenario objects
   * @param {Object} inputs - Processed inputs
   * @returns {Array} - Processed scenarios
   */
  static processScenarios(scenariosArray, inputs) {
    return scenariosArray.map(scenario => {
      // Create calculation function
      const calculateFunc = CalculationService.createCalculationFunction(scenario, inputs);
      
      return {
        ...scenario,
        inputs: scenario.input_variables || [],
        calculate: calculateFunc,
        result: {
          label: scenario.result_label || '',
          value: 0,
          rawValue: 0,
          units: scenario.result_units || ''
        },
        showDiagram: false,
        showCalcDetails: false,
        showExplore: false,
        plotGenerated: false,
        chartError: false,
        selectedSensitivityVar: '',
        sensitivityRange: 5,
        chart: null,
        originalInputs: scenario.input_variables ? [...scenario.input_variables] : []
      };
    });
  }
  
  /**
   * Format a variable key into a readable label
   * @param {string} key - Variable key
   * @returns {string} - Formatted label
   */
  static formatLabel(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  }
}