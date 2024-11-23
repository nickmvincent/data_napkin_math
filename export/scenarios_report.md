# Scenarios Report

## Distributing AI Revenue
**Description**: If we distribute AI revenue to everyone in the world, how much will each person get?

**Inputs**: yearly_revenue__openai__dollars, group_size__world__people

**Calculation Script**: (yearlyRevenue, population) => yearlyRevenue / population

**Unit Details**: dollars / people

**Result Label**: Per Person Revenue

**Result Units**: dollars

## Commissioning an LLM Dataset Cost Estimation
**Description**: How much would it cost to pay for a brand new LLM-scale pre-training dataset assuming moderate freelance writing wages.

**Inputs**: dataset_size__llama3__tokens, training_detail__openai__words_per_token, wage_data__generic_freelance_higher__dollars_per_word

**Calculation Script**: (tokens, wordsPerToken, freelanceRate) => tokens * wordsPerToken * freelanceRate

**Result Label**: Dataset Cost

**Result Units**: dollars

## Revenue Per Token
**Description**: Estimate the revenue generated per token in the dataset.

**Inputs**: yearly_revenue__openai__dollars, dataset_size__llama3__tokens

**Calculation Script**: (yearlyRevenue, totalTokens) => yearlyRevenue / totalTokens

**Result Label**: Revenue Per Token

**Result Units**: dollars

## Number of Contributions
**Description**: Calculate the number of distinct contributions based on tokens.

**Inputs**: dataset_size__llama3__tokens, dataset_attribute__redpajama__tokens_per_contribution

**Calculation Script**: (totalTokens, tokensPerContribution) => totalTokens / tokensPerContribution

**Result Label**: Contributions

**Result Units**: documents

## Revenue Per Contribution
**Description**: Estimate the revenue generated per contribution based on tokens.

**Inputs**: yearly_revenue__openai__dollars, dataset_size__llama3__tokens, dataset_attribute__redpajama__tokens_per_contribution

**Calculation Script**: (yearlyRevenue, totalTokens, tokensPerContribution) => (yearlyRevenue / totalTokens) * tokensPerContribution

**Result Label**: Revenue Per Contribution

**Result Units**: N/A

## Revenue Per Book
**Description**: Estimate the revenue generated per book in a dataset. Assume that each book's share is proportionate to its overall token contribution.

**Inputs**: yearly_revenue__openai__dollars, dataset_size__llama3__tokens, training_detail__openai__words_per_token, average_length__book__words

**Calculation Script**: (yearlyRevenue, totalTokens, wordsPerToken, wordsPerBook) => (wordsPerBook / wordsPerToken) / totalTokens * (yearlyRevenue)

**Result Label**: Revenue Per Book

**Result Units**: N/A

## Dataset Coverage Ratio
**Description**: Calculate the coverage ratio of books in a dataset.

**Inputs**: total_books__books3__books, average_length__book__words, dataset_size__llama3__tokens

**Calculation Script**: (totalBooks, wordsPerBook, totalTokens) => (totalBooks * wordsPerBook) / totalTokens

**Result Label**: Coverage Ratio

**Result Units**: N/A

## Value Per Reddit User
**Description**: Estimate the value generated per Reddit user based on the deal value.

**Inputs**: deal_value__reddit_google__dollars, group_size_users__reddit__daily_active_users

**Calculation Script**: (dealValue, dailyActiveUsers) => dealValue / dailyActiveUsers

**Result Label**: Value Per User

**Result Units**: N/A

## Freelance Cost Per Book
**Description**: Calculate the cost of commissioning a book based on freelance rates.

**Inputs**: average_length__book__words, wage_data__generic_freelance_lower__dollars_per_word

**Calculation Script**: (wordsPerBook, freelanceRate) => wordsPerBook * freelanceRate

**Result Label**: Cost Per Book

**Result Units**: N/A

## Total Freelance Cost for Books
**Description**: Estimate the total freelance cost for all books in the dataset.

**Inputs**: total_books__books3__books, average_length__book__words, wage_data__generic_freelance_lower__dollars_per_word

**Calculation Script**: (totalBooks, wordsPerBook, freelanceRate) => totalBooks * wordsPerBook * freelanceRate

**Result Label**: Total Freelance Cost

**Result Units**: N/A

## Revenue Per WSJ Journalist
**Description**: Estimate the revenue generated per WSJ journalist based on the deal value.

**Inputs**: deal_value__newscorp__dollars, group_size__wsj__journalists

**Calculation Script**: (dealValue, numberOfJournalists) => dealValue / numberOfJournalists

**Result Label**: Revenue Per Journalist

**Result Units**: N/A

