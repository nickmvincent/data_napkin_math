# Data Napkin Math

A readme created by Claude 3.7 sonnet as point of reference. To be used for comparison with the real README, which should be human curated.

An interactive web application for exploring "back-of-the-envelope" calculations and order-of-magnitude estimates related to data value in AI systems.

## Overview

This application allows users to:

- Explore various scenarios with different input variables
- Visualize how changes in input values affect calculation results
- Examine the sensitivity of results to specific variables
- Filter scenarios by category
- Inspect details about input variables including sources and assumptions

## Project Structure

```
data-napkin-math/
├── index.html              # Main HTML file
├── assets/
│   ├── css/                # CSS files
│   │   ├── main.css        # Main CSS file that imports all others
│   │   ├── components/     # Component-specific CSS
│   │   │   ├── card.css
│   │   │   ├── navbar.css
│   │   │   ├── sidebar.css
│   │   │   └── charts.css
│   │   └── layout.css      # Layout styles
│   └── images/             # Images and icons
├── data/
│   └── data.json           # Main data file generated from markdown sources
├── inputs/                 # Markdown input files for variables
│   └── *.md                # Individual variable definitions
├── scenarios/              # Markdown files for scenario definitions
│   └── *.md                # Individual scenario definitions
├── src/                    # TypeScript source files for build process
│   ├── buildSite.ts        # Main build script for generating data.json
│   └── types.ts            # TypeScript type definitions
├── js/
│   ├── main.js             # Main application entry point
│   ├── components/         # Vue components
│   │   ├── ScenarioCard.js
│   │   ├── InputPanel.js
│   │   ├── InspectorPanel.js
│   │   ├── SensitivityChart.js
│   │   └── CategorySelector.js
│   ├── services/           # Service modules
│   │   ├── DataService.js
│   │   └── CalculationService.js
│   └── utils/              # Utility functions
│       ├── formatters.js
│       ├── validators.js
│       └── chartHelpers.js
├── package.json            # Node.js dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the data file from markdown sources:

```bash
npm run build
```

4. Start the development server:

```bash
npm run serve
```

Then open your browser and navigate to `http://localhost:8000`

## Development

### Data Pipeline

This project uses a TypeScript build process to generate the `data.json` file from Markdown sources:

1. Markdown files in `inputs/` define individual input variables with metadata
2. Markdown files in `scenarios/` define calculation scenarios
3. The `src/buildSite.ts` script parses these files and generates `data/data.json`

To modify inputs or scenarios:

1. Edit or add Markdown files in the appropriate directory
2. Run `npm run build` to regenerate the data.json file
3. Refresh the page to see your changes

### Dependencies

This project uses:

- Vue.js 3 (loaded via CDN)
- Bootstrap 5 (loaded via CDN)
- Chart.js (loaded via CDN)
- Bootstrap Icons (loaded via CDN)
- TypeScript (for build process)
- Node.js utilities for Markdown parsing

### Data Format

The application data is stored in two formats:

1. **Source Markdown files**: Human-friendly format for editing
2. **Generated data.json**: Machine-friendly format for the application

#### Markdown Input Format

Input variables are defined in Markdown files in the `inputs/` directory:

```markdown
---
title: "Average words per token"
value: 0.75
scale: 1
display_units: "words per token"
variable_name: "training_detail__openai__words_per_token"
variable_type: "training_detail"
entity: "openai"
units: "words_per_token"
source_url: "https://platform.openai.com/tokenizer"
date_added: "2025-03-19T00:00:00.000Z"
tags:
  - "training_detail"
  - "openai"
  - "words_per_token"
---

# Average words per token

**Value:** 0.75 words per token

## Description

Average number of words per token

## Key Assumption

Average across random queries

## Source

- [https://platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)
- OpenAI Tokenizer
```

#### Markdown Scenario Format

Scenarios are defined in Markdown files in the `scenarios/` directory:

```markdown
---
title: "Distributing Money from Data Deals"
description: "If we distribute the payments from recent data deal (say, {deal_value__reddit_google__dollars}) to some group of people (say, {deal_group_size__reddit__daily_active_users}), how much will each person get?"
input_variables:
  - "deal_value__reddit_google__dollars"
  - "deal_group_size__reddit__daily_active_users"
calculation_type: "operations"
operations: "[{\"func\": \"divide\", \"args\": [\"{deal_value__reddit_google__dollars}\", \"{deal_group_size__reddit__daily_active_users}\"]}]"
result_label: "Per Person Revenue"
result_units: "dollars"
category: "Distributing money"
date_added: "2025-03-19T00:00:00.000Z"
tags:
  - "calculation"
  - "distributing-money"
---

# Distributing Money from Data Deals

## Description

If we distribute the payments from recent data deal (say, 60 millions of dollars) to some group of people (say, 267.50 millions of daily active users), how much will each person get?

## Inputs

- **Payment made to Reddit by Google**: 60 millions of dollars
- **Number of Reddit daily active users**: 267.50 millions of daily active users

## Calculation

- Divide: 60 millions of dollars ÷ 267.50 millions of daily active users

## Result

The Per Person Revenue is calculated in dollars.

## Category

Distributing money
```

#### Generated JSON Format

The TypeScript build process converts these Markdown files into a structured `data.json` file with two main sections:

1. `inputs`: Array of input variables with metadata
2. `scenarios`: Array of calculation scenarios that use the inputs

## Build Process

The TypeScript build process follows these steps:

1. Read all Markdown files from the `inputs/` and `scenarios/` directories
2. Parse frontmatter and content using appropriate libraries
3. Transform the parsed data into the format expected by the application
4. Write the generated data to `data/data.json`

To run the build process:

```bash
npm run build
```

## Features

- **Interactive Scenarios**: Change input values and see results update in real-time
- **Sensitivity Analysis**: Visualize how changes to specific inputs affect the results
- **Variable Inspection**: View details about variables including sources and assumptions
- **Categorical Filtering**: Filter scenarios by category
- **Responsive Design**: Works on desktop and mobile devices
- **Modular Architecture**: Clean separation of concerns for maintainability
- **Markdown-Based Data**: Easy editing of data in human-readable format
- **TypeScript Build Process**: Type-safe transformation of data with proper validation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

To contribute:

1. Fork the repository
2. Create a new branch for your feature
3. Add or edit Markdown files in the `inputs/` or `scenarios/` directories
4. Run `npm run build` to update the data.json file
5. Test your changes locally
6. Submit a Pull Request

## License

[MIT License](LICENSE)