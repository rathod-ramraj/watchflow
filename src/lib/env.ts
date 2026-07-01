function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function opt(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  REPO_OWNER: () => opt("GITHUB_REPO_OWNER", "N3rdmade"),
  REPO_NAME: () => opt("GITHUB_REPO_NAME", "WatchFlow"),
  REPO_BRANCH: () => opt("GITHUB_REPO_BRANCH", "main"),
  SITE_URL: () => opt("SITE_URL", "https://watchfloww.vercel.app"),
  DISCORD_WEBHOOK: () => opt("DISCORD_WEBHOOK", ""),
};
