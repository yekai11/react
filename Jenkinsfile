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

        stage('OWASP DependencyCheck') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
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

        stage ('Cypress UI Test'){
            agent {
                // this image provides everything needed to run Cypress
                docker {
                    image 'cypress/base:20.9.0'
                }
            }
            steps {
                script{
                    sh 'npm ci'

                    dir("${env.WORKSPACE}"){
                        sh "pwd"
                    }

                    sh 'npm start > react_app.log 2>&1 &'

                    sleep(time: 5, unit: 'SECONDS')

                    sh 'npx cypress run --browser ${BROWSER} --spec cypress/e2e/${SPEC}'
                }
                
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}