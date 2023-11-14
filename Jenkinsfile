import groovy.json.JsonOutput

def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

def getBuildUser() {
    return currentBuild.rawBuild.getCause(Cause.UserIdCause).getUserId()
}

pipeline {
    agent any
    environment {
        BUILD_USER = ''
    }
    parameters {
        string(name: 'SPEC', defaultValue: 'searchTest.cy.js')
        choice(name: 'BROWSER', choices: ['electron'], description: 'Pick the web browser you want to use to run your scripts')
    }

    stages {
        stage('Install dependencies'){
            agent {
                // this image provides everything needed to run Cypress
                docker {
                    image 'cypress/base:20.9.0'
                }
            }
            steps{
                script{
                    sh 'npm ci'
                }
            }
        }

        stage('OWASP DependencyCheck') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
            }
        }
        
        stage ('Cypress UI Test'){
            agent {
                // this image provides everything needed to run Cypress
                docker {
                    image 'cypress/base:20.9.0'
                }
            }
            steps {
                script{
                    dir("${env.WORKSPACE}"){
                        sh "pwd"
                    }

                    sh 'npm start > react_app.log 2>&1 &'

                    sleep(time: 5, unit: 'SECONDS')

                    sh 'npx cypress run --browser ${BROWSER} --spec cypress/e2e/${SPEC}'
                }
                
            }
        }
        stage('Code Quality Check via SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=quiz -Dsonar.sources=. -Dsonar.host.url=http://172.19.0.3:9000"
                    }
                }
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
        always {
            //The script step takes a block of Scripted Pipeline and executes that in the Declarative Pipeline. 
            //For most use-cases, the script step should be unnecessary in Declarative Pipelines, but it can provide
            //a useful "escape hatch." script blocks of non-trivial size and/or complexity should be moved into Shared Libraries instead.
            script {
                BUILD_USER = getBuildUser()
            }
            
            slackSend channel: '#jenkins-example',
                color: COLOR_MAP[currentBuild.currentResult],
                message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME} build ${env.BUILD_NUMBER} by ${BUILD_USER}\n Tests:${SPEC} executed at ${BROWSER} \n More info at: ${env.BUILD_URL}HTML_20Report/"
            
            publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'client/cypress/report', reportFiles: 'index.html', reportName: 'HTML Report', reportTitles: ''])
            deleteDir()
        }
    }
}