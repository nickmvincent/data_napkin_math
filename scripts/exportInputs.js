// Import required modules
import fs from 'fs';
import yaml from 'js-yaml';
import { parse } from 'json2csv';

// Function to convert YAML to Markdown
function yamlToMd(yamlFile, mdFile, section) {
  // Load the YAML file
  const data = yaml.load(fs.readFileSync(yamlFile, 'utf8'));

  // Extract the specified section's data
  const sectionData = data[section] || [];

  // Create Markdown content
  let mdContent = `# ${section.charAt(0).toUpperCase() + section.slice(1)} Data\n\n`;

  if (section === 'inputs') {
    sectionData.forEach(item => {
      mdContent += `## ${item.variable || 'Unnamed Variable'}\n\n`;
      mdContent += `- **Value**: ${item.value || 'N/A'}\n`;
      mdContent += `- **Units**: ${item.units || 'N/A'}\n`;
      mdContent += `- **Description**: ${item.value_description || 'N/A'}\n`;
      mdContent += `- **Variable Type**: ${item.variable_type || 'N/A'}\n`;
      mdContent += `- **Key Assumption**: ${item.key_assumption || 'N/A'}\n`;
      mdContent += `- **Source URL**: ${item.source_url || 'N/A'}\n`;
      mdContent += `- **Source Notes**: ${item.source_notes || 'N/A'}\n\n`;
    });
  }

  // Write to the Markdown file
  fs.writeFileSync(mdFile, mdContent);
  console.log(`Converted YAML section '${section}' to Markdown: ${mdFile}`);
}

// Function to convert YAML to CSV
function yamlToCsv(yamlFile, csvFile, section) {
  // Load the YAML file
  const data = yaml.load(fs.readFileSync(yamlFile, 'utf8'));

  // Extract the specified section's data
  const sectionData = data[section] || [];

  if (section === 'inputs') {
    const fields = [
      "variable",
      "value",
      "units",
      "value_description",
      "variable_type",
      "confidence_in_number",
      "key_assumption",
      "source_url",
      "source_notes"
    ];

    // Convert JSON to CSV
    const csv = parse(sectionData, { fields });

    // Write to the CSV file
    fs.writeFileSync(csvFile, csv);
    console.log(`Converted YAML section '${section}' to CSV: ${csvFile}`);
  }
}

// Example usage
const yamlFilePath = "data/inputs.yaml"; // Path to your YAML file

// Output Markdown and CSV paths for 'inputs' section
const inputsMdFilePath = "export/inputs_report.md";
const inputsCsvFilePath = "export/inputs_report.csv";

yamlToMd(yamlFilePath, inputsMdFilePath, 'inputs');
yamlToCsv(yamlFilePath, inputsCsvFilePath, 'inputs');
