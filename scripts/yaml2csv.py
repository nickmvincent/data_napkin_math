import yaml
import csv

def yaml_to_csv(yaml_file, csv_file):
    # Load the YAML file
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
    
    # Extract the 'inputs' data
    inputs = data.get("inputs", [])
    
    # Open a CSV file for writing
    with open(csv_file, 'w', newline='') as file:
        writer = csv.writer(file)
        
        # Write the header
        header = [
            "variable",
            "value",
            "units",
            "value_description",
            "variable_type",
            "confidence_in_number",
            "key_assumption",
            "source_url",
            "source_notes"
        ]
        writer.writerow(header)
        
        # Write each input as a row
        for input_item in inputs:
            writer.writerow([
                input_item.get("variable", ""),
                input_item.get("value", ""),
                input_item.get("units", ""),
                input_item.get("value_description", ""),
                input_item.get("variable_type", ""),
                input_item.get("confidence_in_number", ""),
                input_item.get("key_assumption", ""),
                input_item.get("source_url", ""),
                input_item.get("source_notes", "")
            ])
    
    print(f"Converted YAML to CSV: {csv_file}")

# Example usage
yaml_file_path = "../data/data.yaml"  # Path to your YAML file
csv_file_path = "../data/data.csv"   # Output CSV file path
yaml_to_csv(yaml_file_path, csv_file_path)
