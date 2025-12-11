import { createContentAgent } from "./agentic/ContentAgent";

export class Orchestrator {
  async run() {
    const agent = createContentAgent();

    const result = await agent.invoke({});

    // eslint-disable-next-line no-console
    console.log(
      "Generated FAQ, product, and comparison pages and saved them to the /output directory.",
      JSON.stringify(result, null, 2)
    );
  }
}
