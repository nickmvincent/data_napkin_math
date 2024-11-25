# Data Napkin Math

Data Napkin Math is a lightweight web tool and peer production project for making order-of-magnitude estimates about important "data value" questions. The goal of this tool is to help answer questions such as: How will the proceeds and other benefits of AI be distributed? It is designed to be interactive, allowing users to easily modify assumptions and explore different scenarios.

The tool itself currently exists as a small static website. A key goal of the broader project is to maintain a collaboratively edited dataset of relevant **inputs** (estimates of dataset size, AI company revenue, wages for data creation, etc.) and **scenarios** ("what if we distribute profits from AI to everyone in the world?", "How much would it cost to generate a brand new pre-training dataset?", etc.).

[Visit the site!](https://nickmvincent.github.io/data_napkin_math/)

## Usage
The web page loads default **inputs** from a collaboratively edited database (currently stored in this repo in `data/inputs.yaml` and available for reading and comments via Google Docs and Google Sheets). Each **scenario** is affected by these inputs, and people using the webpage can edit each input, enabling them to test different assumptions quickly. Users can:

- **Edit Inputs Directly**: Modify key input values to see how they impact various scenarios (e.g., "What if AI company revenue were to change?").
- **Switch Between Related Variables**: Use the interface to swap one default input for a related real-world value (for instance, to swap out OpenAI's revenue for Anthropic's revenue as an input into some calculation, or swap out the size of one popular pre-training dataset for a different dataset).
- **See Calculation Details**: Examine each calculation to understand the underlying assumptions.
- **Contribute to collaborative "peer production"**: Help us improve our inputs and scenarios! In the spirit of Wikipedia and open-source software, we want anyone to be able to contriubte data or debate and contest certain assumptions. The inputs for the website are loaded from a YAML file in the project GitHub repository: you can suggest additions and changes via GitHub or Google Drive.

## Contributing
There are three ways to contribute to the data and assumptions underlying the Data Napkin Math Project. We present them in order of how much "friction" is involved for a given kind of contribution.

1. (Very low friction) **Note or Issue**: Just send us a note (email, social media DM, etc. -- as of Nov 25, 2024, the best person to contact is [Nick Vincent](https://bsky.app/profile/nickmvincent.bsky.social)) or open a GitHub [Issue](https://github.com/nickmvincent/data_napkin_math/issues) with your thoughts.
2. (Low friction) **Google Drive Comments**: If you prefer, you can leave suggestions or feedback directly in our [public Google Drive folder (comment link)](https://drive.google.com/drive/folders/1_UKI4KXKeItuDDCmOtxx8cgmoh3weui5?usp=sharing). At this link, you can find copies of the inputs and scenarios in both CSV (Google Sheet) and Markdown (Google Doc) format. Take your pick of what feels easier to leave comments in!
3. (The most friction, but greatly appreciated) **Pull Requests via GitHub**: Edit the `data/inputs.yaml` file and/or `./scenarios.js`, run `node test` to validate that your edits meet the schema requirements and that you calculations are runnable, and then submit your changes as Pull Request.


For detailed guidelines, see the [Contributor Guide](https://github.com/nickmvincent/data_napkin_math/wiki/Contributor-Guide) in the [Wiki](https://github.com/nickmvincent/data_napkin_math/wiki).

You are also more than welcome to contribute towards the front-end and back-end development of the app. See our open issues for ideas, or bring your own!

## How the inputs and scenarios are updated

Currently, the shared data underlying this app is handled in a lightweight manner: all inputs
and scenarios are loaded from `data/inputs.yaml` and `scenarios.js`. This may change in the future
(suggestions welcome!).

The current implementation requires manual approval to make changes:

- a maintainer merges PRs and incorporates comments from Google Drive and GitHub issues
- the maintainer runs `npm run export` to produce an updated files (found in the `export folder`) that can be shared via Google Drive.


## For developers: Installation and Pre-reqs

To install the full repo:

```
git clone https://github.com/nickmvincent/data-napkin-math.git
cd data-napkin-math
```

There are currently no pre-requisites required to run the app: the current version is a static site that loads Vue, Boostrap, and js-yaml via CDN; just open `index.html. No server setup is required. This may change in the future.

However, you will need Node.js to run tests and to export the .yaml inputs and .js calculations to .csv and .md.

Node:
- Install [Node.js](https://nodejs.org/)
- run `npm install` to install dependencies
- run `npm test` or `npm run test` to run tests. See `tests/` for more.
- run `npm run export` to export .yaml input and .js calculations to csv and md.

## Directory Structure

Directories:
- `data/`: Contains the data file (`inputs.yaml`) with inputs.
- `exports/`: Contains inputs and and scenarios in CSV and Markdown format. Automatically populated via `node run export`.
- `scripts/`: Contains scripts (export inputs and scenarios).
- `tests`/: validate input and scenario data (check that inputs meet certain requirement and check that calculations are runnable).

Key files:
- `index.html`: The main HTML page that hosts the application.
- `scenarios.js`: A Javascript file with all the scenario calculations.
- `style.css`: Styles for the application.

Config files:
- .python-version (for uv)
- package.json (for node)
- pyproject.toml (for uv)
- uv.lock


## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

