// Builds the whole site for Vercel using the Build Output API:
// the Vite frontend becomes static files and the Express app becomes a
// single serverless function mounted at /api.
// https://vercel.com/docs/build-output-api/v3
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { build as esbuild } from "esbuild";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(artifactDir, "..", "..");
const outputDir = path.resolve(repoRoot, ".vercel", "output");
const frontendDist = path.resolve(repoRoot, "artifacts", "sherrys-dipz", "dist", "public");
const funcDir = path.resolve(outputDir, "functions", "api", "index.func");

async function buildVercel() {
  await rm(outputDir, { recursive: true, force: true });

  await mkdir(path.resolve(outputDir, "static"), { recursive: true });
  await cp(frontendDist, path.resolve(outputDir, "static"), { recursive: true });

  await mkdir(funcDir, { recursive: true });
  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/app.ts")],
    platform: "node",
    target: "node22",
    bundle: true,
    format: "esm",
    outfile: path.resolve(funcDir, "index.mjs"),
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "info",
    // Make sure packages that are cjs only (e.g. express) still work in the esm bundle
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
globalThis.require = __bannerCrReq(import.meta.url);`,
    },
  });

  await writeFile(
    path.resolve(funcDir, ".vc-config.json"),
    JSON.stringify(
      {
        runtime: "nodejs22.x",
        handler: "index.mjs",
        launcherType: "Nodejs",
        // Express parses the body itself; Vercel's helpers would consume it first
        shouldAddHelpers: false,
      },
      null,
      2,
    ),
  );

  await writeFile(
    path.resolve(outputDir, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { src: "^/api(/.*)?$", dest: "/api" },
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index.html" },
        ],
      },
      null,
      2,
    ),
  );
}

buildVercel().catch((err) => {
  console.error(err);
  process.exit(1);
});
