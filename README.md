# Data Napkin Math

Data Napkin Math is a lightweight web tool and peer production project for making order-of-magnitude estimates about important "data value" questions. The goal of this tool is to help answer questions such as: How will the proceeds and other benefits of AI be distributed? It is designed to be interactive, allowing users to easily modify assumptions and explore different scenarios.

The tool itself currently exists as a small static website. A key goal of the broader project is to maintain a collaboratively edited dataset of relevant **inputs** (estimates of dataset size, AI company revenue, wages for data creation, etc.) and **scenarios** ("what if we distribute profits from AI to everyone in the world?", "How much would it cost to generate a brand new pre-training dataset?", etc.).

[Visit the site!](https://nickmvincent.github.io/data_napkin_math/)

## Usage
The web page loads default **inputs** from a collaboratively edited database.

- **Edit Inputs Directly**: Modify key input values to see how they impact various scenarios (e.g., "What if AI company revenue were to change?").
- **Switch Between Related Variables**: Use the interface to swap one default input for a related real-world value (for instance, to swap out OpenAI's revenue for Anthropic's revenue as an input into some calculation, or swap out the size of one popular pre-training dataset for a different dataset).
- **See Calculation Details**: Examine each calculation to understand the underlying assumptions.
- **Contribute to collaborative "peer production"**: Help us improve our inputs and scenarios! In the spirit of Wikipedia and open-source software, we want anyone to be able to contriubte data or debate and contest certain assumptions. The inputs for the website are loaded from a YAML file in the project GitHub repository: you can suggest additions and changes via GitHub or Google Drive.

## Contributing
There are three ways to contribute to the data and assumptions underlying the Data Napkin Math Project

1. Google Form: Submit suggestions via a Google form [here](https://forms.gle/5AB1gK99fdbSFeMx7).
2. Open a GitHub Issue [here](https://github.com/nickmvincent/data_napkin_math/issues) with your thoughts.
2.  **Pull Requests via GitHub**: Edit or add files to the `data` directory run `node src/buildSite.ts` to validate that your edits meet the schema requirements and that you calculations are runnable, and then submit your changes as Pull Request.

For detailed guidelines, see the [Contributor Guide](https://github.com/nickmvincent/data_napkin_math/wiki/Contributor-Guide) in the [Wiki](https://github.com/nickmvincent/data_napkin_math/wiki).
