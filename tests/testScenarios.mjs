// Import necessary modules
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';
import jsyaml from 'js-yaml';
import { scenariosData } from '../scenarios.js';

// Function to validate JavaScript-based calculations
async function validateCalculations(filePath) {
    try {
        let inputs;

        // Load inputs from the provided YAML file path
        if (filePath) {
            const inputText = await fs.readFile(filePath, 'utf8');
            inputs = jsyaml.load(inputText);
        }

        // Validate the input data
        if (typeof inputs !== 'object' || !inputs.inputs) {
            throw new Error('Invalid inputs structure. Expected an object with an "inputs" field.');
        }

        const inputsMap = inputs.inputs.reduce((acc, input) => {
            if (!input.variable || typeof input.value === 'undefined') {
                throw new Error(`Invalid input entry: ${input.variable || 'Unknown Variable'}`);
            }
            acc[input.variable] = input;
            return acc;
        }, {});

        // Validate each calculation for required fields and execute the calculations
        scenariosData.forEach(calculation => {
            if (!calculation.title || !calculation.calculate || !Array.isArray(calculation.inputs)) {
                throw new Error(`Invalid calculation entry: ${calculation.title || 'Unknown Title'}`);
            }

            // Prepare a context for the calculation with the available inputs
            const inputValues = calculation.inputs.map(key => {
                if (!inputsMap[key] || typeof inputsMap[key].value === 'undefined') {
                    throw new Error(`Missing input value for key: ${key} in calculation: ${calculation.title}`);
                }
                return inputsMap[key].value;
            });

            // Attempt to evaluate the calculation function
            try {
                const result = calculation.calculate(...inputValues);
                console.log(`Calculation "${calculation.title}" evaluated successfully with result: ${result}`);
            } catch (error) {
                throw new Error(`Error evaluating calculation "${calculation.title}": ${error.message}`);
            }
        });

        console.log('All calculations evaluated successfully.');
    } catch (error) {
        console.error('Validation error:', error);
    }
}

// Using yargs to add optional CLI arguments for the local input file path
const argv = yargs(hideBin(process.argv))
    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'Path to the local YAML input file to be validated',
        default: 'data/inputs.yaml',
    })
    .help()
    .argv;

// Example usage
if (argv.file) {
    validateCalculations(argv.file);
} else {
    console.error('No file path provided for validation.');
}
