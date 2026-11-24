import { appendFile } from 'node:fs/promises';

// Use the public REST artifact listing: the action's internal artifact service
// returned zero artifacts even after successful uploads in this repository.
const env = process.env;
for (const key of ['GITHUB_API_URL', 'GITHUB_REPOSITORY', 'GITHUB_RUN_ID', 'GITHUB_SHA', 'GH_TOKEN', 'GITHUB_OUTPUT', 'ACTIONS_ID_TOKEN_REQUEST_URL', 'ACTIONS_ID_TOKEN_REQUEST_TOKEN']) {
  if (!env[key]) throw new Error(`Missing workflow variable: ${key}`);
}
const root = `${env.GITHUB_API_URL}/repos/${env.GITHUB_REPOSITORY}`;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function api(path, method = 'GET', body) {
  const response = await fetch(`${root}${path}`, {
    method,
    headers: { Authorization: `Bearer ${env.GH_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Pages API ${method} ${path}: HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
}

let artifact;
for (let attempt = 0; attempt < 12; attempt++) {
  const data = await api(`/actions/runs/${env.GITHUB_RUN_ID}/artifacts`);
  const matches = data.artifacts.filter(item => item.name === 'github-pages' && !item.expired);
  if (matches.length > 1) throw new Error('More than one Pages artifact exists for this run');
  artifact = matches[0];
  if (artifact) break;
  await sleep(5000);
}
if (!artifact) throw new Error('Pages artifact was not available after 60 seconds');
if (artifact.workflow_run?.head_sha !== env.GITHUB_SHA) throw new Error('Artifact commit does not match this build');

const identityResponse = await fetch(env.ACTIONS_ID_TOKEN_REQUEST_URL, {
  headers: { Authorization: `Bearer ${env.ACTIONS_ID_TOKEN_REQUEST_TOKEN}` },
  signal: AbortSignal.timeout(30000),
});
if (!identityResponse.ok) throw new Error(`OIDC request: HTTP ${identityResponse.status}`);
const identity = await identityResponse.json();
if (!identity.value) throw new Error('OIDC response contained no identity token');
// Never log identity tokens or API authorization headers.
console.log(`Deploying Pages artifact ${artifact.id} for ${env.GITHUB_SHA}`);
const deployment = await api('/pages/deployments', 'POST', {
  artifact_id: artifact.id,
  pages_build_version: env.GITHUB_SHA,
  oidc_token: identity.value,
});
const deploymentId = deployment.id || deployment.status_url?.split('/').pop();
if (!deploymentId) throw new Error('Pages response contained no deployment ID');
if (deployment.page_url) await appendFile(env.GITHUB_OUTPUT, `page_url=${deployment.page_url}\n`);
const statusPath = `/pages/deployments/${encodeURIComponent(deploymentId)}`;
const failures = new Set(['deployment_failed', 'deployment_content_failed', 'deployment_cancelled', 'deployment_lost']);
try {
  const deadline = Date.now() + 600000;
  while (Date.now() < deadline) {
    await sleep(5000);
    const result = await api(statusPath);
    console.log(`Pages deployment: ${result.status}`);
    if (result.status === 'succeed') process.exit(0);
    if (failures.has(result.status)) throw new Error(`Pages deployment failed: ${result.status}`);
  }
  throw new Error('Pages deployment timed out after ten minutes');
} catch (error) {
  await api(`${statusPath}/cancel`, 'POST').catch(() => {});
  throw error;
}
