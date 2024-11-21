import yaml
import csv

def yaml_to_md(yaml_file, md_file):
    # Load the YAML file
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
    
    # Extract the 'inputs' data
    inputs = data.get("inputs", [])
    
    # Open a Markdown file for writing
    with open(md_file, 'w') as file:
        file.write("# Inputs Data\n\n")
        
        # Write each input as a Markdown section
        for input_item in inputs:
            file.write(f"## {input_item.get('variable', 'Unnamed Variable')}\n\n")
            file.write(f"- **Value**: {input_item.get('value', 'N/A')}\n")
            file.write(f"- **Units**: {input_item.get('units', 'N/A')}\n")
            file.write(f"- **Description**: {input_item.get('value_description', 'N/A')}\n")
            file.write(f"- **Variable Type**: {input_item.get('variable_type', 'N/A')}\n")
            file.write(f"- **Confidence in Number**: {input_item.get('confidence_in_number', 'N/A')}\n")
            file.write(f"- **Key Assumption**: {input_item.get('key_assumption', 'N/A')}\n")
            file.write(f"- **Source URL**: {input_item.get('source_url', 'N/A')}\n")
            file.write(f"- **Source Notes**: {input_item.get('source_notes', 'N/A')}\n\n")
    
    print(f"Converted YAML to Markdown: {md_file}")

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
yaml_file_path = "data/data.yaml"  # Path to your YAML file
md_file_path = "data/data.md"   # Output Markdown file path
csv_file_path = "data/data.csv"   # Output CSV file path
yaml_to_md(yaml_file_path, md_file_path)
yaml_to_csv(yaml_file_path, csv_file_path)
