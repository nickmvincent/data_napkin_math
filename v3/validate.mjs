// Script to load and validate YAML from GitHub Gist to ensure all equations are runnable

import jsyaml from 'js-yaml';
import fetch from 'node-fetch';

async function loadAndValidateYaml(gistUrl) {
    try {
        // Fetch the YAML file from the provided Gist URL
        const response = await fetch(gistUrl);
        if (!response.ok) throw new Error('Failed to load data from Gist');
        const yamlText = await response.text();
        const data = jsyaml.load(yamlText);

        // Validate the YAML structure
        if (!data.inputs || !Array.isArray(data.calculations)) {
            throw new Error('Invalid YAML structure. Expected "inputs" and "calculations" fields.');
        }

        // Validate each calculation for required fields and run the equations
        data.calculations.forEach(calculation => {
            if (!calculation.title || !calculation.explanation || !Array.isArray(calculation.inputs)) {
                throw new Error(`Invalid calculation entry: ${calculation.title || 'Unknown Title'}`);
            }

            // Prepare a context for the equation with the available inputs
            const inputs = calculation.inputs.reduce((acc, key) => {
                if (typeof data.inputs[key] === 'undefined') {
                    throw new Error(`Missing input value for key: ${key} in calculation: ${calculation.title}`);
                }
                acc[key] = data.inputs[key];
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

// Example usage
const gistUrl = 'https://gist.githubusercontent.com/nickmvincent/2c3e4ca38272b1d6b3041dd856e6cab7/raw/9f5fc575d4bacb7e8d1cff87f50aa6823121bb7f/gistfile1.txt';
loadAndValidateYaml(gistUrl);
