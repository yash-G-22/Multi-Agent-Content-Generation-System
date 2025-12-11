import { Agent, AgentContext } from "./BaseAgent";
import { FAQPage, Product, UserQuestion, TemplateDefinition } from "../types";
import { buildFAQItemsBlock } from "../blocks/contentBlocks";
export interface FaqPageAgentInput {
  product: Product;
  questions: UserQuestion[];
}

export class FaqPageAgent implements Agent<FaqPageAgentInput, FAQPage> {
  name = "FaqPageAgent";
  private template: TemplateDefinition;

  constructor(template: TemplateDefinition) {
    this.template = template;
  }

  async run(input: FaqPageAgentInput, _context: AgentContext): Promise<FAQPage> {
    const qaItems = buildFAQItemsBlock(input.product, input.questions);
    const sectionsMap: Record<string, typeof qaItems> = {};
    for (const item of qaItems) {
      const key = item.category;
      if (!sectionsMap[key]) sectionsMap[key] = [];
      sectionsMap[key].push(item);
    }
    if (this.template.id === "faq-compact-v1") {
      const compactSections = Object.entries(sectionsMap).map(([category, items]) => ({
        category: category as FAQPage["sections"][number]["category"],
        items: items, // Include all items without limiting
      }));
      const sectionCount = compactSections.length;
      if (sectionCount === 1) {
        return {
          productName: input.product.name,
          sections: compactSections,
        };
      }

      return {
        productName: input.product.name,
        sections: compactSections,
      };
    }
    return {
      productName: input.product.name,
      sections: Object.entries(sectionsMap).map(([category, items]) => ({
        category: category as FAQPage["sections"][number]["category"],
        items,
      })),
    };
  }
}
