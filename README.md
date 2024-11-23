# Data Napkin Math

Data Napkin Math is a lightweight web tool and peer production project for making order-of-magnitude estimates about important "data value" questions. The goal of this tool is to help answer questions such as: How will the proceeds and other benefits of AI be distributed? It is designed to be interactive, allowing users to easily modify assumptions and explore different scenarios.

The tool itself consists of a small website. A key aspect of this project that makes the website useful is the collaboratively edited dataset of relevant inputs (estimates of dataset size, AI company revenue, wage, etc.) and scenarios ("what if we distribute profits from AI to everyone in the world?")

[Visit the site!](https://nickmvincent.github.io/data_napkin_math/)

## Usage
The web page loads default *inputs* from a collaboratively edited database (currently stored in this repo). Each *scenario* is affected by these inputs, which the user can edit, enabling you to test different assumptions quickly. You can:

- **Edit Inputs Directly**: Modify key input values to see how they impact various scenarios.
- **Switch Between Related Variables**: Use the interface to swap inputs for related data (for instance, to swap out OpenAI's revenue for Anthropic's revenue as an input into some calculations).
- **See Calculation Details**: Expand each calculation to understand the underlying assumptions.
- **Collaboratively produced**: Help us improve our inputs and scenarios! Inputs are loaded from a YAML file in the project GitHub repository: you can suggest additions and changes via GitHub or Google Sheets. (see below)

## Contributing
There are three ways to contribute to the inputs and scenarios presented in Data Napkin Math:

1. (Very low friction) **Note or Issue**: Just send us a note or open a GitHub issue with your thoughts.
2. (Low friction) **Google Sheet Comments**: If you prefer, you can leave suggestions or feedback directly in our [public Google Drive folder (comment link)](https://drive.google.com/drive/folders/1_UKI4KXKeItuDDCmOtxx8cgmoh3weui5?usp=sharing).
3 (More friction, but appreciated) **Pull Requests via GitHub**: Edit the `data/inputs.yaml` file and/or `calculations.js`, run `node test`, and then submit your changes as PR.


For detailed guidelines, see the [Contributor Guide](https://github.com/nickmvincent/data_napkin_math/wiki/Contributor-Guide) in the [Wiki](https://github.com/nickmvincent/data_napkin_math/wiki).

You are also more than welcome to contribute towards the development of the app. 

### Installation and Pre-reqs

To install the full repo:

```
git clone https://github.com/nickmvincent/data-napkin-math.git
cd data-napkin-math
```

There are currently no pre-requisites required to run the app (just open index.html),
but you will need either Node.js and Python to run tests.

Node:
- Install [Node.js](https://nodejs.org/)
- run `npm install` to install dependencies
- run `npm test` or `npm run test` to run tests. See `tests/` for more.

### Running the Application
To run the application, simply open `index.html` in your browser. No server setup is required. This may change in the future.

## How the inputs and scenarios are updated

Currently, the shared data underlying this app is handled in a lightweight manner: all inputs
and scenarios are loaded from `data/inputs.yaml` and `scenarios.js`. This may change in the future
(suggestions welcome!).

The current implementation requires manual approval to make changes:

- a maintainer merges PRs and incorporates comments from Google Drive and GitHub issues
- the maintainer runs `npm run export` to produce an updated files (found in the `export folder`) that can be shared via Google Drive.

## Directory Structure

Directories:
- `data/`: Contains the data file (`inputs.yaml`) with inputs.
- `docs/`: Details about contributing to the project and the data schema.
- `scripts/`: Scripts (currently just yaml2csv.py)
- `tests`/: validate input data and scenario calculations

Key files:
- `index.html`: The main HTML page that hosts the application.
- `style.css`: Styles for the application.



## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

