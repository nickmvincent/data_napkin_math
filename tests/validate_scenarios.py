import argparse
import yaml
import requests
import os

# Load the YAML from a local file or a URL
def load_yaml(gist_url=None, file_path=None):
    try:
        if file_path:
            # Read YAML file from the provided local file path
            with open(file_path, 'r') as file:
                yaml_text = file.read()
        elif gist_url:
            # Fetch the YAML file from the provided Gist URL
            response = requests.get(gist_url)
            if response.status_code != 200:
                raise Exception("Failed to load data from Gist")
            yaml_text = response.text
        else:
            raise Exception("Either a file path or a URL must be provided")

        # Load the YAML data
        data = yaml.safe_load(yaml_text)

        return data

    except Exception as e:
        print(f"Error loading YAML: {e}")
        exit(1)

# Validate the input formatting and run the calculations
def validate_inputs(data):
    try:
        # Validate the YAML structure
        if not isinstance(data.get('inputs'), list) or not isinstance(data.get('calculations'), list):
            raise Exception('Invalid YAML structure. Expected "inputs" and "calculations" fields as lists.')

        # Convert inputs array to a dictionary for easier lookup
        inputs_map = {}
        for input_data in data['inputs']:
            if 'variable' not in input_data or 'value' not in input_data:
                raise Exception(f"Invalid input entry: {input_data.get('variable', 'Unknown Variable')}")
            inputs_map[input_data['variable']] = input_data

        # Validate each calculation for required fields and run the equations
        for calculation in data['calculations']:
            if 'title' not in calculation or 'explanation' not in calculation or not isinstance(calculation.get('inputs'), list):
                raise Exception(f"Invalid calculation entry: {calculation.get('title', 'Unknown Title')}")

            # Prepare a context for the equation with the available inputs
            inputs = {}
            for key in calculation['inputs']:
                if key not in inputs_map or inputs_map[key].get('value') is None:
                    raise Exception(f"Missing input value for key: {key} in calculation: {calculation['title']}")
                inputs[key] = inputs_map[key]['value']

            # Attempt to evaluate the equation
            try:
                # Use eval with caution. It's okay here because we control the source, but it can be dangerous.
                result = eval(calculation['explanation'], {}, inputs)
                print(f'Calculation "{calculation["title"]}" evaluated successfully with result: {result}')
            except Exception as error:
                raise Exception(f"Error evaluating calculation '{calculation['title']}': {error}")

        print('All calculations evaluated successfully.')

    except Exception as error:
        print(f'Validation error: {error}')

# Main function
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Validate a YAML file from a URL or local file path.')
    parser.add_argument('--url', '-u', type=str, help='URL of the YAML file to be validated')
    parser.add_argument('--file', '-f', type=str, help='Path to the local YAML file to be validated', default='data/data.yaml')

    args = parser.parse_args()

    # Load and validate the YAML file
    yaml_data = None
    if args.file:
        yaml_data = load_yaml(file_path=args.file)
    elif args.url:
        yaml_data = load_yaml(gist_url=args.url)
    
    # Validate inputs and calculations if YAML was loaded
    if yaml_data:
        validate_inputs(yaml_data)
