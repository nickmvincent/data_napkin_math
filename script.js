const app = Vue.createApp({
    data() {
        return {
            inputs: {
                humanReadableInput: { label: 'Input Value for Human-Readable Conversion', value: 1000000 },
                totalRevenue: { label: 'Total Revenue (in USD)', value: 1000000 },
                contributionPercentage: { label: 'Contribution Percentage (0-100)', value: 10 },
                datasetSize: { label: 'Dataset Size (in tokens)', value: 1000000000 },
                costPerToken: { label: 'Cost per Token (in USD)', value: 0.0001 },
                totalRevenueForToken: { label: 'Total Revenue for Token Calculation (in USD)', value: 5000000 },
                datasetSizeForRevenue: { label: 'Dataset Size for Revenue Calculation (in tokens)', value: 1000000000 },
                numberOfContributors: { label: 'Number of Contributors', value: 1000 },
                tokenWeight: { label: 'Token Weight Multiplier for Valuable Tokens', value: 2 },
                tokensContributed: { label: 'Tokens Contributed by Individual', value: 10000 },
                valuableTokens: { label: 'Number of Valuable Tokens Contributed', value: 5000 },
                regularTokens: { label: 'Number of Regular Tokens Contributed', value: 5000 }
            },
            calculations: [
                {
                    title: 'Human-Readable Format Conversion',
                    description: 'We are converting a numerical value to a more readable format, like thousands or millions.',
                    inputs: {
                        humanReadableInput: { label: 'Input Value', value: 1000000 }
                    },
                    result: {
                        label: 'Human-Readable Format',
                        value: '1.00 million'
                    }
                },
                {
                    title: 'Estimating Contributor Value',
                    description: 'We are estimating the value a contributor might receive based on their contribution percentage and total revenue.',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: 1000000 },
                        contributionPercentage: { label: 'Contribution Percentage (0-100)', value: 10 }
                    },
                    result: {
                        label: 'Estimated Contributor Value',
                        value: 100000.00
                    }
                },
                {
                    title: 'Cost to Commission a New Dataset',
                    description: 'We are calculating the cost to commission a new dataset based on the size of the dataset and the cost per token.',
                    inputs: {
                        datasetSize: { label: 'Dataset Size (in tokens)', value: 1000000000 },
                        costPerToken: { label: 'Cost per Token (in USD)', value: 0.0001 }
                    },
                    result: {
                        label: 'Estimated Dataset Cost',
                        value: 100000.00
                    }
                },
                {
                    title: 'Revenue per Token Calculation',
                    description: 'We are calculating the estimated revenue generated per token based on total revenue and dataset size.',
                    inputs: {
                        totalRevenueForToken: { label: 'Total Revenue (in USD)', value: 5000000 },
                        datasetSizeForRevenue: { label: 'Dataset Size (in tokens)', value: 1000000000 }
                    },
                    result: {
                        label: 'Estimated Revenue per Token',
                        value: 0.005000
                    }
                },
                {
                    title: 'Dividing LLM-Related Money Amongst Everyone',
                    description: 'What if we just divide LLM-related money amongst everyone?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: 1000000 },
                        numberOfContributors: { label: 'Number of Contributors', value: 1000 }
                    },
                    result: {
                        label: 'Amount per Contributor',
                        value: 1000.00
                    }
                },
                {
                    title: 'Apportion Based on Tokens',
                    description: 'What if we apportion revenue based on the number of tokens contributed?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: 1000000 },
                        datasetSize: { label: 'Dataset Size (in tokens)', value: 1000000000 },
                        tokensContributed: { label: 'Tokens Contributed by Individual', value: 10000 }
                    },
                    result: {
                        label: 'Revenue Share Based on Tokens',
                        value: 10.00
                    }
                },
                {
                    title: 'Valuable Tokens Contribution',
                    description: 'What if certain categories of tokens are extra valuable, and we assign more weight to those tokens?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: 1000000 },
                        valuableTokens: { label: 'Number of Valuable Tokens Contributed', value: 5000 },
                        tokenWeight: { label: 'Token Weight Multiplier for Valuable Tokens', value: 2 },
                        regularTokens: { label: 'Number of Regular Tokens Contributed', value: 5000 }
                    },
                    result: {
                        label: 'Weighted Revenue Share',
                        value: 1.00
                    }
                }
            ]
        };
    },
    methods: {
        updateCalculation(index, newInputs) {
            const calculation = this.calculations[index];

            // Update each input value
            Object.keys(newInputs).forEach(key => {
                if (calculation.inputs[key]) {
                    calculation.inputs[key].value = newInputs[key].value;
                    // Update global inputs to sync with the card inputs
                    if (this.inputs[key]) {
                        this.inputs[key].value = newInputs[key].value;
                    }
                }
            });

            // Example calculation logic
            if (calculation.title === 'Human-Readable Format Conversion') {
                let value = calculation.inputs.humanReadableInput.value;
                calculation.result.value = value === 0 ? '0' : (Math.abs(value) < 1 ? value.toString() : `${(value / Math.pow(10, 3 * Math.floor(Math.log10(Math.abs(value)) / 3))).toFixed(2)} ${['', 'thousand', 'million', 'billion', 'trillion'][Math.floor(Math.log10(Math.abs(value)) / 3)]}`);
            } else if (calculation.title === 'Estimating Contributor Value') {
                calculation.result.value = (calculation.inputs.totalRevenue.value * (calculation.inputs.contributionPercentage.value / 100)).toFixed(2);
            } else if (calculation.title === 'Cost to Commission a New Dataset') {
                calculation.result.value = (calculation.inputs.datasetSize.value * calculation.inputs.costPerToken.value).toFixed(2);
            } else if (calculation.title === 'Revenue per Token Calculation') {
                calculation.result.value = (calculation.inputs.totalRevenueForToken.value / calculation.inputs.datasetSizeForRevenue.value).toFixed(6);
            } else if (calculation.title === 'Dividing LLM-Related Money Amongst Everyone') {
                calculation.result.value = (calculation.inputs.totalRevenue.value / calculation.inputs.numberOfContributors.value).toFixed(2);
            } else if (calculation.title === 'Apportion Based on Tokens') {
                calculation.result.value = (calculation.inputs.totalRevenue.value * (calculation.inputs.tokensContributed.value / calculation.inputs.datasetSize.value)).toFixed(2);
            } else if (calculation.title === 'Valuable Tokens Contribution') {
                const weightedTokens = calculation.inputs.valuableTokens.value * calculation.inputs.tokenWeight.value + calculation.inputs.regularTokens.value;
                calculation.result.value = (calculation.inputs.totalRevenue.value * (weightedTokens / (calculation.inputs.datasetSize.value * calculation.inputs.tokenWeight.value))).toFixed(2);
            }
        },
        updateGlobalInputs() {
            // Update calculations inputs based on global inputs
            this.calculations.forEach(calculation => {
                Object.keys(this.inputs).forEach(key => {
                    if (calculation.inputs[key]) {
                        calculation.inputs[key].value = this.inputs[key].value;
                    }
                });
            });
        }
    },
    watch: {
        inputs: {
            handler: function(newInputs) {
                this.updateGlobalInputs();
            },
            deep: true
        }
    }
});

app.component('calculation-card', {
    template: '#calculation-card-template',
    props: ['title', 'description', 'inputs', 'result'],
    emits: ['update:inputs'],
    methods: {
        onInputChange() {
            this.$emit('update:inputs', { ...this.inputs });
        }
    },
    watch: {
        inputs: {
            handler: function(newInputs) {
                this.onInputChange();
            },
            deep: true
        }
    }
});

app.mount('#app');
