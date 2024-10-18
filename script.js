const { createApp, ref, defineComponent, computed } = Vue;

const CalculationCard = defineComponent({
    template: '#calculation-card-template',
    props: {
        title: String,
        description: String,
        inputs: Object,
        result: Object
    }
});

createApp({
    components: {
        CalculationCard
    },
    data() {
        return {
            inputs: {
                humanReadableInput: { label: 'Input Value for Human-Readable Conversion', value: ref(1000000) },
                totalRevenue: { label: 'Total Revenue (in USD)', value: ref(1000000) },
                contributionPercentage: { label: 'Contribution Percentage (0-100)', value: ref(10) },
                datasetSize: { label: 'Dataset Size (in tokens)', value: ref(1000000000) },
                costPerToken: { label: 'Cost per Token (in USD)', value: ref(0.0001) },
                totalRevenueForToken: { label: 'Total Revenue for Token Calculation (in USD)', value: ref(5000000) },
                datasetSizeForRevenue: { label: 'Dataset Size for Revenue Calculation (in tokens)', value: ref(1000000000) },
                numberOfContributors: { label: 'Number of Contributors', value: ref(1000) },
                tokenWeight: { label: 'Token Weight Multiplier for Valuable Tokens', value: ref(2) }
            },
            calculations: [
                {
                    title: 'Human-Readable Format Conversion',
                    description: 'We are converting a numerical value to a more readable format, like thousands or millions.',
                    inputs: {
                        humanReadableInput: { label: 'Input Value', value: ref(1000000) }
                    },
                    result: {
                        label: 'Human-Readable Format',
                        value: computed(() => {
                            const value = ref(1000000).value;
                            return value === 0 ? '0' : (Math.abs(value) < 1 ? value.toString() : `${(value / Math.pow(10, 3 * Math.floor(Math.log10(Math.abs(value)) / 3))).toFixed(2)} ${['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion'][Math.floor(Math.log10(Math.abs(value)) / 3)]}`);
                        })
                    }
                },
                {
                    title: 'Estimating Contributor Value',
                    description: 'We are estimating the value a contributor might receive based on their contribution percentage and total revenue.',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: ref(1000000) },
                        contributionPercentage: { label: 'Contribution Percentage (0-100)', value: ref(10) }
                    },
                    result: {
                        label: 'Estimated Contributor Value',
                        value: computed(() => ((ref(1000000).value * (ref(10).value / 100)) || 0).toFixed(2))
                    }
                },
                {
                    title: 'Cost to Commission a New Dataset',
                    description: 'We are calculating the cost to commission a new dataset based on the size of the dataset and the cost per token.',
                    inputs: {
                        datasetSize: { label: 'Dataset Size (in tokens)', value: ref(1000000000) },
                        costPerToken: { label: 'Cost per Token (in USD)', value: ref(0.0001) }
                    },
                    result: {
                        label: 'Estimated Dataset Cost',
                        value: computed(() => ((ref(1000000000).value * ref(0.0001).value) || 0).toFixed(2))
                    }
                },
                {
                    title: 'Revenue per Token Calculation',
                    description: 'We are calculating the estimated revenue generated per token based on total revenue and dataset size.',
                    inputs: {
                        totalRevenueForToken: { label: 'Total Revenue (in USD)', value: ref(5000000) },
                        datasetSizeForRevenue: { label: 'Dataset Size (in tokens)', value: ref(1000000000) }
                    },
                    result: {
                        label: 'Estimated Revenue per Token',
                        value: computed(() => ((ref(5000000).value / ref(1000000000).value) || 0).toFixed(6))
                    }
                },
                {
                    title: 'Dividing LLM-Related Money Amongst Everyone',
                    description: 'What if we just divide LLM-related money amongst everyone?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: ref(1000000) },
                        numberOfContributors: { label: 'Number of Contributors', value: ref(1000) }
                    },
                    result: {
                        label: 'Amount per Contributor',
                        value: computed(() => ((ref(1000000).value / ref(1000).value) || 0).toFixed(2))
                    }
                },
                {
                    title: 'Apportion Based on Tokens',
                    description: 'What if we apportion revenue based on the number of tokens contributed?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: ref(1000000) },
                        datasetSize: { label: 'Dataset Size (in tokens)', value: ref(1000000000) },
                        tokensContributed: { label: 'Tokens Contributed by Individual', value: ref(10000) }
                    },
                    result: {
                        label: 'Revenue Share Based on Tokens',
                        value: computed(() => ((ref(1000000).value * (ref(10000).value / ref(1000000000).value)) || 0).toFixed(2))
                    }
                },
                {
                    title: 'Valuable Tokens Contribution',
                    description: 'What if certain categories of tokens are extra valuable, and we assign more weight to those tokens?',
                    inputs: {
                        totalRevenue: { label: 'Total Revenue (in USD)', value: ref(1000000) },
                        valuableTokens: { label: 'Number of Valuable Tokens Contributed', value: ref(5000) },
                        tokenWeight: { label: 'Token Weight Multiplier for Valuable Tokens', value: ref(2) },
                        regularTokens: { label: 'Number of Regular Tokens Contributed', value: ref(5000) }
                    },
                    result: {
                        label: 'Weighted Revenue Share',
                        value: computed(() => {
                            const weightedTokens = ref(5000).value * ref(2).value + ref(5000).value;
                            const totalWeightedTokens = ref(1000000000).value * ref(2).value; // Assume all tokens are weighted similarly for simplicity
                            return ((ref(1000000).value * (weightedTokens / totalWeightedTokens)) || 0).toFixed(2);
                        })
                    }
                }
            ]
        };
    }
}).mount('#app');
