/**
 * Markdown Data Loader for Data Napkin Math
 * 
 * This module parses markdown files containing input variables and calculation scenarios
 * and converts them to the format needed by the application.
 */

class MarkdownDataLoader {
    /**
     * Parse a collection of markdown files into input variables and scenarios
     * @param {string[]} markdownTexts - Array of markdown file contents
     * @returns {Object} - Object containing parsed inputs and scenarios
     */
    static parseMarkdownCollection(markdownTexts) {
      const result = {
        inputs: {},
        scenarios: []
      };
  
      // Process each markdown file
      markdownTexts.forEach(markdown => {
        const fileType = this.determineFileType(markdown);
        
        if (fileType === 'input') {
          const input = this.parseInputMarkdown(markdown);
          if (input && input.variable_name) {
            result.inputs[input.variable_name] = input;
          }
        } else if (fileType === 'scenario') {
          const scenario = this.parseScenarioMarkdown(markdown);
          if (scenario && scenario.title) {
            result.scenarios.push(scenario);
          }
        }
      });
  
      return result;
    }
  
    /**
     * Determine if a markdown file contains an input variable or a scenario
     * @param {string} markdown - Markdown content
     * @returns {string} - 'input' or 'scenario'
     */
    static determineFileType(markdown) {
      // Check for key fields that would indicate file type
      if (markdown.includes('variable_name:') && markdown.includes('variable_type:')) {
        return 'input';
      } else if (markdown.includes('input_variables:') && markdown.includes('calculation_type:')) {
        return 'scenario';
      }
      
      // Default to input if unclear
      return 'input';
    }
  
    /**
     * Parse markdown containing an input variable
     * @param {string} markdown - Markdown content
     * @returns {Object} - Parsed input variable
     */
    static parseInputMarkdown(markdown) {
      const frontMatter = this.extractFrontMatter(markdown);
      if (!frontMatter) return null;
  
      const input = {
        nice_name: frontMatter.title || '',
        value: parseFloat(frontMatter.value) || 0,
        scale: parseFloat(frontMatter.scale) || 1,
        display_units: frontMatter.display_units || '',
        variable: frontMatter.variable_name || '',
        variable_name: frontMatter.variable_name || '',
        variable_type: frontMatter.variable_type || '',
        entity: frontMatter.entity || '',
        units: frontMatter.units || '',
        source_url: frontMatter.source_url || '',
        key_assumption: this.extractBodyContent(markdown),
        source_notes: frontMatter.source_notes || '',
        phrase_for_card: frontMatter.phrase_for_card || '',
        tags: this.parseArrayField(frontMatter.tags),
        date_added: frontMatter.date_added || new Date().toISOString().split('T')[0]
      };
  
      // Ensure we have a default value stored
      input.default_value = input.value;
      
      return input;
    }
  
    /**
     * Parse markdown containing a calculation scenario
     * @param {string} markdown - Markdown content
     * @returns {Object} - Parsed scenario
     */
    static parseScenarioMarkdown(markdown) {
      const frontMatter = this.extractFrontMatter(markdown);
      if (!frontMatter) return null;
  
      // Parse operations from JSON string if available
      let operations = [];
      try {
        if (frontMatter.operations) {
          operations = JSON.parse(frontMatter.operations);
        }
      } catch (e) {
        console.error("Failed to parse operations JSON:", e);
      }
  
      const scenario = {
        title: frontMatter.title || '',
        description: frontMatter.description || '',
        inputs: this.parseArrayField(frontMatter.input_variables),
        calculateType: frontMatter.calculation_type || 'operations',
        operations: operations,
        result: {
          label: frontMatter.result_label || '',
          units: frontMatter.result_units || ''
        },
        category: frontMatter.category || 'General',
        diagram: frontMatter.diagram || '',
        body: this.extractBodyContent(markdown),
        tags: this.parseArrayField(frontMatter.tags),
        date_added: frontMatter.date_added || new Date().toISOString().split('T')[0]
      };
      
      return scenario;
    }
  
    /**
     * Extract front matter from markdown
     * @param {string} markdown - Markdown content
     * @returns {Object} - Parsed front matter as an object
     */
    static extractFrontMatter(markdown) {
      // Look for front matter between --- markers
      const fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
      const match = markdown.match(fmRegex);
      
      if (!match || !match[1]) {
        return {};
      }
  
      // Parse the front matter into key-value pairs
      const frontMatter = {};
      const lines = match[1].split('\n');
      
      lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1);
          }
          
          frontMatter[key] = value;
        }
      });
      
      return frontMatter;
    }
  
    /**
     * Extract the main body content (after front matter)
     * @param {string} markdown - Markdown content
     * @returns {string} - The body content
     */
    static extractBodyContent(markdown) {
      // Remove front matter and get the rest
      const withoutFM = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '').trim();
      return withoutFM;
    }
  
    /**
     * Parse array fields from front matter (comma-separated or YAML list)
     * @param {string} fieldValue - The field value to parse
     * @returns {string[]} - Parsed array
     */
    static parseArrayField(fieldValue) {
      if (!fieldValue) return [];
      
      // If it's already an array, return it
      if (Array.isArray(fieldValue)) return fieldValue;
      
      // Handle comma-separated lists
      if (typeof fieldValue === 'string') {
        // Check if it looks like a YAML list (starts with -)
        if (fieldValue.trim().startsWith('- ')) {
          return fieldValue.split('\n')
            .map(item => item.replace(/^-\s*/, '').trim())
            .filter(Boolean);
        }
        
        // Otherwise treat as comma-separated
        return fieldValue.split(',')
          .map(item => item.trim())
          .filter(Boolean);
      }
      
      return [];
    }
  
    /**
     * Fetch markdown files from a directory
     * @param {string} directory - Directory path
     * @returns {Promise<string[]>} - Array of markdown contents
     */
    static async fetchMarkdownFiles(directory) {
      try {
        const response = await fetch(`${directory}/index.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch index: ${response.status}`);
        }
        
        const index = await response.json();
        const files = index.files || [];
        
        // Fetch each file
        const markdownPromises = files.map(async file => {
          const fileResponse = await fetch(`${directory}/${file}`);
          if (!fileResponse.ok) {
            console.error(`Failed to fetch ${file}`);
            return null;
          }
          return await fileResponse.text();
        });
        
        const markdowns = await Promise.all(markdownPromises);
        return markdowns.filter(Boolean);
      } catch (e) {
        console.error("Error fetching markdown files:", e);
        return [];
      }
    }
  }
  
  // Export the class if in a module environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownDataLoader;
  }