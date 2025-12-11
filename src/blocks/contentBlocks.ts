import {
  Product,
  UserQuestion,
  QAItem,
  QuestionCategory,
  ComparisonProductSummary,
} from "../types";

// Helper: simple id builder
const makeId = (prefix: string, index: number) => `${prefix}_${index}`;
export function generateQuestionsBlock(product: Product): UserQuestion[] {
  const questions: UserQuestion[] = [];

  const push = (category: QuestionCategory, question: string) => {
    questions.push({
      id: makeId(category, questions.length + 1),
      category,
      question,
    });
  };

  // Informational
  push("informational", `What is ${product.name}?`);
  push(
    "informational",
    `What are the key ingredients in ${product.name}?`
  );
  push(
    "informational",
    `What are the main benefits of using ${product.name}?`
  );
  push(
    "informational",
    `Which skin types is ${product.name} suitable for?`
  );

  // Usage
  push("usage", `How should I use ${product.name} in my routine?`);
  push(
    "usage",
    `When during the day should I apply ${product.name}?`
  );
  push(
    "usage",
    `How many drops of ${product.name} should I use at a time?`
  );
  push(
    "usage",
    `Should I apply sunscreen after using ${product.name}?`
  );

  // Safety
  push(
    "safety",
    `Are there any side effects of using ${product.name}?`
  );
  push(
    "safety",
    `Is ${product.name} suitable for sensitive skin?`
  );
  push(
    "safety",
    `What should I do if I feel tingling after applying ${product.name}?`
  );

  // Purchase
  push("purchase", `What is the price of ${product.name}?`);
  push(
    "purchase",
    `Is ${product.name} a daily-use product or occasional treatment?`
  );

  // Comparison
  push(
    "comparison",
    `How does ${product.name} compare to another Vitamin C serum?`
  );
  push(
    "comparison",
    `How does the concentration of ${product.name} compare to other serums?`
  );

  // Informational (continued)
  push(
    "informational",
    `What is the Vitamin C concentration in ${product.name}?`
  );
  push(
    "informational",
    `How long does it take to see results with ${product.name}?`
  );
  push(
    "informational",
    `What is the shelf life of ${product.name} after opening?`
  );

  // Usage (continued)
  push(
    "usage",
    `Can I use ${product.name} with other active ingredients like retinol or AHAs?`
  );
  push(
    "usage",
    `Do I need to shake ${product.name} before use?`
  );

  // Safety (continued)
  push(
    "safety",
    `Can I use ${product.name} during pregnancy or while breastfeeding?`
  );
  push(
    "safety",
    `What should I do if ${product.name} gets into my eyes?`
  );

  // Purchase (continued)
  push(
    "purchase",
    `What size options are available for ${product.name}?`
  );
  push(
    "purchase",
    `Is there a money-back guarantee for ${product.name}?`
  );

  // Additional informational questions
  push(
    "informational",
    `How should I store ${product.name} to maintain its potency?`
  );
  push(
    "informational",
    `Does ${product.name} need to be refrigerated?`
  );

  // Additional usage questions
  push(
    "usage",
    `What visible changes can I expect from using ${product.name}?`
  );
  push(
    "usage",
    `How long will the results from using ${product.name} typically last?`
  );
  
  // Additional safety questions
  push(
    "safety",
    `Can I use ${product.name} if I have a Vitamin C allergy?`
  );
  
  // Additional purchase questions
  push(
    "purchase",
    `Where can I buy authentic ${product.name}?`
  );
  
  // Additional comparison questions
  push(
    "comparison",
    `What makes ${product.name} different from other serums on the market?`
  );

  return questions;
}
export function buildFAQItemsBlock(
  product: Product,
  questions: UserQuestion[]
): QAItem[] {
  return questions.map((q) => ({
    question: q.question,
    category: q.category,
    answer: answerFromProduct(product, q),
  }));
}
function answerFromProduct(product: Product, q: UserQuestion): string {
  const {
    name,
    concentration,
    keyIngredients,
    benefits,
    skinTypes,
    howToUse,
    sideEffects,
    price,
  } = product;

  const ingredientsList = keyIngredients.join(", ");
  const benefitsList = benefits.join(", ");
  const skinTypesList = skinTypes.join(", ");

  const lower = q.question.toLowerCase().trim();

  // --- Informational ---

  if (lower.startsWith("what is ")) {
    return `${name} is a skincare serum with ${concentration}, designed for ${skinTypesList} skin and formulated with key ingredients like ${ingredientsList}.`;
  }

  if (lower.includes("key ingredients")) {
    return `${name} contains key ingredients including ${ingredientsList}.`;
  }

  if (lower.includes("main benefits")) {
    return `The main benefits of ${name} are: ${benefitsList}.`;
  }

  if (lower.includes("which skin types")) {
    return `${name} is suitable for ${skinTypesList} skin.`;
  }

  if (lower.includes("vitamin c concentration") || lower.includes("concentration in")) {
    return `${name} has a Vitamin C concentration of ${concentration}.`;
  }

  if (lower.includes("concentration of")) {
    return `${name} contains ${concentration}.`;
  }

  // --- Usage ---

  if (lower.startsWith("how should i use") || lower.includes("in my routine")) {
    return `To use ${name}, follow these instructions: ${howToUse}.`;
  }

  if (lower.includes("when during the day")) {
    return `${name} is described as a morning-use serum. The usage instructions say: ${howToUse}.`;
  }

  if (lower.includes("how many drops")) {
    return `Use 2–3 drops, as stated in the instructions: ${howToUse}.`;
  }

  if (lower.includes("sunscreen")) {
    return `Yes, ${name} is meant to be applied in the morning before sunscreen. The usage directions are: ${howToUse}.`;
  }

  if (lower.includes("daily-use")) {
    return `${name} is described for use in the morning routine. The label states: ${howToUse}.`;
  }

  // --- Safety ---

  if (lower.includes("side effects")) {
    return `The product notes the following possible side effect: ${sideEffects}.`;
  }

  if (lower.includes("sensitive skin")) {
    return `The product specifically mentions: ${sideEffects}. This means people with sensitive skin may experience mild tingling when using ${name}.`;
  }

  if (lower.includes("what should i do if i feel tingling")) {
    return `The product information states: ${sideEffects}. This indicates that mild tingling can occur, especially on sensitive skin, when using ${name}.`;
  }

  // --- Purchase ---

  if (lower.includes("price of")) {
    return `The listed price of ${name} is ${price}.`;
  }

  // --- Comparison ---

  if (lower.includes("compare to another vitamin c serum")) {
    return `${name} is a ${concentration} serum with ingredients like ${ingredientsList}. Other Vitamin C serums may differ in concentration, ingredients, and price, but only this product’s details are provided here.`;
  }

  if (lower.includes("compare to other serums")) {
    return `${name} offers ${concentration}. Other serums can use higher or lower percentages or different ingredient combinations, but only ${name} is described in the available data.`;
  }

  if (lower.includes("how does the concentration of")) {
    return `${name} has a concentration of ${concentration}. We do not have specific concentration details for other serums in this dataset.`;
  }

  // --- Fallback (safe summary) ---

  return `${name} is a serum with ${concentration}, suitable for ${skinTypesList} skin, offering benefits such as ${benefitsList}, and containing ingredients like ${ingredientsList}.`;
}
export function summarizeProductForHero(product: Product) {
  return {
    title: product.name,
    subtitle: `${product.concentration} | For ${product.skinTypes.join(", ")} skin`,
    price: product.price,
  };
}
export function buildComparisonSummariesBlock(
  productA: Product,
  productB: Product
): { a: ComparisonProductSummary; b: ComparisonProductSummary } {
  const map = (p: Product): ComparisonProductSummary => ({
    name: p.name,
    concentration: p.concentration,
    skinTypes: p.skinTypes as string[],
    keyIngredients: p.keyIngredients,
    benefits: p.benefits,
    price: p.price,
  });

  return {
    a: map(productA),
    b: map(productB),
  };
}
export function buildComparisonPointsBlock(
  summaryA: ComparisonProductSummary,
  summaryB: ComparisonProductSummary
) {
  return [
    {
      aspect: "Concentration",
      productA: summaryA.concentration,
      productB: summaryB.concentration,
    },
    {
      aspect: "Skin Type Target",
      productA: summaryA.skinTypes.join(", "),
      productB: summaryB.skinTypes.join(", "),
    },
    {
      aspect: "Key Ingredients",
      productA: summaryA.keyIngredients.join(", "),
      productB: summaryB.keyIngredients.join(", "),
    },
    {
      aspect: "Benefits",
      productA: summaryA.benefits.join(", "),
      productB: summaryB.benefits.join(", "),
    },
    {
      aspect: "Price",
      productA: summaryA.price,
      productB: summaryB.price,
    },
  ];
}
