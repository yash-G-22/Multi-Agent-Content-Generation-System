export type SkinType = "Oily" | "Combination" | "Dry" | "Normal" | "Sensitive";

export interface RawProductInput {
  "Product Name": string;
  "Concentration": string;
  "Skin Type": string; 
  "Key Ingredients": string; 
  "Benefits": string;        
  "How to Use": string;
  "Side Effects": string;
  "Price": string;          
}

export interface Product {
  name: string;
  concentration: string;
  skinTypes: SkinType[] | string[]; 
  keyIngredients: string[];
  benefits: string[];
  howToUse: string;
  sideEffects: string;
  price: string;
}

export type QuestionCategory =
  | "informational"
  | "safety"
  | "usage"
  | "purchase"
  | "comparison";

export interface UserQuestion {
  id: string;
  category: QuestionCategory;
  question: string;
}

export interface QAItem {
  question: string;
  answer: string;
  category: QuestionCategory;
}

export interface FAQPage {
  productName: string;
  sections: {
    category: QuestionCategory;
    items: QAItem[];
  }[];
}

export interface ProductPage {
  productName: string;
  hero: {
    title: string;
    subtitle: string;
    price: string;
  };
  details: {
    concentration: string;
    skinTypes: string[];
    keyIngredients: string[];
    benefits: string[];
    howToUse: string;
    sideEffects: string;
  };
}

export interface ComparisonProductSummary {
  name: string;
  concentration: string;
  skinTypes: string[];
  keyIngredients: string[];
  benefits: string[];
  price: string;
}

export interface ComparisonPage {
  title: string;
  products: {
    a: ComparisonProductSummary;
    b: ComparisonProductSummary;
  };
  comparisonPoints: {
    aspect: string;
    productA: string;
    productB: string;
  }[];
}

export type TemplateFieldType =
  | "string"
  | "string[]"
  | "qa[]"
  | "comparison[]";

export interface TemplateField {
  name: string;
  type: TemplateFieldType;
  required: boolean;
  description?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  pageType: "faq" | "product" | "comparison";
  fields: TemplateField[];
  rules?: Record<string, unknown>;
  requiredBlocks?: string[];
}
