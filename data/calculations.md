# Calculations Data

## Distributing the 'value generated' by AI to everyone in the world

- **Description**: If we were to immediately distribute AI revenue to everyone on Earth, how much would each person receive?
- **Inputs**: yearly_revenue__openai__dollars, group_size__world__people
- **Result Label**: Dividend per person
- **Units**: dollars
- **Value**: 0
- **Explanation**: yearly_revenue__openai__dollars / group_size__world__people

## Commissiong a fresh LLM dataset

- **Description**: How much would it cost to pay for a brand new LLM-scale pre-training dataset assuming moderate freelance writing wages.
- **Inputs**: training_detail__openai__words_per_token, wage_data__generic_freelance_higher__dollars_per_word, dataset_size__llama3__tokens
- **Result Label**: Total cost
- **Units**: dollars
- **Value**: 0
- **Explanation**: dataset_size__llama3__tokens * training_detail__openai__words_per_token * wage_data__generic_freelance_higher__dollars_per_word

## Distributing model 'value generated' per token

- **Description**: Estimate a $/token value. Take some estimate of value generated (e.g., the revenue of an AI company) and divide by the number of tokens used to train that company's models.

- **Inputs**: yearly_revenue__openai__dollars, dataset_size__llama3__tokens
- **Result Label**: Revenue per Token
- **Units**: N/A
- **Value**: 0
- **Explanation**: yearly_revenue__openai__dollars / dataset_size__llama3__tokens

## Average Contribution Size

- **Description**: Estimate of the average contribution size in tokens based on the dataset size and number of contributions.
- **Inputs**: dataset_size__llama3__tokens, dataset_attribute__redpajama__tokens_per_contribution
- **Result Label**: Average Contribution Size
- **Units**: N/A
- **Value**: 0
- **Explanation**: dataset_size__llama3__tokens / dataset_attribute__redpajama__tokens_per_contribution

## Revenue per contribution

- **Description**: Calculate the revenue generated per contribution based on the average tokens per contribution and revenue per token.
- **Inputs**: dataset_attribute__redpajama__tokens_per_contribution, yearly_revenue__openai__dollars, dataset_size__llama3__tokens
- **Result Label**: Revenue per Contribution
- **Units**: N/A
- **Value**: 0
- **Explanation**: (yearly_revenue__openai__dollars / dataset_size__llama3__tokens) * dataset_attribute__redpajama__tokens_per_contribution

## Revenue per Book in Books3

- **Description**: Estimate the revenue generated per book in the Books3 dataset.
- **Inputs**: total_books__books3__books, average_length__book__words, yearly_revenue__openai__dollars, dataset_size__llama3__tokens
- **Result Label**: Revenue per Book
- **Units**: N/A
- **Value**: 0
- **Explanation**: (yearly_revenue__openai__dollars / dataset_size__llama3__tokens) * (total_books__books3__books * average_length__book__words)

## Dataset Coverage Ratio

- **Description**: Calculate the ratio of books in the Books3 dataset relative to the total number of tokens.
- **Inputs**: total_books__books3__books, average_length__book__words, dataset_size__llama3__tokens
- **Result Label**: Dataset Coverage Ratio
- **Units**: N/A
- **Value**: 0
- **Explanation**: (total_books__books3__books * average_length__book__words) / dataset_size__llama3__tokens

## Value per Reddit User

- **Description**: Estimate the value of the Reddit-Google deal per Reddit daily active user.
- **Inputs**: deal_value__reddit_google__dollars, group_size_users__reddit__daily_active_users
- **Result Label**: Value per Reddit User
- **Units**: dollars
- **Value**: 0
- **Explanation**: (deal_value__reddit_google__dollars * 1e6) / (group_size_users__reddit__daily_active_users * 1e3)

## Freelance Cost per Book in Books3

- **Description**: Calculate the cost of paying freelance writers to create content equivalent to a book in the Books3 dataset, using high freelance rates.
- **Inputs**: average_length__book__words, wage_data__generic_freelance_lower__dollars_per_word
- **Result Label**: Freelance Cost per Book
- **Units**: dollars
- **Value**: 0
- **Explanation**: average_length__book__words * wage_data__generic_freelance_lower__dollars_per_word

## Total Freelance Cost for Books3

- **Description**: Estimate the total cost to pay freelance writers to create content equivalent to all books in the Books3 dataset.
- **Inputs**: total_books__books3__books, average_length__book__words, wage_data__generic_freelance_lower__dollars_per_word
- **Result Label**: Total Freelance Cost for Books3
- **Units**: dollars
- **Value**: 0
- **Explanation**: total_books__books3__books * average_length__book__words * wage_data__generic_freelance_lower__dollars_per_word

## Revenue per WSJ Journalist

- **Description**: Estimate the revenue per journalist at WSJ based on News Corp's total revenue from their AI deal.
- **Inputs**: deal_value__newscorp__dollars, group_size__wsj__journalists
- **Result Label**: Revenue per WSJ Journalist
- **Units**: dollars
- **Value**: 0
- **Explanation**: deal_value__newscorp__dollars / group_size__wsj__journalists

