pipeline {
    agent any

    parameters {
        choice(name: 'SUITE_SCOPE', choices: ['full', 'partial'], description: 'Run the full suite or selected partial suite')
        choice(name: 'PARTIAL_SUITE', choices: [
            'tests/saucedemo-checkout/accessibility.spec.ts',
            'tests/saucedemo-checkout/cart-review.spec.ts',
            'tests/saucedemo-checkout/cart-totals.spec.ts',
            'tests/saucedemo-checkout/checkout-validation.spec.ts',
            'tests/saucedemo-checkout/error-handling.spec.ts',
            'tests/saucedemo-checkout/navigation-flow.spec.ts',
            'tests/saucedemo-checkout/order-completion.spec.ts',
            'tests/saucedemo-checkout/order-overview.spec.ts',
            'tests/saucedemo-checkout/ui-elements.spec.ts'
        ], description: 'Test file to execute (used when SUITE_SCOPE=partial)')
        booleanParam(name: 'CHROME', defaultValue: true, description: 'Run in chromium')
        booleanParam(name: 'FIREFOX', defaultValue: false, description: 'Run in firefox')
        booleanParam(name: 'WEBKIT', defaultValue: false, description: 'Run in webkit')
        string(name: 'WORKERS', defaultValue: '10', description: 'Number of Playwright workers')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    def selectedBrowsers = []
                    if (params.CHROME) selectedBrowsers << 'chromium'
                    if (params.FIREFOX) selectedBrowsers << 'firefox'
                    if (params.WEBKIT) selectedBrowsers << 'webkit'
                    if (!selectedBrowsers) {
                        selectedBrowsers = ['chromium']
                    }

                    def browserArgs = selectedBrowsers.collect { "--project=${it}" }.join(' ')
                    def workerCount = params.WORKERS ?: '10'

                    def testPattern = (params.SUITE_SCOPE == 'partial') ? params.PARTIAL_SUITE : 'tests'

                    bat "npx playwright test \"${testPattern}\" --workers=${workerCount} ${browserArgs}"
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}