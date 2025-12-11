import { Agent, AgentContext } from "./BaseAgent";
import { Product, UserQuestion } from "../types";
import { generateQuestionsBlock } from "../blocks/contentBlocks";

export class QuestionGenerationAgent
  implements Agent<Product, UserQuestion[]>
{
  name = "QuestionGenerationAgent";

  // Fully deterministic: relies on generateQuestionsBlock only.
  async run(
    product: Product,
    _context: AgentContext
  ): Promise<UserQuestion[]> {
    return generateQuestionsBlock(product);
  }
}
