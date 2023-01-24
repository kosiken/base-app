pipeline {
    environment {
    imageRepo = 'kosiken/frontend-svelte'
    commitSha = sh(returnStdout: true, script: "git log -1 --pretty=format:'%h'").trim()
    imageName = "${imageRepo}:${commitSha}"
  }
    agent any

    stages {
      stage('Clone Source') {
          steps {
            checkout scm
          }
      }
       stage('Build Image') {
          steps {
            sh ' docker build -t ${imageName} --target production .'
          }
      }
      stage('Deploy Application') {
          steps {
             sh 'docker stop frontend-svelte || true && docker rm frontend-svelte || true'
             sh 'docker run -d -p 3003:3003 --name frontend-svelte --env-file ~/env/kosiken/frontend-svelte.env ${imageName}'
          }
      }
        stage('Cleanup Build') {
          steps {
             sh 'docker system prune -a -f || true'
          }
      }
    }
}
