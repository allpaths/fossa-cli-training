#!/usr/bin/env groovy
/*
 * Jenkins Pipeline for FOSSA CLI Training
 * This pipeline demonstrates how to integrate FOSSA CLI into Jenkins
 */

pipeline {
    agent any

    environment {
        // FOSSA API Key should be stored in Jenkins credentials
        FOSSA_API_KEY = credentials('fossa-api-key')
        NODE_VERSION = '18'
    }

    options {
        // Keep builds for 30 days
        buildDiscarder(logRotator(daysToKeepStr: '30'))

        // Timeout after 20 minutes
        timeout(time: 20, unit: 'MINUTES')

        // Add timestamps to console output
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    // Use NodeJS installation configured in Jenkins
                    def nodeHome = tool name: 'NodeJS-18', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }

                // Verify Node.js installation
                sh '''
                    echo "Node.js version:"
                    node --version
                    echo "NPM version:"
                    npm --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                sh 'npm ci'
            }
        }

        stage('Install FOSSA CLI') {
            steps {
                echo 'Installing FOSSA CLI...'
                sh '''
                    curl -H 'Cache-Control: no-cache' https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh | bash
                    fossa --version
                '''
            }
        }

        stage('FOSSA Analysis') {
            steps {
                echo 'Running FOSSA security analysis...'
                script {
                    try {
                        sh '''
                            echo "Starting FOSSA analysis..."
                            fossa analyze --debug
                            echo "FOSSA analysis completed successfully!"
                        '''
                    } catch (Exception e) {
                        echo "FOSSA analysis failed: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }

            post {
                always {
                    // Archive debug files if they exist
                    script {
                        if (fileExists('fossa.debug.json')) {
                            archiveArtifacts artifacts: 'fossa.debug.json', allowEmptyArchive: true
                        }
                        if (fileExists('fossa.debug.zip')) {
                            archiveArtifacts artifacts: 'fossa.debug.zip', allowEmptyArchive: true
                        }
                    }
                }
            }
        }

        stage('FOSSA Policy Test') {
            steps {
                echo 'Running FOSSA policy compliance test...'
                script {
                    try {
                        sh '''
                            echo "Starting FOSSA policy test..."
                            fossa test --debug
                            echo "Policy test completed successfully!"
                        '''
                    } catch (Exception e) {
                        echo "FOSSA policy test failed: ${e.getMessage()}"
                        echo "Policy violations detected - please review FOSSA dashboard"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Generate Reports') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                    branch 'develop'
                }
            }
            steps {
                echo 'Generating FOSSA reports...'
                script {
                    try {
                        sh '''
                            echo "Generating attribution report..."
                            fossa report attribution --json > attribution-report.json || echo "Attribution report failed"

                            echo "Reports generated successfully!"
                        '''
                    } catch (Exception e) {
                        echo "Report generation failed: ${e.getMessage()}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }

            post {
                success {
                    archiveArtifacts artifacts: '*-report.json', allowEmptyArchive: true
                }
            }
        }

        stage('Local Analysis Demo') {
            when {
                changeRequest()
            }
            steps {
                echo 'Running local FOSSA analysis for PR...'
                script {
                    try {
                        sh '''
                            echo "Running local analysis (no upload)..."
                            fossa analyze --output > fossa-local-results.json

                            echo "=== DISCOVERED VULNERABLE PACKAGES ==="
                            if [ -f fossa-local-results.json ]; then
                                jq
                            else
                                echo "No results file generated"
                            fi
                        '''
                    } catch (Exception e) {
                        echo "Local analysis failed: ${e.getMessage()}"
                    }
                }
            }

            post {
                always {
                    archiveArtifacts artifacts: 'fossa-local-results.json', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed!'

            // Clean up workspace
            cleanWs()
        }

        success {
            echo 'FOSSA scan completed successfully!'
        }

        failure {
            echo 'FOSSA scan failed!'

            // Send notification (configure based on your setup)
            // emailext (
            //     subject: "FOSSA Scan Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
            //     body: "The FOSSA security scan has failed. Please check the build logs.",
            //     to: "${env.CHANGE_AUTHOR_EMAIL}"
            // )
        }

        unstable {
            echo 'FOSSA scan completed with warnings!'
            echo 'Please review the FOSSA dashboard for policy violations or other issues.'
        }
    }
}
