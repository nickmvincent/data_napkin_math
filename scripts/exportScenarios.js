// Import necessary modules
import fs from 'fs/promises';
import { Parser } from 'json2csv';
import { scenariosData } from '../scenarios.js';

// Function to export calculations to Markdown
async function exportToMarkdown(mdFilePath) {
    try {
        let markdownContent = '# Scenarios Report\n\n';
        scenariosData.forEach(calculation => {
            markdownContent += `## ${calculation.title}\n`;
            markdownContent += `**Description**: ${calculation.description}\n\n`;
            markdownContent += `**Inputs**: ${calculation.inputs.join(', ')}\n\n`;
            markdownContent += `**Calculation Script**: ${calculation.calculate.toString()}\n\n`;
            if (calculation.unitDetails) {
                markdownContent += `**Unit Details**: ${calculation.unitDetails}\n\n`;
            }
            markdownContent += `**Result Label**: ${calculation.result.label || 'N/A'}\n\n`;
            markdownContent += `**Result Units**: ${calculation.result.units || 'N/A'}\n\n`;
        });

        await fs.writeFile(mdFilePath, markdownContent);
        console.log(`Markdown export successful: ${mdFilePath}`);
    } catch (error) {
        console.error('Error exporting to Markdown:', error);
    }
}

// Function to export calculations to CSV
async function exportToCSV(csvFilePath) {
    try {
        const csvData = scenariosData.map(calculation => {
            return {
                title: calculation.title,
                description: calculation.description,
                inputs: calculation.inputs.join(', '),
                calculation_script: calculation.calculate.toString(),
                unit_details: calculation.unitDetails || 'N/A',
                result_label: calculation.result.label || 'N/A',
                result_units: calculation.result.units || 'N/A'
            };
        });

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(csvData);

        await fs.writeFile(csvFilePath, csv);
        console.log(`CSV export successful: ${csvFilePath}`);
    } catch (error) {
        console.error('Error exporting to CSV:', error);
    }
}

// Example usage
const mdFilePath = 'export/scenarios_report.md';
const csvFilePath = 'export/scenarios_report.csv';

exportToMarkdown(mdFilePath);
exportToCSV(csvFilePath);
