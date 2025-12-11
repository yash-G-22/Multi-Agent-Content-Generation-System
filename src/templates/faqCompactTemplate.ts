import { TemplateDefinition } from "../types";

export const faqCompactTemplate: TemplateDefinition = {
  id: "faq-compact-v1",
  name: "Compact FAQ Template",
  pageType: "faq",
  fields: [
    { name: "productName", type: "string", required: true },
    { name: "sections", type: "qa[]", required: true },
  ],
  rules: {
    // Include all questions without limiting per category
  },
  requiredBlocks: ["generateQuestionsBlock", "buildFAQItemsBlock"],
};
