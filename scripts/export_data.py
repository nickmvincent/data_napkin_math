import yaml
import csv

def yaml_to_md(yaml_file, md_file, section):
    # Load the YAML file
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
    
    # Extract the specified section's data
    section_data = data.get(section, [])
    
    # Open a Markdown file for writing
    with open(md_file, 'w') as file:
        file.write(f"# {section.capitalize()} Data\n\n")
        
        # Write each item as a Markdown section
        if section == 'inputs':
            for item in section_data:
                file.write(f"## {item.get('variable', 'Unnamed Variable')}\n\n")
                file.write(f"- **Value**: {item.get('value', 'N/A')}\n")
                file.write(f"- **Units**: {item.get('units', 'N/A')}\n")
                file.write(f"- **Description**: {item.get('value_description', 'N/A')}\n")
                file.write(f"- **Variable Type**: {item.get('variable_type', 'N/A')}\n")
                file.write(f"- **Confidence in Number**: {item.get('confidence_in_number', 'N/A')}\n")
                file.write(f"- **Key Assumption**: {item.get('key_assumption', 'N/A')}\n")
                file.write(f"- **Source URL**: {item.get('source_url', 'N/A')}\n")
                file.write(f"- **Source Notes**: {item.get('source_notes', 'N/A')}\n\n")
        elif section == 'calculations':
            for item in section_data:
                file.write(f"## {item.get('title', 'Unnamed Calculation')}\n\n")
                file.write(f"- **Description**: {item.get('description', 'N/A')}\n")
                file.write(f"- **Inputs**: {', '.join(item.get('inputs', []))}\n")
                result = item.get('result', {})
                file.write(f"- **Result Label**: {result.get('label', 'N/A')}\n")
                file.write(f"- **Units**: {result.get('units', 'N/A')}\n")
                file.write(f"- **Value**: {result.get('value', 'N/A')}\n")
                file.write(f"- **Explanation**: {item.get('explanation', 'N/A')}\n\n")
    
    print(f"Converted YAML section '{section}' to Markdown: {md_file}")

def yaml_to_csv(yaml_file, csv_file, section):
    # Load the YAML file
    with open(yaml_file, 'r') as file:
        data = yaml.safe_load(file)
    
    # Extract the specified section's data
    section_data = data.get(section, [])
    
    # Open a CSV file for writing
    with open(csv_file, 'w', newline='') as file:
        writer = csv.writer(file)
        
        # Write the header
        if section == 'inputs':
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
            
            # Write each item as a row
            for item in section_data:
                writer.writerow([
                    item.get("variable", ""),
                    item.get("value", ""),
                    item.get("units", ""),
                    item.get("value_description", ""),
                    item.get("variable_type", ""),
                    item.get("confidence_in_number", ""),
                    item.get("key_assumption", ""),
                    item.get("source_url", ""),
                    item.get("source_notes", "")
                ])
        elif section == 'calculations':
            header = [
                "title",
                "description",
                "inputs",
                "result_label",
                "result_units",
                "result_value",
                "explanation"
            ]
            writer.writerow(header)
            
            # Write each item as a row
            for item in section_data:
                result = item.get('result', {})
                writer.writerow([
                    item.get("title", ""),
                    item.get("description", ""),
                    ", ".join(item.get("inputs", [])),
                    result.get("label", ""),
                    result.get("units", ""),
                    result.get("value", ""),
                    item.get("explanation", "")
                ])
    
    print(f"Converted YAML section '{section}' to CSV: {csv_file}")

# Example usage
yaml_file_path = "data/data.yaml"  # Path to your YAML file

# Output Markdown and CSV paths for 'inputs' section
inputs_md_file_path = "data/inputs.md"
inputs_csv_file_path = "data/inputs.csv"

# Output Markdown and CSV paths for 'calculations' section
calculations_md_file_path = "data/calculations.md"
calculations_csv_file_path = "data/calculations.csv"

yaml_to_md(yaml_file_path, inputs_md_file_path, 'inputs')
yaml_to_csv(yaml_file_path, inputs_csv_file_path, 'inputs')

yaml_to_md(yaml_file_path, calculations_md_file_path, 'calculations')
yaml_to_csv(yaml_file_path, calculations_csv_file_path, 'calculations')
