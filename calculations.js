// calculations.js

// Calculations Data - with Functions Included
export const calculationsData = [
    {
        title: "Distributing AI Revenue",
        description: "If we distribute AI revenue to everyone in the world, how much will each person get?",
        inputs: ["yearly_revenue__openai__dollars", "group_size__world__people"],
        calculate: (yearlyRevenue, population) => yearlyRevenue / population,
        result: {
            label: "Per Person Revenue",
            value: 0,
            units: "dollars"
        }
    },
    {
        title: "Commissioning an LLM Dataset Cost Estimation",
        description: "How much would it cost to pay for a brand new LLM-scale pre-training dataset assuming moderate freelance writing wages.",
        inputs: ["dataset_size__llama3__tokens", "training_detail__openai__words_per_token", "wage_data__generic_freelance_higher__dollars_per_word"],
        calculate: (tokens, wordsPerToken, freelanceRate) => tokens * wordsPerToken * freelanceRate,
        result: {
            label: "Dataset Cost",
            value: 0,
            units: "dollars",
        }
    },
    {
        title: "Revenue Per Token",
        description: "Estimate the revenue generated per token in the dataset.",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens"],
        calculate: (yearlyRevenue, totalTokens) => yearlyRevenue / totalTokens,
        result: {
            label: "Revenue Per Token",
            value: 0,
            units: "dollars",
        }
    },
    {
        title: "Number of Contributions",
        description: "Calculate the number of distinct contributions based on tokens.",
        inputs: ["dataset_size__llama3__tokens", "dataset_attribute__redpajama__tokens_per_contribution"],
        calculate: (totalTokens, tokensPerContribution) => totalTokens / tokensPerContribution,
        result: {
            label: "Contributions",
            value: 0,
            units: "documents",
        }
    },
    {
        title: "Revenue Per Contribution",
        description: "Estimate the revenue generated per contribution based on tokens.",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens", "dataset_attribute__redpajama__tokens_per_contribution"],
        calculate: (yearlyRevenue, totalTokens, tokensPerContribution) => (yearlyRevenue / totalTokens) * tokensPerContribution,
        result: {
            label: "Revenue Per Contribution",
            value: 0
        }
    },
    {
        title: "Revenue Per Book",
        description: "Estimate the revenue generated per book in a dataset. Assume that each book's share is proportionate to its overall token contribution.",
        inputs: ["yearly_revenue__openai__dollars", "dataset_size__llama3__tokens", "training_detail__openai__words_per_token", "average_length__book__words"],
        calculate: (yearlyRevenue, totalTokens, wordsPerToken, wordsPerBook) => (wordsPerBook / wordsPerToken) / totalTokens * (yearlyRevenue),
        result: {
            label: "Revenue Per Book",
            value: 0,
            unit: "dollars",
        }
    },
    {
        title: "Dataset Coverage Ratio",
        description: "Calculate the coverage ratio of books in a dataset.",
        inputs: ["total_books__books3__books", "average_length__book__words", "dataset_size__llama3__tokens"],
        calculate: (totalBooks, wordsPerBook, totalTokens) => (totalBooks * wordsPerBook) / totalTokens,
        result: {
            label: "Coverage Ratio",
            value: 0
        }
    },
    {
        title: "Value Per Reddit User",
        description: "Estimate the value generated per Reddit user based on the deal value.",
        inputs: ["deal_value__reddit_google__dollars", "group_size_users__reddit__daily_active_users"],
        calculate: (dealValue, dailyActiveUsers) => dealValue / dailyActiveUsers,
        result: {
            label: "Value Per User",
            value: 0
        }
    },
    {
        title: "Freelance Cost Per Book",
        description: "Calculate the cost of commissioning a book based on freelance rates.",
        inputs: ["average_length__book__words", "wage_data__generic_freelance_lower__dollars_per_word"],
        calculate: (wordsPerBook, freelanceRate) => wordsPerBook * freelanceRate,
        result: {
            label: "Cost Per Book",
            value: 0
        }
    },
    {
        title: "Total Freelance Cost for Books",
        description: "Estimate the total freelance cost for all books in the dataset.",
        inputs: ["total_books__books3__books", "average_length__book__words", "wage_data__generic_freelance_lower__dollars_per_word"],
        calculate: (totalBooks, wordsPerBook, freelanceRate) => totalBooks * wordsPerBook * freelanceRate,
        result: {
            label: "Total Freelance Cost",
            value: 0
        }
    },
    {
        title: "Revenue Per WSJ Journalist",
        description: "Estimate the revenue generated per WSJ journalist based on the deal value.",
        inputs: ["deal_value__newscorp__dollars", "group_size__wsj__journalists"],
        calculate: (dealValue, numberOfJournalists) => dealValue / numberOfJournalists,
        result: {
            label: "Revenue Per Journalist",
            value: 0
        }
    }
];
