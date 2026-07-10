import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const dist = path.join(root, "dist");
const requiredFiles = ["index.html", "favicon.svg", "site.webmanifest"];
const forbiddenPatterns = [
  /(^|[\\/])src[\\/]/i,
  /(^|[\\/])tests?[\\/]/i,
  /(^|[\\/])node_modules[\\/]/i,
  /\.map$/i,
  /\.env(?:\.|$)/i
];
const forbiddenText = [
  /[A-Z]:[\\/](?:Users|桌面文件|workspace)/i,
  /(?:^|[^a-z])(?:localhost|127\.0\.0\.1)(?::\d+)?/i
];

const fail = (message) => {
  console.error("[verify] " + message);
  process.exitCode = 1;
};

if (!fs.existsSync(dist)) {
  fail("dist directory is missing; run npm run build first.");
} else {
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(dist, file))) {
      fail("required build file is missing: " + file);
    }
  }

  const walk = (directory) =>
    fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(absolute) : [absolute];
    });

  const builtFiles = walk(dist);
  if (!builtFiles.some((file) => path.basename(file).endsWith(".js"))) {
    fail("no JavaScript chunk was found in dist/assets.");
  }
  if (!builtFiles.some((file) => path.basename(file).endsWith(".css"))) {
    fail("no CSS asset was found in dist/assets.");
  }

  for (const file of builtFiles) {
    const relative = path.relative(dist, file);
    if (forbiddenPatterns.some((pattern) => pattern.test(relative))) {
      fail("unexpected source or temporary file in dist: " + relative);
    }
    if (/\.(html|js|css|webmanifest|svg)$/i.test(file)) {
      const content = fs.readFileSync(file, "utf8");
      if (forbiddenText.some((pattern) => pattern.test(content))) {
        fail("local development path or host found in build asset: " + relative);
      }
    }
  }
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("[verify] production build structure looks ready.");
