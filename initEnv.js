const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const fs = require('fs');
const dotenv = require('dotenv');
const env = process.env.NODE_ENV|| 'dev';

async function accessSecretVersion(projectId, secretId, versionId = 'latest') {
  const client = new SecretManagerServiceClient();
  // let secretName = {};
  // secretName[secretId] = "latest";
  // const [accessResponse] = await client.accessSecretVersion({ secretName });
  const name = `projects/${projectId}/secrets/${secretId}/versions/${versionId}`;
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload.data.toString('utf8');
  return payload;
}

async function saveSecretsToEnvFile(projectId, secrets) {
  const envConfig = {};
  // if(env === 'prod') {
    for (const secretId of secrets) {
      const secretValue = await accessSecretVersion(projectId,secretId);
      envConfig[secretId] = secretValue;
    }
  // }

  const envContent = Object.entries(envConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  let existingEnvContent = '';
  const localEnvPath = (`configs/${env}.env`).toLocaleLowerCase();
  if (fs.existsSync(localEnvPath)) {
      existingEnvContent = fs.readFileSync(localEnvPath, 'utf8');
  }
  const finalEnvContent = existingEnvContent + '\n' + envContent;
  fs.writeFileSync('.env', finalEnvContent);
}

(async () => {
  const projectId = 'your-project-id';
  const secrets = [
    'DB_CONNECTION_STRING',
    'JWT_SECRET'
  ];

  await saveSecretsToEnvFile(projectId,secrets);
  dotenv.config();
})();