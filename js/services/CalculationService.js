/**
 * CalculationService
 * Handles the creation and execution of calculation functions
 */
export default class CalculationService {
    /**
     * Create a calculation function from scenario data
     * @param {Object} scenario - Scenario object
     * @param {Object} inputs - Input variables
     * @returns {Function} - Calculation function
     */
    static createCalculationFunction(scenario, inputs) {
      if (scenario.calculation_type === "operations") {
        try {
          const operations = JSON.parse(scenario.operations);
          return this.createOperationsFunction(scenario, operations);
        } catch (error) {
          console.error(`Error creating calculation function for ${scenario.title}:`, error);
          return () => 0; // Default to returning 0 on error
        }
      } else {
        console.warn(`Unsupported calculation type for ${scenario.title}: ${scenario.calculation_type}`);
        return () => 0;
      }
    }
    
    /**
     * Create a function that processes a sequence of operations
     * @param {Object} scenario - Scenario object
     * @param {Array} operations - Array of operations
     * @returns {Function} - Calculation function
     */
    static createOperationsFunction(scenario, operations) {
      return function(...args) {
        // Create a mapping from input names to their positions in the args array
        const inputMap = {};
        scenario.input_variables.forEach((varName, index) => {
          inputMap[varName] = index;
        });
        
        // Context for storing intermediate results
        const context = {};
        
        // For each input variable, add its value to the context
        scenario.input_variables.forEach((varName, index) => {
          context[varName] = args[index];
        });
        
        let result;
        
        // Process operations in sequence
        for (const op of operations) {
          const processedArgs = op.args.map(arg => {
            if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
              const varName = arg.slice(1, -1);
              if (context[varName] !== undefined) {
                return context[varName];
              } else {
                throw new Error(`Missing value for "${varName}" in calculation`);
              }
            }
            // If it's not a variable reference, treat it as a literal number
            return parseFloat(arg);
          });
          
          // Apply the operation
          switch (op.func) {
            case "multiply":
              result = processedArgs.reduce((a, b) => a * b, 1);
              break;
            case "divide":
              result = processedArgs[0] / processedArgs[1];
              break;
            case "add":
              result = processedArgs.reduce((a, b) => a + b, 0);
              break;
            case "subtract":
              result = processedArgs[0] - processedArgs[1];
              break;
            case "power":
              result = Math.pow(processedArgs[0], processedArgs[1]);
              break;
            default:
              throw new Error(`Unsupported operation: ${op.func}`);
          }
          
          // Store the result if the operation has a name
          if (op.name) {
            context[op.name] = result;
          }
        }
        
        return result;
      };
    }
    
    /**
     * Recalculate all scenario results
     * @param {Array} scenarios - Array of scenario objects
     * @param {Object} inputs - Input variables
     * @returns {Array} - Updated scenarios with recalculated results
     */
    static updateCalculations(scenarios, inputs) {
      return scenarios.map(scenario => {
        try {
          // Skip scenarios with missing or invalid inputs
          if (!scenario.inputs || !scenario.inputs.length || !scenario.calculate) {
            return {
              ...scenario,
              result: { 
                ...scenario.result,
                value: 'Error: Missing inputs or calculation',
                rawValue: null
              }
            };
          }
          
          // Get input values for calculation
          const inputValues = scenario.inputs.map(key => inputs[key]?.value);
          
          // Check if any inputs are missing
          if (inputValues.some(val => val === undefined)) {
            return {
              ...scenario,
              result: { 
                ...scenario.result,
                value: 'Error: Missing input values',
                rawValue: null
              }
            };
          }
          
          // Calculate the result
          const rawValue = scenario.calculate(...inputValues);
          
          return {
            ...scenario,
            result: {
              ...scenario.result,
              value: this.formatHumanReadable(rawValue),
              rawValue
            }
          };
        } catch (error) {
          console.error(`Error calculating result for ${scenario.title}:`, error);
          return {
            ...scenario,
            result: { 
              ...scenario.result,
              value: 'Error: Calculation failed',
              rawValue: null
            }
          };
        }
      });
    }
    
    /**
     * Format a number in a human-readable way
     * @param {number} value - Number to format
     * @returns {string} - Formatted string
     */
    static formatHumanReadable(value) {
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