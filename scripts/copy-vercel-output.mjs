import fs from "node:fs";
import path from "node:path";

const source = path.join("Hollow Fall", ".vercel");
const target = ".vercel";

if (!fs.existsSync(path.join(source, "output"))) {
  throw new Error(
    "Expected Hollow Fall/.vercel/output after the frontend build. In Vercel, use the TanStack Start framework preset and do not set Output Directory to dist.",
  );
}

fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(source, target, { recursive: true });
