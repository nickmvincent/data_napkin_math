---
title: Commissioning New Datasets
description: How much would it cost to pay for a brand new LLM-scale pre-training dataset (say, {dataset_size__llama3__tokens}) assuming moderate freelance writing wages (say, {wage_data__generic_freelance_higher__dollars_per_word})?
input_variables:
  - dataset_size__llama3__tokens
  - training_detail__openai__words_per_token
  - wage_data__generic_freelance_higher__dollars_per_word
calculation_type: operations
operations: '[{"func": "multiply", "args": ["{dataset_size__llama3__tokens}", "{training_detail__openai__words_per_token}"], "name": "total_words"}, {"func": "multiply", "args": ["{total_words}", "{wage_data__generic_freelance_higher__dollars_per_word}"]}]'
result_label: Dataset Cost
result_units: dollars
category: Paying for new labour
date_added: 2025-03-19
tags:
  - calculation
  - paying-for-new-labour
---

# Commissioning New Datasets

## Description

How much would it cost to pay for a brand new LLM-scale pre-training dataset (say, 15,000 billions of tokens) assuming moderate freelance writing wages (say, 1 dollars per word)?

## Inputs

- **Total pre-training tokens (Llama 3)**: 15,000 billions of tokens
- **Average words per token**: 0.75 words per token
- **Freelance rate per word (high estimate)**: 1 dollars per word

## Calculation

- Multiply: 15,000 billions of tokens × 0.75 words per token = [total_words]
- Multiply: [total_words] × 1 dollars per word = [result]

## Result

The Dataset Cost is calculated in dollars.

## Category

Paying for new labour
