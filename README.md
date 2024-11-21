# Data Napkin Math

Data Napkin Math is a lightweight web tool for making order-of-magnitude estimates about important "data value" questions. The goal of this tool is to help answer questions such as: How will the proceeds and other benefits of AI be distributed? It is designed to be interactive, allowing users to easily modify assumptions and explore different scenarios.

## Features
- **Simple Assumptions and Estimates**: Modify key input values to see how they impact various scenarios.
- **Interactive Web Page**: Built as a single-page app, this tool is easy to use without the need for installation.
- **Collaborative inputs**: Inputs are loaded from a YAML file in the project GitHub repository: you can suggest additions and changes via GitHub or Google Sheets.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) is required only if you want to run the test script or convert data formats.
- pyyaml is required to run `yaml2csv.py`.

### Installation
1. **Clone the Repository**:
   ```
   git clone https://github.com/nickmvincent/data-napkin-math.git
   cd data-napkin-math
   ```
2. **Install Dependencies** (optional, only if running scripts):
   ```
   npm install
   ```

### Running the Application
To run the application, simply open `index.html` in your browser. No server setup is required.

### Available Scripts
- **Run Tests**:
  ```
  node run validate.mjs
  ```
  This script tries to run all the most recent "scenarios".

- **Convert YAML to CSV**:
  ```
  python3 yaml2csv.py
  ```
  This script converts data from YAML to CSV format, so we can export data to the public Google Sheet.

## Directory Structure
- `data/`: Contains the data file (`data.yaml`) that is used for calculations, as well as a csv copy.
- `scripts/`: Two short scripts: yaml2csv and validation.
- `index.html`: The main HTML page that hosts the application.
- `style.css`: Styles for the application.
- `CONTRIBUTING.md`: Guidelines for contributing to the project.

## Usage
The web page loads default "input values" from a collaboratively edited YAML file. Each scenario is affected by these inputs, which the user can edit, enabling you to test different assumptions quickly. You can:

- **Edit Inputs Directly**: Modify input values via the form on the left sidebar.
- **Switch Between Related Variables**: Use the interface to swap inputs for related data (for instance, to swap out OpenAI's revenue for Anthropic's revenue as an input into some calculations).
- **See Calculation Details**: Expand each calculation to understand the underlying assumptions.

## Contributing
There are two ways to contribute to Data Napkin Math:

1. **Pull Requests via GitHub**: Edit the `data/data.yaml` file and submit your changes.
2. **Google Sheet Comments**: If you prefer, you can leave suggestions or feedback directly in our [public Google Sheet](#).

For detailed guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact
For questions or feedback, please create an issue on GitHub or contact us directly.

---

We appreciate any contributions and feedback to improve Data Napkin Math!

