import { Orchestrator } from "./orchestrator";

async function main() {
  const orchestrator = new Orchestrator();
  await orchestrator.run();
  console.log("All pages generated to /output.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
