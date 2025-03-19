---
title: Total pre-training tokens (Llama 3)
value: 15000000000000
scale: 1000000000
display_units: billions of tokens
variable_name: dataset_size__llama3__tokens
variable_type: dataset_size
entity: llama3
units: tokens
source_url: https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md
date_added: 2025-03-19
tags:
  - dataset_size
  - llama3
  - tokens
---

# Total pre-training tokens (Llama 3)

**Value:** 15,000 billions of tokens

## Description

Total tokens used to pre-training a model

## Key Assumption

We can use 15 trillion as a default value based on the assumption that most frontier models use roughly same pre-training size. 15T is the number cited in Llama3 model card and close to the FineWeb size.

## Source

- [https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md](https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md)
- Source is the Llama 3 model card. It describes total number of tokens for pre-training. It is useful.
