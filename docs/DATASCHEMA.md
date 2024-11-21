# Data Schema Overview for Data Napkin Math

This document provides an overview of all the attributes in our current data schema. Each data entry has a set of attributes that define its context, purpose, and properties. Below, you will find descriptions for each attribute used in our dataset, along with an example for clarity.

## Data Attributes

### 1. `variable`
- **Description**: The unique identifier for the data point. It follows a consistent naming convention of `description__specific_entity__unit` to ensure clarity. This attribute provides insight into what the variable represents, the entity associated with it, and its unit.
- **Example**: `dataset_size__llama3__tokens`

### 2. `variable_type`
- **Description**: Indicates the category or type of the variable. This helps classify the input and understand its purpose in the dataset.
- **Example**: `dataset_size` (Other examples could be `company_revenue`, `group_size`, etc.)

### 3. `entity`
- **Description**: Represents the specific entity the data is associated with. This could be a company, dataset, or another relevant category.
- **Example**: `llama3` (Could also be `openai`, `anthropic`, etc.)

### 4. `units`
- **Description**: Specifies the unit of measurement for the value. It helps provide context to the numerical data.
- **Example**: `tokens` (Other examples could be `dollars`, `people`, etc.)

### 5. `nice_name`
- **Description**: A human-readable name for the variable, providing a more user-friendly representation.
- **Example**: `Total pre-training tokens (Llama 3)`

### 6. `value`
- **Description**: The numerical value associated with the variable. This is the main data point that will be used in calculations.
- **Example**: `15000000000000.0` (Represents the total number of tokens for Llama 3)

### 7. `scale`
- **Description**: A scaling factor for the value. This is useful when displaying large numbers in more comprehensible units.
- **Example**: `1e9` (In this example, it scales the value to `billions of tokens`)

### 8. `display_units`
- **Description**: The units in which the value should be displayed to users. This helps ensure that large numbers are easy to read and understand.
- **Example**: `billions of tokens`

### 9. `value_description`
- **Description**: A brief description of what the value represents. This adds additional context to help users understand its purpose.
- **Example**: `Total tokens used to pre-train a model`

### 10. `key_assumption`
- **Description**: Any assumptions made while determining this value. This helps others understand the context or limitations behind the data point.
- **Example**:
  > We can use 15 trillion as a default value based on the assumption that most frontier models use roughly the same pre-training size. 15T is the number cited in the Llama 3 model card and close to the FineWeb size.

### 11. `source_url`
- **Description**: The URL to the source of the data. This ensures transparency and allows others to verify the information.
- **Example**: `https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md`

### 12. `source_notes`
- **Description**: Additional notes about the source, such as context or reliability, which might be useful for understanding the origin of the data.
- **Example**: `Source is the Llama 3 model card. It describes the total number of tokens used for pre-training.`

## Example Data Point
Below is an example that uses all the attributes described above:

```yaml
- variable: dataset_size__llama3__tokens
  variable_type: dataset_size
  entity: llama3
  units: tokens
  nice_name: Total pre-training tokens (Llama 3)
  value: 15000000000000.0
  scale: 1e9
  display_units: billions of tokens
  value_description: Total tokens used to pre-train a model
  key_assumption: >
    We can use 15 trillion as a default value based on the assumption that most frontier models use roughly the same pre-training size.
    15T is the number cited in Llama 3 model card and close to the FineWeb size.
  source_url: https://github.com/meta-llama/llama3/blob/main/MODEL_CARD.md
  source_notes: Source is the Llama 3 model card. It describes total number of tokens for pre-training.
```

