import { TemplateDefinition } from "../types";

export const faqTemplate: TemplateDefinition = {
  id: "faq-basic-v1",
  name: "Basic FAQ Template",
  pageType: "faq",
  fields: [
    { name: "productName", type: "string", required: true },
    { name: "sections", type: "qa[]", required: true },
  ],
  rules: {
    minQuestions: 5,
    groupByCategory: true,
  },
  requiredBlocks: ["generateQuestionsBlock", "buildFAQItemsBlock"],
};
