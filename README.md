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
There are three ways to contribute to the data and assumptions underlying the Data Napkin Math Project. We present them in order of how much "friction" is involved for a given kind of contribution.

1. (Very low friction) **Note or Issue**: Just send us a note (email, social media DM, etc. -- as of Nov 25, 2024, the best person to contact is [Nick Vincent](https://bsky.app/profile/nickmvincent.bsky.social)) or open a GitHub [Issue](https://github.com/nickmvincent/data_napkin_math/issues) with your thoughts.
2. (Low friction) **Google Drive Comments**: If you prefer, you can leave suggestions or feedback directly in our [public Google Drive folder (comment link)](https://drive.google.com/drive/folders/1_UKI4KXKeItuDDCmOtxx8cgmoh3weui5?usp=sharing). At this link, you can find copies of the inputs and scenarios in both CSV (Google Sheet) and Markdown (Google Doc) format. Take your pick of what feels easier to leave comments in!
3. (The most friction, but greatly appreciated) **Pull Requests via GitHub**: Edit the `data/inputs.yaml` file and/or `./scenarios.js`, run `node test` to validate that your edits meet the schema requirements and that you calculations are runnable, and then submit your changes as Pull Request.


For detailed guidelines, see the [Contributor Guide](https://github.com/nickmvincent/data_napkin_math/wiki/Contributor-Guide) in the [Wiki](https://github.com/nickmvincent/data_napkin_math/wiki).
