export const scenariosData = [
    {
        title: "Distributing AI Company Revenue Broadly",
        description: "If we distribute AI revenue (say, {yearly_revenue__openai__dollars}) to some group of people (say, {group_size__world__people}), how much will each person get?",
        inputs: ["yearly_revenue__openai__dollars", "group_size__world__people"],
        calculate: (yearlyRevenue, population) => yearlyRevenue / population,
        unitDetails: "dollars / people",
        result: {
            label: "Per Person Revenue",
            units: "dollars"
        },
        category: "Distributing money"
    },
    {
        title: "Distributing Money from Data Deals",
        description: "If we distribute the payments from recent data deal (say, {deal_value__reddit_google__dollars}) to some group of people (say, {deal_group_size__reddit__daily_active_users}), how much will each person get?",
        inputs: ["deal_value__reddit_google__dollars", "deal_group_size__reddit__daily_active_users"],
        calculate: (dealValue, dailyActiveUsers) => dealValue / dailyActiveUsers,
        unitDetails: "dollars / people",
        result: {
            label: "Per Person Revenue",
            units: "dollars"
        },
        category: "Distributing money"
    },
    {
        title: "Commissioning New Datasets",
        description: "How much would it cost to pay for a brand new LLM-scale pre-training dataset (say, {dataset_size__llama3__tokens}) assuming moderate freelance writing wages (say, {wage_data__generic_freelance_higher__dollars_per_word})?",
        inputs: ["dataset_size__llama3__tokens", "training_detail__openai__words_per_token", "wage_data__generic_freelance_higher__dollars_per_word"],
        calculate: (tokens, wordsPerToken, freelanceRate) => tokens * wordsPerToken * freelanceRate,
        result: {
            label: "Dataset Cost",
            units: "dollars",
        },
        category: "Paying for new labour"
    },
    {
        title: "Producing an expert evaluation set",
        description: "How much would it cost to pay for an eval dataset (say, {dataset_size__hle__questions}) assuming moderate expert hourly wages (say, {wage_data__phd__dollars_per_question})?",
        inputs: ["dataset_size__hle__questions", "wage_data__phd__dollars_per_question"],
        calculate: (questions, rate) => questions * rate,
        result: {
            label: "Dataset Cost",
            units: "dollars",
        },
        category: "Paying for new labour"
    },

    // {
    //     title: "Commissioning dataset components",
    //     description: "How much would it cost to pay for a major components of traininng (say, {dataset_size__llama3__tokens}) assuming moderate freelance writing wages (say, {wage_data__generic_freelance_higher__dollars_per_word})?",
    //     inputs: ["dataset_size__llama3__tokens", "training_detail__openai__words_per_token", "wage_data__generic_freelance_higher__dollars_per_word"],
    //     calculate: (tokens, wordsPerToken, freelanceRate) => tokens * wordsPerToken * freelanceRate,
    //     result: {
    //         label: "Dataset Cost",
    //         units: "dollars",
    //     },
    //     category: "Paying for new labour"
    // },
    
    {
        title: "Freelance Cost Per Book",
        description: "Calculate the cost of commissioning a book based on freelance rates.",
        inputs: ["average_length__book__words", "wage_data__generic_freelance_lower__dollars_per_word"],
        calculate: (wordsPerBook, freelanceRate) => wordsPerBook * freelanceRate,
        result: {
            label: "Cost Per Book",
        },
        category: "Misc"
    },
    {
        title: "Total Freelance Cost for Books",
        description: "Estimate the total freelance cost for all books in the dataset.",
        inputs: ["total_books__books3__books", "average_length__book__words", "wage_data__generic_freelance_lower__dollars_per_word"],
        calculate: (totalBooks, wordsPerBook, freelanceRate) => totalBooks * wordsPerBook * freelanceRate,
        result: {
            label: "Total Freelance Cost",
        },
        category: "Misc"
    },
    // {
    //     title: "Revenue Per WSJ Journalist",
    //     description: "Estimate the revenue generated per WSJ journalist based on the deal value.",
    //     inputs: ["deal_value__newscorp__dollars", "group_size__wsj__journalists"],
    //     calculate: (dealValue, numberOfJournalists) => dealValue / numberOfJournalists,
    //     result: {
    //         label: "Revenue Per Journalist",
    //     }
    // },

    {
        title: "For reference: Revenue and tokens",
        description: "Estimate the revenue generated per token in the dataset (divide {yearly_revenue__openai__dollars} by {dataset_size__llama3__tokens}).",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens"],
        calculate: (yearlyRevenue, totalTokens) => yearlyRevenue / totalTokens,
        result: {
            label: "Revenue Per Token",
            units: "dollars",
        },
        category: "Misc"
    },
    {
        title: "For reference: Number of Contributions in a 'Dataset'",
        description: "Calculate the number of distinct contributions based on tokens.",
        inputs: ["dataset_size__llama3__tokens", "dataset_attribute__redpajama__tokens_per_contribution"],
        calculate: (totalTokens, tokensPerContribution) => totalTokens / tokensPerContribution,
        result: {
            label: "Contributions",
            units: "documents",
        },
        category: "Misc"
    },
    {
        title: "For reference: Revenue Per Contribution",
        description: "Estimate the revenue generated per contribution based on tokens.",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens", "dataset_attribute__redpajama__tokens_per_contribution"],
        calculate: (yearlyRevenue, totalTokens, tokensPerContribution) => (yearlyRevenue / totalTokens) * tokensPerContribution,
        result: {
            label: "Revenue Per Contribution",
        },
        category: "Misc"
    },
    {
        title: "For reference: Revenue Per Book",
        description: "Estimate the revenue generated per book in a dataset. Assume that each book's share is proportionate to its overall token contribution.",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens", "training_detail__openai__words_per_token", "average_length__book__words"],
        calculate: (yearlyRevenue, totalTokens, wordsPerToken, wordsPerBook) => (wordsPerBook / wordsPerToken) / totalTokens * (yearlyRevenue),
        result: {
            label: "Revenue Per Book",
            unit: "dollars",
        },
        category: "Misc"
    },

    {
        title: "For reference: Dataset Coverage Ratio",
        description: "Calculate the coverage ratio of books in a dataset.",
        inputs: ["total_books__books3__books", "average_length__book__words", "dataset_size__llama3__tokens"],
        calculate: (totalBooks, wordsPerBook, totalTokens) => (totalBooks * wordsPerBook) / totalTokens,
        result: {
            label: "Coverage Ratio",
        },
        category: "Misc"
    },
];
