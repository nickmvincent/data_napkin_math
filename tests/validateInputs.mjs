import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Load the YAML file
const filePath = path.resolve(process.cwd(), 'data/inputs.yaml');
let data;

try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    data = yaml.load(fileContent);
} catch (e) {
    console.error("Failed to load the YAML file:", e);
    process.exit(1);
}

// Regular expression to match the variable naming scheme
const variableRegex = /^(?<description>\w+)__(?<entity>\w+)__(?<units>\w+)$/;

// Function to validate the input formatting
function validateInputs(data) {
    let errors = [];
    const inputs = data.inputs || [];

    inputs.forEach((inputData) => {
        // Check for missing mandatory fields
        const mandatoryFields = ['variable', 'variable_type', 'entity', 'units', 'value', 'scale', 'display_units'];
        mandatoryFields.forEach((field) => {
            if (!(field in inputData)) {
                errors.push(`Missing mandatory field '${field}' in variable '${inputData.variable || 'unknown'}'`);
            }
        });

        // Validate variable naming scheme
        const variableName = inputData.variable || '';
        const match = variableRegex.exec(variableName);
        if (!match) {
            errors.push(`Variable name '${variableName}' does not match the naming convention 'description__entity__units'.`);
        } else {
            // Check that the parts of the variable name align with the respective fields
            const { entity, units } = match.groups;
            if (inputData.entity !== entity) {
                errors.push(`Entity mismatch in variable '${variableName}': expected '${entity}', got '${inputData.entity}'.`);
            }
            if (inputData.units !== units) {
                errors.push(`Units mismatch in variable '${variableName}': expected '${units}', got '${inputData.units}'.`);
            }
        }

        // Check for invalid or missing values
        if (inputData.value === null || inputData.value === '' || inputData.value === '.nan') {
            errors.push(`Invalid or missing value for variable '${variableName}'.`);
        }
        if (inputData.scale === undefined || inputData.display_units === undefined) {
            errors.push(`Missing 'scale' or 'display_units' for variable '${variableName}'.`);
        }

        // Ensure the key assumption and source_url are provided for context
        if (!inputData.key_assumption) {
            errors.push(`Missing key assumption for variable '${variableName}'.`);
        }
        if (!inputData.source_url || inputData.source_url === 'source needed') {
            errors.push(`Missing or placeholder source URL for variable '${variableName}'.`);
        }
    });

    return errors;
}

// Run the validation
const validationErrors = validateInputs(data);

// Print out the validation results
if (validationErrors.length > 0) {
    console.log("Validation Errors Found:");
    validationErrors.forEach((error) => {
        console.log(`- ${error}`);
    });
} else {
    console.log("All inputs are correctly formatted.");
}
