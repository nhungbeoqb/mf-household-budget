// The Kitchen Table Ledger — entrypoint.
//
// Hands the site in: copies app/ and screenshots/ from this repository
// into the output directory (MAKEFUN_OUTPUT_DIR outside the grader, /output
// inside it) and writes /output/dossier.json with buildDossier from the
// kit's vendor/makefun-frontend.ts. Nothing else is written, so two runs
// over the same repository produce the same bytes.
import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// NOTE: on the grader, /output is a mount point — never remove it
// (rmSync on a mount point throws EBUSY and fails the run). Only
// create it if missing; stale files are the grader's concern, not ours.
mkdirSync(outDir, { recursive: true });

for (const dir of ["app", "screenshots"]) {
  cpSync(join(repoRoot, dir), join(outDir, dir), { recursive: true });
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});

writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`wrote ${outDir}/dossier.json (${dossier.length} bytes)`);
