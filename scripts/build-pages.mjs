/**
 * Сборка статического демо для GitHub Pages.
 * Временно убирает server-only маршруты (api/admin), собирает export, кладёт .nojekyll.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const stash = path.join(root, ".static-stash");
const apiDir = path.join(root, "src", "app", "api");
const adminDir = path.join(root, "src", "app", "admin");
const stashedApi = path.join(stash, "api");
const stashedAdmin = path.join(stash, "admin");
const outDir = path.join(root, "out");

function run(cmd, args, env = {}) {
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(" ")}`);
  }
}

function moveDir(from, to) {
  if (!existsSync(from)) return;
  if (existsSync(to)) rmSync(to, { recursive: true, force: true });
  mkdirSync(path.dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  rmSync(from, { recursive: true, force: true });
}

function stashServerRoutes() {
  mkdirSync(stash, { recursive: true });
  moveDir(apiDir, stashedApi);
  moveDir(adminDir, stashedAdmin);
}

function restoreServerRoutes() {
  moveDir(stashedApi, apiDir);
  moveDir(stashedAdmin, adminDir);
  if (existsSync(stash)) rmSync(stash, { recursive: true, force: true });
}

try {
  console.log("→ Stashing api/ and admin/ for static export…");
  stashServerRoutes();

  const nextCache = path.join(root, ".next");
  if (existsSync(nextCache)) {
    console.log("→ Clearing .next cache…");
    rmSync(nextCache, { recursive: true, force: true });
  }

  console.log("→ Building static export for GitHub Pages…");
  run("npx", ["next", "build"], {
    GITHUB_PAGES: "true",
    NEXT_PUBLIC_STATIC_EXPORT: "true",
    GITHUB_PAGES_BASE_PATH: process.env.GITHUB_PAGES_BASE_PATH || "/friends_site",
  });

  if (!existsSync(outDir)) {
    throw new Error("out/ not found after build");
  }

  writeFileSync(path.join(outDir, ".nojekyll"), "");
  const notFound = path.join(outDir, "404.html");
  if (!existsSync(notFound)) {
    const indexHtml = path.join(outDir, "index.html");
    if (existsSync(indexHtml)) cpSync(indexHtml, notFound);
  }

  console.log("✓ Static site ready in out/");
  console.log("  Demo URL: https://s3gam3.github.io/friends_site/");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  console.log("→ Restoring api/ and admin/…");
  restoreServerRoutes();
}
