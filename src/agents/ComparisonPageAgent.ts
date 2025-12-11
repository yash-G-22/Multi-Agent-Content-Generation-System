import { Agent, AgentContext } from "./BaseAgent";
import { Product, ComparisonPage } from "../types";
import {
  buildComparisonSummariesBlock,
  buildComparisonPointsBlock,
} from "../blocks/contentBlocks";

export interface ComparisonPageAgentInput {
  productA: Product; // GlowBoost
}

/**
 * This agent also creates a fictional Product B
 * (allowed by the assignment) using structured data.
 */
function createFictionalProductB(): Product {
  return {
    name: "RadiantShield Brightening Serum",
    concentration: "5% Vitamin C",
    skinTypes: ["Dry", "Normal"],
    keyIngredients: ["Vitamin C", "Niacinamide"],
    benefits: ["Brightening", "Helps with uneven skin tone"],
    howToUse:
      "Apply 2–3 drops in the evening on clean skin before moisturizer.",
    sideEffects: "Mild tingling may occur on first use.",
    price: "₹799",
  };
}

export class ComparisonPageAgent
  implements Agent<ComparisonPageAgentInput, ComparisonPage>
{
  name = "ComparisonPageAgent";

  async run(
    input: ComparisonPageAgentInput,
    _context: AgentContext
  ): Promise<ComparisonPage> {
    const productB = createFictionalProductB();

    const summaries = buildComparisonSummariesBlock(
      input.productA,
      productB
    );

    const comparisonPoints = buildComparisonPointsBlock(
      summaries.a,
      summaries.b
    );

    return {
      title: `${summaries.a.name} vs ${summaries.b.name}`,
      products: summaries,
      comparisonPoints,
    };
  }
}
