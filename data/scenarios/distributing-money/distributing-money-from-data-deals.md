---
title: Distributing Money from Data Deals
description: If we distribute the payments from recent data deal (say, {deal_value__reddit_google__dollars}) to some group of people (say, {deal_group_size__reddit__daily_active_users}), how much will each person get?
input_variables:
  - deal_value__reddit_google__dollars
  - deal_group_size__reddit__daily_active_users
calculation_type: operations
operations: '[{"func": "divide", "args": ["{deal_value__reddit_google__dollars}", "{deal_group_size__reddit__daily_active_users}"]}]'
result_label: Per Person Revenue
result_units: dollars
category: Distributing money
date_added: 2025-03-19
tags:
  - calculation
  - distributing-money
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
