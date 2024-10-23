<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Napkin Math</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css">
    <script src="https://unpkg.com/vue@3"></script>
    <style>
        body {
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .card {
            margin-bottom: 20px;
            padding: 20px;
            border-radius: 10px;
            background: #f9f9f9;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        .explanation {
            cursor: pointer;
            color: #007bff;
            text-decoration: underline;
        }
        .collapse {
            margin-bottom: 20px;
        }
        .tooltip {
            position: relative;
            display: inline-block;
            color: #007bff;
            text-decoration: underline;
            cursor: pointer;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 250px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 5px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -125px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>

<body>
    <div id="app" class="container">
        <header class="header">
            <h1>Data Napkin Math for Training Data Value</h1>
            <p>Order of magnitude estimates about profit distribution, dataset creation costs, and data deals.</p>
        </header>

        <!-- Collapsible Input Section -->
        <section class="mb-4">
            <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#inputSection" aria-expanded="false" aria-controls="inputSection">
                Adjust All Assumptions
            </button>
            <div class="collapse mt-3" id="inputSection">
                <div class="card card-body">
                    <h4>Adjust Inputs</h4>
                    <div v-for="(value, key) in inputs" :key="key" class="mb-3">
                        <label :for="key" class="form-label">{{ formatLabel(key) }}</label>
                        <input type="number" v-model.number="inputs[key]" :id="key" class="form-control" @input="updateCalculations">
                    </div>
                </div>
            </div>
        </section>

        <!-- Napkin Math Section -->
        <section id="napkinMath">
            <h2>Napkin Math Calculations</h2>
            <p>Below are examples of napkin math calculations and scenarios based on the Python functions from the original notebook:</p>

            <!-- Calculation Cards -->
            <div v-for="(calculation, index) in calculations" :key="index" class="card">
                <header>
                    <h4>{{ calculation.title }}</h4>
                    <p>
                        <span class="explanation">{{ calculation.description }}</span>
                        <span class="tooltip">[hover to see calculation details]
                            <span class="tooltiptext">
                                <strong>JavaScript Calculation:</strong><br>
                                {{ calculation.explanation }}
                            </span>
                        </span>
                    </p>
                </header>
                <div v-for="inputKey in calculation.inputs" :key="inputKey" class="mb-3">
                    <label :for="inputKey" class="form-label">{{ formatLabel(inputKey) }}</label>
                    <input type="number" v-model.number="inputs[inputKey]" :id="inputKey" class="form-control" @input="updateCalculations">
                </div>
                <footer class="mt-4">
                    <p>{{ calculation.result.label }}: <strong>{{ calculation.result.value }}</strong></p>
                </footer>
            </div>
        </section>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/js/bootstrap.bundle.min.js"></script>
    <script>
        const app = Vue.createApp({
            data() {
                return {
                    inputs: {
                        totalRevenue: 1000000,
                        contributionPercentage: 10,
                        datasetSize: 1000000000,
                        costPerToken: 0.0001,
                        totalRevenueForToken: 5000000,
                        datasetSizeForRevenue: 1000000000,
                        numberOfContributors: 1000,
                        tokenWeight: 2,
                        tokensContributed: 10000,
                        valuableTokens: 5000,
                        regularTokens: 5000
                    },
                    calculations: [
                        {
                            title: 'Estimating Contributor Value',
                            description: 'We are estimating the value a contributor might receive based on their contribution percentage and total revenue.',
                            inputs: ['totalRevenue', 'contributionPercentage'],
                            result: {
                                label: 'Estimated Contributor Value',
                                value: 0
                            },
                            explanation: 'totalRevenue * (contributionPercentage / 100)'
                        },
                        {
                            title: 'Cost to Commission a New Dataset',
                            description: 'We are calculating the cost to commission a new dataset based on the size of the dataset and the cost per token.',
                            inputs: ['datasetSize', 'costPerToken'],
                            result: {
                                label: 'Estimated Dataset Cost',
                                value: 0
                            },
                            explanation: 'datasetSize * costPerToken'
                        },
                        {
                            title: 'Revenue per Token Calculation',
                            description: 'We are calculating the estimated revenue generated per token based on total revenue and dataset size.',
                            inputs: ['totalRevenueForToken', 'datasetSizeForRevenue'],
                            result: {
                                label: 'Estimated Revenue per Token',
                                value: 0
                            },
                            explanation: 'totalRevenueForToken / datasetSizeForRevenue'
                        },
                        {
                            title: 'Dividing LLM-Related Money Amongst Everyone',
                            description: 'What if we just divide LLM-related money amongst everyone?',
                            inputs: ['totalRevenue', 'numberOfContributors'],
                            result: {
                                label: 'Amount per Contributor',
                                value: 0
                            },
                            explanation: 'totalRevenue / numberOfContributors'
                        },
                        {
                            title: 'Apportion Based on Tokens',
                            description: 'What if we apportion revenue based on the number of tokens contributed?',
                            inputs: ['totalRevenue', 'datasetSize', 'tokensContributed'],
                            result: {
                                label: 'Revenue Share Based on Tokens',
                                value: 0
                            },
                            explanation: 'totalRevenue * (tokensContributed / datasetSize)'
                        },
                        {
                            title: 'Valuable Tokens Contribution',
                            description: 'What if certain categories of tokens are extra valuable, and we assign more weight to those tokens?',
                            inputs: ['totalRevenue', 'valuableTokens', 'tokenWeight', 'regularTokens', 'datasetSize'],
                            result: {
                                label: 'Weighted Revenue Share',
                                value: 0
                            },
                            explanation: '(totalRevenue * ((valuableTokens * tokenWeight + regularTokens) / (datasetSize * tokenWeight)))'
                        }
                    ]
                };
            },
            methods: {
                formatLabel(key) {
                    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                },
                updateCalculations() {
                    this.calculations.forEach(calculation => {
                        const inputs = calculation.inputs.reduce((acc, key) => {
                            acc[key] = this.inputs[key];
                            return acc;
                        }, {});

                        let result = 0;
                        if (calculation.title === 'Estimating Contributor Value') {
                            result = inputs.totalRevenue * (inputs.contributionPercentage / 100);
                        } else if (calculation.title === 'Cost to Commission a New Dataset') {
                            result = inputs.datasetSize * inputs.costPerToken;
                        } else if (calculation.title === 'Revenue per Token Calculation') {
                            result = inputs.totalRevenueForToken / inputs.datasetSizeForRevenue;
                        } else if (calculation.title === 'Dividing LLM-Related Money Amongst Everyone') {
                            result = inputs.totalRevenue / inputs.numberOfContributors;
                        } else if (calculation.title === 'Apportion Based on Tokens') {
                            result = inputs.totalRevenue * (inputs.tokensContributed / inputs.datasetSize);
                        } else if (calculation.title === 'Valuable Tokens Contribution') {
                            const weightedTokens = inputs.valuableTokens * inputs.tokenWeight + inputs.regularTokens;
                            result = inputs.totalRevenue * (weightedTokens / (inputs.datasetSize * inputs.tokenWeight));
                        }

                        calculation.result.value = this.humanReadable(result);
                    });
                },
                humanReadable(value) {
                    if (value === 0) return '0';
                    if (Math.abs(value) < 1) return value.toString();
                    const units = ['', 'thousand', 'million', 'billion', 'trillion'];
                    const order = Math.floor(Math.log10(Math.abs(value)) / 3);
                    const unitName = units[order] || `10^${order * 3}`;
                    return `${(value / Math.pow(10, 3 * order)).toFixed(2)} ${unitName}`;
                }
            },
            mounted() {
                this.updateCalculations();
            }
        });

        app.mount('#app');
    </script>
</body>

</html>
