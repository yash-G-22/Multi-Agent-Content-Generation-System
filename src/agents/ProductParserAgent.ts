import { Agent, AgentContext } from "./BaseAgent";
import { RawProductInput, Product } from "../types";

export class ProductParserAgent implements Agent<RawProductInput, Product> {
  name = "ProductParserAgent";

  async run(input: RawProductInput, _context: AgentContext): Promise<Product> {
    const skinTypes = input["Skin Type"]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const keyIngredients = input["Key Ingredients"]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const benefits = input["Benefits"]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return {
      name: input["Product Name"],
      concentration: input["Concentration"],
      skinTypes,
      keyIngredients,
      benefits,
      howToUse: input["How to Use"],
      sideEffects: input["Side Effects"],
      price: input["Price"],
    };
  }
}
