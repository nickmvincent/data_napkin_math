# Contributor Guide for Data Napkin Math

Thank you for your interest in contributing to Data Napkin Math! There are three main ways you can get involved and help improve this project: submitting pull requests via GitHub, opening an issue via GitHub, or leaving comments in a public Google Docs/Sheets (see README and the active site for the latest link).

## Option 1: Make Contributions via GitHub (Edit `data.yaml`)

If you are comfortable with Git and GitHub, you can contribute directly by editing the data file used by the web application. This will ensure your changes are reviewed, merged, and become part of the project history.

### Steps to Contribute via GitHub

1. **Fork the Repository**: Start by forking the project repository to your own GitHub account.
2. **Clone Your Fork**: Clone your fork to your local machine to make changes.
   ```
   git clone https://github.com/your-username/data-napkin-math.git
   ```
3. **Edit `data.yaml`**: The key data file is `data.yaml`. This file contains all of the input values and scenarios that are used in the project.
4. **Make Changes**: Modify the values in `data.yaml` as needed. You can adjust current figures, add new inputs, or update descriptions.
5. **Commit Your Changes**: Commit your changes locally with a clear commit message.
   ```
   git commit -am "Updated default values for training data"
   ```
6. run tests to verify the data schema is valid and the scenarios all "resolve" -- `npm test`
7. **Push and Create Pull Request**: Push your changes to your forked repository and create a pull request (PR) against the original repository.

## Option 2: Open a GitHub issue

If cloning the repo and submitting a PR seem a bit too high friction, you can also suggest changes via a GitHub issue. For now, provide as many details as possible. In the future, we may provide a required template for making changes via Issues.


## Option 3: Leave Comments in the Public Google Sheets and Docs

If you are less familiar with GitHub or prefer a simpler way to contribute, you can leave comments in our public Google Sheet. This is an easy way to provide feedback or suggest new data inputs without needing to handle code.

### Steps to Contribute via Google Drive

1. **Access the Public Google Sheet**: You can access a comment link to the Drive folder with inputs and calculations via the README file and the project page.
2. **Review Existing Data**: Look through the existing inputs and values.
3. **Leave Comments**: You can suggest changes or add information by adding comments directly to the relevant cells. Please be as specific as possible, indicating the exact changes you recommend and why.

Note: If you want to receive credit for your contributions, please include a username or identifier (e.g. a GitHub handle, a Twitter handle, etc.) 

### Guidelines for Google Sheet Comments

- **Clarity**: Make sure your comments are clear and easy to understand.
- **Context**: Include enough context about why you think the value or information should be changed.


## Naming Scheme for Variables

To ensure consistency and clarity across our dataset, we use a specific naming scheme for variables. Each variable name follows this format: description__specific_entity__unit. This format helps make the variable's purpose, the context, and the units of measurement clear at a glance. 

Here are some examples:

- total_tokens__llama3__tokens: Represents the total number of tokens used in the Llama3 dataset.- yearly_revenue__openai__dollars: Refers to the yearly revenue of OpenAI in dollars.
- average_tokens_per_contribution__redpajama__tokens_per_contribution: Represents the average number of tokens per contribution in the RedPajama dataset.

See DATASCHEMA.md in this directory for more information.

## Questions or Feedback?

If you have questions about contributing or if you need more information, feel free to reach out via the GitHub issues page. We appreciate all forms of contribution and feedback, and we're excited to collaborate with you!

Thank you for helping to make Data Napkin Math better!

