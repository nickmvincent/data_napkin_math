import jsyaml from 'js-yaml';
import fetch from 'node-fetch';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';

async function loadAndValidateYaml(gistUrl, filePath) {
    try {
        let yamlText;

        // Load YAML from local file or URL
        if (filePath) {
            // Read the YAML file from the provided file path
            yamlText = await fs.readFile(filePath, 'utf8');
        } else {
            // Fetch the YAML file from the provided Gist URL
            const response = await fetch(gistUrl);
            if (!response.ok) throw new Error('Failed to load data from Gist');
            yamlText = await response.text();
        }

        const data = jsyaml.load(yamlText);

        // Validate the YAML structure
        if (!Array.isArray(data.inputs) || !Array.isArray(data.calculations)) {
            throw new Error('Invalid YAML structure. Expected "inputs" and "calculations" fields as arrays.');
        }

        // Convert inputs array to a map for easier lookup
        const inputsMap = data.inputs.reduce((acc, input) => {
            if (!input.variable || typeof input.value === 'undefined') {
                throw new Error(`Invalid input entry: ${input.variable || 'Unknown Variable'}`);
            }
            acc[input.variable] = input;
            return acc;
        }, {});

        // Validate each calculation for required fields and run the equations
        data.calculations.forEach(calculation => {
            if (!calculation.title || !calculation.explanation || !Array.isArray(calculation.inputs)) {
                throw new Error(`Invalid calculation entry: ${calculation.title || 'Unknown Title'}`);
            }

            // Prepare a context for the equation with the available inputs
            const inputs = calculation.inputs.reduce((acc, key) => {
                if (!inputsMap[key] || typeof inputsMap[key].value === 'undefined') {
                    throw new Error(`Missing input value for key: ${key} in calculation: ${calculation.title}`);
                }
                acc[key] = inputsMap[key].value;
                return acc;
            }, {});

            // Attempt to evaluate the equation
            try {
                const result = new Function(...Object.keys(inputs), `return ${calculation.explanation}`)(...Object.values(inputs));
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

// Using yargs to add optional CLI arguments for the URL or local file path
const argv = yargs(hideBin(process.argv))
    .option('url', {
        alias: 'u',
        type: 'string',
        description: 'URL of the YAML file to be validated',
        //default: 'https://gist.githubusercontent.com/nickmvincent/2c3e4ca38272b1d6b3041dd856e6cab7/raw/',
    })
    .option('file', {
        alias: 'f',
        type: 'string',
        description: 'Path to the local YAML file to be validated',
        default: 'data/data.yaml',

    })
    .help()
    .argv;

// Example usage
if (argv.file) {
    loadAndValidateYaml(null, argv.file);
} else {
    loadAndValidateYaml(argv.url, null);
}
