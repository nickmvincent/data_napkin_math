import marimo

__generated_with = "0.11.22"
app = marimo.App(width="full")


@app.cell
def __imports():
    import marimo as mo
    import os
    import json
    import yaml
    import re
    import pandas as pd
    import math
    from datetime import datetime
    from pathlib import Path
    return Path, datetime, json, math, mo, os, pd, re, yaml


@app.cell
def _(os):
    # Configuration
    DATA_DIR = "."
    INPUTS_DIR = os.path.join(DATA_DIR, "inputs")
    SCENARIOS_DIR = os.path.join(DATA_DIR, "scenarios")

    # Theme colors
    THEME = {
        "primary": "#10a37f",
        "secondary": "#6c757d",
        "success": "#198754",
        "danger": "#dc3545",
        "warning": "#ffc107",
        "info": "#0dcaf0",
        "light": "#f8f9fa",
        "dark": "#212529",
    }
    return DATA_DIR, INPUTS_DIR, SCENARIOS_DIR, THEME


@app.cell
def _(datetime, json, re, yaml):
    # Parse markdown with front matter
    def parse_markdown(content):
        if not content:
            return {'front_matter': {}, 'content': ""}
    
        front_matter_pattern = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)
        match = front_matter_pattern.match(content)
    
        if match:
            front_matter_text = match.group(1)
            try:
                front_matter = yaml.safe_load(front_matter_text)
                # Ensure front_matter is a dictionary
                if front_matter is None:
                    front_matter = {}
            except yaml.YAMLError:
                front_matter = {}
            
            content_text = content[match.end():].strip()
            return {'front_matter': front_matter, 'content': content_text}
    
        return {'front_matter': {}, 'content': content}

    # Load index.json file
    def load_index(file_path):
        try:
            with open(file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # Create a default structure if file doesn't exist or is invalid
            return {'files': [], 'categories': {}, 'last_updated': datetime.now().strftime("%Y-%m-%d")}

    # Load file content
    def load_file_content(file_path):
        try:
            with open(file_path, 'r') as f:
                return f.read()
        except FileNotFoundError:
            return ""
    return load_file_content, load_index, parse_markdown


@app.cell
def _(load_file_content, load_index, os, parse_markdown):
    # Format number for display
    def format_number(number, precision=2):
        if number is None:
            return "N/A"
    
        if abs(number) >= 1e12:
            return f"{number/1e12:.{precision}f} trillion"
        elif abs(number) >= 1e9:
            return f"{number/1e9:.{precision}f} billion"
        elif abs(number) >= 1e6:
            return f"{number/1e6:.{precision}f} million"
        elif abs(number) >= 1e3:
            return f"{number/1e3:.{precision}f} thousand"
        else:
            return f"{number:.{precision}f}"

    # Load all inputs
    def load_all_inputs(inputs_dir):
        inputs = {}
    
        # Load index file
        index_path = os.path.join(inputs_dir, 'index.json')
        index = load_index(index_path)
    
        # Load files from top level
        for filename in index.get('files', []):
            file_path = os.path.join(inputs_dir, filename)
            content = load_file_content(file_path)
            parsed = parse_markdown(content)
        
            # Get the input variable
            front_matter = parsed['front_matter']
            if 'variable_name' in front_matter:
                var_name = front_matter['variable_name']
                inputs[var_name] = front_matter
                inputs[var_name]['content'] = parsed['content']
                inputs[var_name]['category'] = ''
                inputs[var_name]['path'] = file_path
    
        # Load files from categories
        for category, files in index.get('categories', {}).items():
            for filename in files:
                file_path = os.path.join(inputs_dir, category, filename)
                content = load_file_content(file_path)
                parsed = parse_markdown(content)
            
                # Get the input variable
                front_matter = parsed['front_matter']
                if 'variable_name' in front_matter:
                    var_name = front_matter['variable_name']
                    inputs[var_name] = front_matter
                    inputs[var_name]['content'] = parsed['content']
                    inputs[var_name]['category'] = category
                    inputs[var_name]['path'] = file_path
    
        return inputs

    # Load all scenarios
    def load_all_scenarios(scenarios_dir):
        scenarios = []
    
        # Load index file
        index_path = os.path.join(scenarios_dir, 'index.json')
        index = load_index(index_path)
    
        # Load files from top level
        for filename in index.get('files', []):
            file_path = os.path.join(scenarios_dir, filename)
            content = load_file_content(file_path)
            parsed = parse_markdown(content)
        
            # Get the scenario
            front_matter = parsed['front_matter']
            scenario = front_matter.copy()
            scenario['content'] = parsed['content']
            scenario['category'] = scenario.get('category', '')
            scenario['path'] = file_path
            scenario['filename'] = filename
        
            scenarios.append(scenario)
    
        # Load files from categories
        for category, files in index.get('categories', {}).items():
            for filename in files:
                file_path = os.path.join(scenarios_dir, category, filename)
                content = load_file_content(file_path)
                parsed = parse_markdown(content)
            
                # Get the scenario
                front_matter = parsed['front_matter']
                scenario = front_matter.copy()
                scenario['content'] = parsed['content']
                scenario['category'] = scenario.get('category', category)
                scenario['path'] = file_path
                scenario['filename'] = filename
            
                scenarios.append(scenario)
    
        return scenarios
    return format_number, load_all_inputs, load_all_scenarios


@app.cell
def _(json, math, re):
    # Calculate result based on operation
    def calculate_result(operations, input_values):
        if not operations:
            return None
    
        try:
            # Parse operations JSON if it's a string
            if isinstance(operations, str):
                operations = json.loads(operations)
        
            # Process each operation in sequence
            result = None
        
            for op in operations:
                func = op.get('func')
                args = op.get('args', [])
            
                # Resolve arguments (variables or literals)
                resolved_args = []
                for arg in args:
                    if arg == 'result':
                        resolved_args.append(result)
                    elif isinstance(arg, str) and arg.startswith('{') and arg.endswith('}'):
                        # Variable reference
                        var_name = arg[1:-1]
                        if var_name in input_values:
                            resolved_args.append(input_values[var_name])
                        else:
                            resolved_args.append(0)  # Default if not found
                    else:
                        # Literal value
                        resolved_args.append(arg)
            
                # Execute the operation
                if func == 'add':
                    result = resolved_args[0] + resolved_args[1]
                elif func == 'subtract':
                    result = resolved_args[0] - resolved_args[1]
                elif func == 'multiply':
                    result = resolved_args[0] * resolved_args[1]
                elif func == 'divide':
                    if resolved_args[1] == 0:
                        result = 0  # Avoid division by zero
                    else:
                        result = resolved_args[0] / resolved_args[1]
                elif func == 'power':
                    result = math.pow(resolved_args[0], resolved_args[1])
                elif func == 'sqrt':
                    result = math.sqrt(resolved_args[0])
                elif func == 'percent':
                    result = (resolved_args[0] * resolved_args[1]) / 100
                elif func == 'percentOf':
                    if resolved_args[1] == 0:
                        result = 0  # Avoid division by zero
                    else:
                        result = (resolved_args[0] / resolved_args[1]) * 100
                else:
                    # Unknown operation
                    pass
            
                # If operation has a name, store as a variable
                if 'name' in op:
                    input_values[op['name']] = result
        
            return result
    
        except Exception as e:
            print(f"Error calculating result: {e}")
            return None

    # Get unique categories from scenarios
    def get_unique_categories(scenarios):
        categories = set()
        for scenario in scenarios:
            if scenario['category']:
                categories.add(scenario['category'])
        return sorted(list(categories))

    # Get input variables by type
    def get_inputs_by_type(inputs):
        by_type = {}
        for var_name, var_data in inputs.items():
            var_type = var_data.get('variable_type', 'unknown')
            if var_type not in by_type:
                by_type[var_type] = []
            by_type[var_type].append(var_data)
        return by_type

    # Replace placeholders in text with variable references
    def replace_placeholders(text, input_values):
        if not text:
            return text
    
        # Find all placeholders in the form {variable_name}
        pattern = r'\{([^\}]+)\}'
    
        def replace_match(match):
            var_name = match.group(1)
            if var_name in input_values:
                var_data = input_values[var_name]
                # Use phrase_for_card if available, otherwise use nice_name or variable_name
                return var_data.get('phrase_for_card', var_data.get('nice_name', var_name))
            return match.group(0)  # Return unchanged if variable not found
    
        return re.sub(pattern, replace_match, text)
    return (
        calculate_result,
        get_inputs_by_type,
        get_unique_categories,
        replace_placeholders,
    )


@app.cell
def _(
    INPUTS_DIR,
    SCENARIOS_DIR,
    get_inputs_by_type,
    get_unique_categories,
    load_all_inputs,
    load_all_scenarios,
    mo,
):
    # Load all input variables
    inputs = load_all_inputs(INPUTS_DIR)

    # Load all scenarios
    scenarios = load_all_scenarios(SCENARIOS_DIR)

    # Create a mapping of variable names to values for calculations
    input_values = {}
    for var_name, var_data in inputs.items():
        if 'value' in var_data:
            try:
                input_values[var_name] = float(var_data['value'])
            except (ValueError, TypeError):
                input_values[var_name] = 0

    # Get unique categories for the filter
    categories = ["All"] + get_unique_categories(scenarios)


    # Organize inputs by type for dropdowns
    inputs_by_type = get_inputs_by_type(inputs)

    # Active input values that can be modified by the UI
    active_input_values = mo.state(input_values)
    return (
        active_input_values,
        categories,
        input_values,
        inputs,
        inputs_by_type,
        scenarios,
        var_data,
        var_name,
    )


@app.cell
def _(categories, mo):
    category_selector = mo.ui.dropdown(
        options=categories,
        value="All",
        label="Category"
    )

    # Header
    header = mo.vstack([
        mo.hstack([
            mo.md("# Data Napkin Math"),
            category_selector
        ], align="center"),
        mo.md("Napkin math, back-of-the-envelope estimates, and ballpark figures for important data value questions.")
    ])
    mo.md(f"{header}")
    return category_selector, header


@app.cell
def _():
    return


if __name__ == "__main__":
    app.run()
