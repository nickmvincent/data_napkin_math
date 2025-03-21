---
title: Producing an expert evaluation set
description: How much would it cost to pay for an eval dataset (say, {dataset_size__hle__questions}) assuming moderate expert hourly wages (say, {wage_data__phd__dollars_per_question})?
input_variables:
  - dataset_size__hle__questions
  - wage_data__phd__dollars_per_question
calculation_type: operations
operations: '[{"func": "multiply", "args": ["{dataset_size__hle__questions}", "{wage_data__phd__dollars_per_question}"]}]'
result_label: Dataset Cost
result_units: dollars
category: Paying for new labour
date_added: 2025-03-19
tags:
  - calculation
  - paying-for-new-labour
---

# Producing an expert evaluation set

## Description

How much would it cost to pay for an eval dataset (say, 3,000 questions) assuming moderate expert hourly wages (say, 300 dollars per question)?

## Inputs

- **Total questions (HLE)**: 3,000 questions
- **PhD rate per question**: 300 dollars per question

## Calculation

- Multiply: 3,000 questions × 300 dollars per question = [result]

## Result

The Dataset Cost is calculated in dollars.

## Category

Paying for new labour
