#!/usr/bin/env python3
import os
import json

def read_markdown_files(root_dir):
    results = []
    # Recursively walk through the directory.
    for subdir, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(subdir, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                # Use file name (without extension) as the variable identifier.
                variable = os.path.splitext(file)[0]
                results.append({
                    "variable": variable,
                    "content": content,
                    # Optionally include the relative path for additional context.
                    "relative_path": os.path.relpath(file_path, root_dir)
                })
    return results

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    inputs_dir = os.path.join(base_dir, '../data', 'inputs')
    scenarios_dir = os.path.join(base_dir, '../data', 'scenarios')

    print('looking in', inputs_dir, scenarios_dir)
    
    # Read all markdown files from inputs and scenarios.
    inputs = read_markdown_files(inputs_dir)
    scenarios = read_markdown_files(scenarios_dir)
    
    # Combine into a single JSON object.
    output = {
      "inputs": inputs,
      "scenarios": scenarios
    }
    
    output_file = os.path.join(base_dir, '../data/data.json')
    with open(output_file, 'w', encoding='utf-8') as out:
        json.dump(output, out, indent=2)
    print(f"Build complete. Data written to {output_file}")

if __name__ == "__main__":
    main()
