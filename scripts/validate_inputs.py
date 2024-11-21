import re
import yaml

# Load the YAML file
with open('../data/data.yaml', 'r') as file:
    data = yaml.safe_load(file)

# Regular expression to match the variable naming scheme
variable_regex = re.compile(r"^(?P<description>\w+)__(?P<entity>\w+)__(?P<units>\w+)$")

# Function to validate the input formatting
def validate_inputs(data):
    errors = []
    inputs = data.get('inputs', [])

    for input_data in inputs:
        # Check for missing mandatory fields
        mandatory_fields = ['variable', 'variable_type', 'entity', 'units', 'value', 'scale', 'display_units']
        for field in mandatory_fields:
            if field not in input_data:
                errors.append(f"Missing mandatory field '{field}' in variable '{input_data.get('variable', 'unknown')}'")

        # Validate variable naming scheme
        variable_name = input_data.get('variable', '')
        match = variable_regex.match(variable_name)
        if not match:
            errors.append(f"Variable name '{variable_name}' does not match the naming convention 'description__entity__units'.")
        else:
            # Check that the parts of the variable name align with the respective fields
            description, entity, units = match.group('description'), match.group('entity'), match.group('units')
            if input_data.get('entity') != entity:
                errors.append(f"Entity mismatch in variable '{variable_name}': expected '{entity}', got '{input_data.get('entity')}'.")
            if input_data.get('units') != units:
                errors.append(f"Units mismatch in variable '{variable_name}': expected '{units}', got '{input_data.get('units')}'.")

        # Check for invalid or missing values
        if input_data.get('value') in [None, '', '.nan']:
            errors.append(f"Invalid or missing value for variable '{variable_name}'.")
        if input_data.get('scale') is None or input_data.get('display_units') is None:
            errors.append(f"Missing 'scale' or 'display_units' for variable '{variable_name}'.")

        # Ensure the key assumption and source_url are provided for context
        if 'key_assumption' not in input_data or not input_data['key_assumption']:
            errors.append(f"Missing key assumption for variable '{variable_name}'.")
        if 'source_url' not in input_data or not input_data['source_url'] or input_data['source_url'] == 'source needed':
            errors.append(f"Missing or placeholder source URL for variable '{variable_name}'.")

    return errors

# Run the validation
validation_errors = validate_inputs(data)

# Print out the validation results
if validation_errors:
    print("Validation Errors Found:")
    for error in validation_errors:
        print(f"- {error}")
else:
    print("All inputs are correctly formatted.")
