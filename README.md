# Data Napkin Math

Data Napkin Math is a lightweight web tool for making order-of-magnitude estimates about important "data value" questions. The goal of this tool is to help answer questions such as: How will the proceeds and other benefits of AI be distributed? It is designed to be interactive, allowing users to easily modify assumptions and explore different scenarios.

## Usage
The web page loads default "input values" from a collaboratively edited YAML file. Each scenario is affected by these inputs, which the user can edit, enabling you to test different assumptions quickly. You can:

- **Edit Inputs Directly**: Modify key input values to see how they impact various scenarios.
- **Switch Between Related Variables**: Use the interface to swap inputs for related data (for instance, to swap out OpenAI's revenue for Anthropic's revenue as an input into some calculations).
- **See Calculation Details**: Expand each calculation to understand the underlying assumptions.
- **Collaboratively produced**: Help us improve our inputs and scenarios! Inputs are loaded from a YAML file in the project GitHub repository: you can suggest additions and changes via GitHub or Google Sheets. (see below)

## Contributing
There are three ways to contribute to Data Napkin Math:

1. **Pull Requests via GitHub**: Edit the `data/data.yaml` file and submit your changes.
2. **Google Sheet Comments**: If you prefer, you can leave suggestions or feedback directly in our [public Google Drive folder (comment link)](https://drive.google.com/drive/folders/1_UKI4KXKeItuDDCmOtxx8cgmoh3weui5?usp=sharing).
3. Just send us a note or open a GitHub issue with your thoughts.

For detailed guidelines, see [CONTRIBUTING.md](./docs/CONTRIBUTING.md).


### Installation and Pre-reqs

To install the full repo:

```
git clone https://github.com/nickmvincent/data-napkin-math.git
cd data-napkin-math
```

There are currently no pre-requisites required to run the app (just open index.html),
but you will need either Node.js or Python to run tests (suggested after editing data.yaml).

- [Node.js](https://nodejs.org/) to run tests (`js-yaml`, `node-fetch`, `yargs`)
- `npm install` to install dependencies, `npm test` to run tests. See `tests` for more.
- You can also run tests using Python, which requires `pyyaml` and `requests`.
- To convert `data.yaml` to `data.csv` using `scripts/yaml2csv.py`, only `pyyaml` is needed.


### Running the Application
To run the application, simply open `index.html` in your browser. No server setup is required. This may change in the future.

### Updating the centralized databaes

Currently, the shared data underlying this app is handled in a lightweight manner: all inputs
and scenarios are loaded from `data.yaml` (currently stored in a Gist). This may change in the future
(suggestions welcome!).

The current implementation requires manual approval:

- a maintainer merges PRs and incorporates comments from Google sheets
- the maintainer updates the gist (or points web app directly to the `data` folder on main branch)
- the maintainer runs `python yaml2csv.py` to produce an updated CSV file that will be imported to Google sheets

## Directory Structure

Directories:
- `data/`: Contains the data file (`data.yaml`) that is used for calculations, as well as a csv copy.
- `docs/`: Details about contributing to the project and the data schema.
- `scripts/`: Scripts (currently just yaml2csv.py)
- `tests`/: validate input data and scenario calculations

Key files:
- `index.html`: The main HTML page that hosts the application.
- `style.css`: Styles for the application.



## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

