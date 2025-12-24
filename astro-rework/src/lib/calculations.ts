// Calculation utilities for Data Napkin Math

export interface Input {
  id: string;
  title: string;
  value: number;
  default_value: number;
  scale: number;
  display_units: string;
  variable_name: string;
  variable_type: string;
  entity?: string;
  units: string;
  source_url?: string;
  nice_name?: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  input_variables: string[];
  inputs: string[];
  calculation_type: string;
  operations: string;
  result_label: string;
  result_units: string;
  category: string;
  result: {
    value: string;
    rawValue: number | null;
    units: string;
  };
  showExplore?: boolean;
  showCalcDetails?: boolean;
  calculate?: (...args: number[]) => number;
}

export interface Operation {
  func: string;
  args: (string | number)[];
  name?: string;
}

/**
 * Format a variable key into a readable label
 */
export function formatLabel(key: string): string {
  if (!key) return '';
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}

/**
 * Format a value according to its scale
 */
export function formatValue(value: number, scale: number): number {
  return scale ? value / scale : value;
}

/**
 * Format a number in a human-readable way
 */
export function humanReadable(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A';
  if (value === 0) return "0";

  if (Math.abs(value) < 1) {
    const valueStr = value.toString();
    const match = valueStr.match(/[1-9]/);
    const firstNonZeroIndex = match ? valueStr.indexOf(match[0]) : 2;
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

/**
 * Create a calculation function from scenario data
 */
export function createCalculationFunction(scenario: Scenario): (...args: number[]) => number {
  if (scenario.calculation_type === "operations") {
    try {
      const operations: Operation[] = JSON.parse(scenario.operations);
      return createOperationsFunction(scenario.input_variables, operations);
    } catch (error) {
      console.error(`Error creating calculation function for ${scenario.title}:`, error);
      return () => 0;
    }
  } else {
    console.warn(`Unsupported calculation type for ${scenario.title}: ${scenario.calculation_type}`);
    return () => 0;
  }
}

/**
 * Create a function that processes a sequence of operations
 */
function createOperationsFunction(inputVariables: string[], operations: Operation[]): (...args: number[]) => number {
  return function (...args: number[]): number {
    const context: Record<string, number> = {};

    // Add input values to context
    inputVariables.forEach((varName, index) => {
      context[varName] = args[index];
    });

    let result = 0;

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
        return parseFloat(String(arg));
      });

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

      if (op.name) {
        context[op.name] = result;
      }
    }

    return result;
  };
}

/**
 * Format operation for human readability
 */
export function formatOperation(operationsJson: string, inputs: Record<string, Input>): string {
  try {
    const operations: Operation[] = JSON.parse(operationsJson);

    if (!operations || !operations.length) {
      return 'No operations defined';
    }

    const descriptions = operations.map(op => {
      const formattedArgs = op.args.map(arg => {
        if (typeof arg === 'string' && arg.startsWith('{') && arg.endsWith('}')) {
          const varName = arg.slice(1, -1);
          return inputs[varName]?.nice_name || inputs[varName]?.title || formatLabel(varName);
        }
        return String(arg);
      });

      switch (op.func) {
        case 'multiply':
          return `Multiply ${formattedArgs.join(' x ')}`;
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

    return descriptions.map((desc, index) => `Step ${index + 1}: ${desc}`).join('\n');
  } catch (error) {
    console.error('Error formatting operation:', error);
    return 'Error parsing operations';
  }
}

/**
 * Update calculations for all scenarios
 */
export function updateCalculations(scenarios: Scenario[], inputs: Record<string, Input>): Scenario[] {
  return scenarios.map(scenario => {
    try {
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

      const inputValues = scenario.inputs.map(key => inputs[key]?.value);

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

      const rawValue = scenario.calculate(...inputValues);

      return {
        ...scenario,
        result: {
          ...scenario.result,
          value: humanReadable(rawValue),
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
