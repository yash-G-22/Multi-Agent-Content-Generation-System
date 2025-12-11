import { Agent, AgentContext } from "./BaseAgent";
import { Product, ProductPage } from "../types";
import { summarizeProductForHero } from "../blocks/contentBlocks";

export class ProductPageAgent
  implements Agent<Product, ProductPage>
{
  name = "ProductPageAgent";

  async run(
    product: Product,
    _context: AgentContext
  ): Promise<ProductPage> {
    const hero = summarizeProductForHero(product);

    return {
      productName: product.name,
      hero,
      details: {
        concentration: product.concentration,
        skinTypes: product.skinTypes as string[],
        keyIngredients: product.keyIngredients,
        benefits: product.benefits,
        howToUse: product.howToUse,
        sideEffects: product.sideEffects,
      },
    };
  }
}
