const core = require('@actions/core')
const exec = require('@actions/exec')
const path = require('path')

async function deploy() {
    const folder = core.getInput('folder')
    const s3Bucket = core.getInput('s3-bucket-name')

    const localSource = path.resolve(folder)
    return new Promise((resolve, reject) => {
        try {
            const cmd = `aws s3 sync ${localSource} s3://${s3Bucket} --delete`
            // execute
            exec.exec(cmd, []).then(resolve('Success')).catch(err => reject(err.message))
        } catch (error) {
            core.setFailed('Error with upload')
        }  
    })
}

async function runDeploy() {
    try {
        await deploy()
    } catch (error) {
        core.setFailed('Error with deploy')
    }
}

async function wait (milliseconds) {
    return new Promise((resolve, reject) => {
      if (typeof(milliseconds) !== 'number') { 
        throw new Error('milleseconds not a number'); 
      }
  
      setTimeout(() => resolve("done!"), milliseconds)
    });
}

module.exports = {
    runDeploy,
    wait
}