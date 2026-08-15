function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function opt(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  REPO_OWNER: () => opt("GITHUB_REPO_OWNER", "rathod-ramraj"),
  REPO_NAME: () => opt("GITHUB_REPO_NAME", "watchflow"),
  REPO_BRANCH: () => opt("GITHUB_REPO_BRANCH", "main"),
  SITE_URL: () => opt("SITE_URL", "https://cinexx.vercel.app"),
  DISCORD_WEBHOOK: () => opt("DISCORD_WEBHOOK", ""),
  CF_DOMAIN_ZONE: () => opt("CF_DOMAIN_ZONE", ""),
  CF_ACCOUNT_TOKEN: () => opt("CF_ACCOUNT_TOKEN", ""),
  GITHUB_CLIENT_ID: () => opt("GITHUB_CLIENT_ID") || opt("github_oauth_client_id"),
  GITHUB_CLIENT_SECRET: () => opt("GITHUB_CLIENT_SECRET") || opt("github_oauth_client_secret"),
  SESSION_SECRET: () => opt("SESSION_SECRET", ""),
  ENCRYPTION_KEY: () => opt("ENCRYPTION_KEY", ""),
};
