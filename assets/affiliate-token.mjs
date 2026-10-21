import { GitHubCatalog } from './affiliate-core.mjs';

export async function connectWithToken({ token, context, fetchImpl = globalThis.fetch }) {
  const client = new GitHubCatalog({ repository: context.repository, branch: context.branch, token, fetchImpl });
  try {
    await client.authenticate(context.allowed_user_ids);
    const catalog = await client.load();
    return { client, catalog };
  } catch (error) { client.disconnect(); throw error; }
}
