import { cp, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await cp(".next-build", "dist", { recursive: true });

console.log("Static site copied from .next-build to dist.");
