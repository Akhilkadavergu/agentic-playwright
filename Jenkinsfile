pipeline {
    agent any

    parameters {
        string(name: 'TEST_MATCH', defaultValue: '**/*.spec.ts', description: 'Glob pattern for test files/class/namespace to execute')
        string(name: 'WORKERS', defaultValue: '10', description: 'Number of Playwright workers')
        string(name: 'BROWSERS', defaultValue: 'chromium', description: 'Comma-separated browsers (chromium,firefox,webkit,all)')
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
                    def browsers = params.BROWSERS.split(',').collect { it.trim().toLowerCase() }.findAll { it }
                    def browserArgs = ''
                    if (!browsers.contains('all')) {
                        browserArgs = browsers.collect { "--project=${it}" }.join(' ')
                    }
                    def workerCount = params.WORKERS ?: '10'
                    def testPattern = params.TEST_MATCH ?: '**/*.spec.ts'

                    bat "npx playwright test ${testPattern} --workers=${workerCount} ${browserArgs}"
                }
            }
        }

        stage('Generate Allure Report') {
            steps {
                bat 'allure generate allure-results --clean -o allure-report'
            }
        }
    }

    post {
        always {
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'allure-report',
                reportFiles: 'index.html',
                reportName: 'Allure Report'
            ])
        }
    }
}