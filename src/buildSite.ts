#!/usr/bin/env ts-node
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

interface InputVariable {
  title: string;
  value: number;
  scale: number;
  display_units: string;
  variable_name: string;
  variable_type: string;
  entity: string;
  units: string;
  source_url: string;
  date_added: string; // ISO string date
  tags: string[];
  content: string;
  relative_path: string;
}

interface ScenarioCalculation {
  title: string;
  description: string;
  input_variables: string[];
  calculation_type: string;
  operations: string;
  result_label: string;
  result_units: string;
  category: string;
  date_added: string; // ISO string date
  tags: string[];
  content: string;
  relative_path: string;
}

function readMarkdownFiles<T>(dir: string, type: 'input' | 'scenario'): T[] {
  let results: T[] = [];
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(readMarkdownFiles<T>(fullPath, type));
    } else if (entry.endsWith('.md')) {
      const rawContent = fs.readFileSync(fullPath, 'utf8');
      const parsed = matter(rawContent);
      const metadata = parsed.data;
      const content = parsed.content.trim();
      // Compute a relative path (relative to the directory where the file was found)
      const relative_path = path.relative(dir, fullPath);

      if (type === 'input') {
        const inputVar: InputVariable = {
          title: metadata.title || path.basename(entry, '.md'),
          value: typeof metadata.value === 'number' ? metadata.value : 0,
          scale: typeof metadata.scale === 'number' ? metadata.scale : 1,
          display_units: metadata.display_units || "",
          variable_name: metadata.variable_name || path.basename(entry, '.md'),
          variable_type: metadata.variable_type || "",
          entity: metadata.entity || "",
          units: metadata.units || "",
          source_url: metadata.source_url || "",
          date_added: metadata.date_added || new Date().toISOString(),
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          content,
          relative_path
        };
        results.push(inputVar as unknown as T);
      } else if (type === 'scenario') {
        const scenario: ScenarioCalculation = {
          title: metadata.title || path.basename(entry, '.md'),
          description: metadata.description || content,
          input_variables: Array.isArray(metadata.input_variables) ? metadata.input_variables : [],
          calculation_type: metadata.calculation_type || "",
          operations: metadata.operations || "",
          result_label: metadata.result_label || "",
          result_units: metadata.result_units || "",
          category: metadata.category || "",
          date_added: metadata.date_added || new Date().toISOString(),
          tags: Array.isArray(metadata.tags) ? metadata.tags : [],
          content,
          relative_path
        };
        results.push(scenario as unknown as T);
      }
    }
  }
  return results;
}

function main(): void {
  const baseDir = process.cwd();
  const inputsDir = path.join(baseDir, 'data', 'inputs');
  const scenariosDir = path.join(baseDir, 'data', 'scenarios');

  const inputs = readMarkdownFiles<InputVariable>(inputsDir, 'input');
  const scenarios = readMarkdownFiles<ScenarioCalculation>(scenariosDir, 'scenario');

  const output = {
    inputs,
    scenarios,
    schemas: [
      {
        name: "InputVariable",
        description: "A numerical input variable for data napkin math calculations",
        fields: {
          title: {
            type: "string",
            description: "Human-readable name of the variable"
          },
          value: {
            type: "number",
            description: "Raw numerical value"
          },
          scale: {
            type: "number",
            description: "Scaling factor for display (e.g., 1000000 for millions)"
          },
          display_units: {
            type: "string",
            description: "Units for display (e.g., 'millions of dollars')"
          },
          variable_name: {
            type: "string",
            description: "Machine-readable variable name"
          },
          variable_type: {
            type: "string",
            description: "Type of variable (dataset_size, yearly_revenue, etc.)"
          },
          entity: {
            type: "string",
            description: "Entity the variable is associated with"
          },
          units: {
            type: "string",
            description: "Units of measurement"
          },
          source_url: {
            type: "string",
            description: "URL of the source for this value"
          },
          date_added: {
            type: "date",
            description: "Date when this variable was added"
          },
          tags: {
            type: "array",
            description: "Tags for categorization"
          }
        },
        required: ["title", "value", "variable_name", "variable_type", "entity", "units"],
        subdirectory: "inputs"
      },
      {
        name: "ScenarioCalculation",
        description: "A calculation scenario using input variables",
        fields: {
          title: {
            type: "string",
            description: "Title of the calculation scenario"
          },
          description: {
            type: "string",
            description: "Description of what this calculation represents"
          },
          input_variables: {
            type: "array",
            description: "List of input variable names used in this calculation"
          },
          calculation_type: {
            type: "string",
            description: "Type of calculation (operations, formula, etc.)"
          },
          operations: {
            type: "string",
            description: "JSON string of operations to perform"
          },
          result_label: {
            type: "string",
            description: "Label for the calculation result"
          },
          result_units: {
            type: "string",
            description: "Units for the calculation result"
          },
          category: {
            type: "string",
            description: "Category of the calculation"
          },
          date_added: {
            type: "date",
            description: "Date when this scenario was added"
          },
          tags: {
            type: "array",
            description: "Tags for categorization"
          }
        },
        required: ["title", "description", "input_variables", "calculation_type"],
        subdirectory: "scenarios"
      }
    ]
  };

  const outputFile = path.join(baseDir, 'data/data.json');
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Build complete. Data written to ${outputFile}`);
}

main();
