import fs from "fs";
import path from "path";
import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import {
  RawProductInput,
  Product,
  FAQPage,
  ProductPage,
  ComparisonPage,
  UserQuestion,
} from "../types";
import { ProductParserAgent } from "../agents/ProductParserAgent";
import { QuestionGenerationAgent } from "../agents/QuestionGenerationAgent";
import { FaqPageAgent } from "../agents/FaqPageAgent";
import { ProductPageAgent } from "../agents/ProductPageAgent";
import { ComparisonPageAgent } from "../agents/ComparisonPageAgent";
import { faqTemplate } from "../templates/faqTemplate";
import { faqCompactTemplate } from "../templates/faqCompactTemplate";

const loadRawProduct = tool(
  async (input: { path?: string }) => {
    const relPath = input.path ?? path.join("data", "product.json");
    const dataPath = path.join(__dirname, "..", "..", relPath);
    const raw: RawProductInput = JSON.parse(
      fs.readFileSync(dataPath, "utf-8")
    );
    return raw;
  },
  {
    name: "load_raw_product",
    description:
      "Load the raw product JSON from disk. Defaults to data/product.json at the project root.",
    schema: z.object({
      path: z
        .string()
        .describe(
          "Optional relative path from the project root to the product JSON file."
        )
        .optional(),
    }),
  }
);

const parseProduct = tool(
  async (input: { raw: RawProductInput }) => {
    const parser = new ProductParserAgent();
    const product = await parser.run(input.raw, {});
    return product;
  },
  {
    name: "parse_product",
    description:
      "Parse the structured raw product input into a typed Product object.",
    schema: z.object({
      raw: z.object({
        "Product Name": z.string(),
        "Concentration": z.string(),
        "Skin Type": z.string(),
        "Key Ingredients": z.string(),
        "Benefits": z.string(),
        "How to Use": z.string(),
        "Side Effects": z.string(),
        "Price": z.string(),
      }),
    }),
  }
);

const generateQuestions = tool(
  async (input: { product: Product }) => {
    const agent = new QuestionGenerationAgent();
    const questions = await agent.run(input.product, {});
    return questions;
  },
  {
    name: "generate_questions",
    description:
      "Generate end-user-friendly questions about the given product, grouped by category.",
    schema: z.object({
      product: z.any(),
    }),
  }
);

const buildFaqPage = tool(
  async (input: {
    product: Product;
    questions: UserQuestion[];
    variant?: "basic" | "compact";
  }) => {
    const template =
      input.variant === "compact" ? faqCompactTemplate : faqTemplate;
    const agent = new FaqPageAgent(template);
    const faqPage = await agent.run(
      { product: input.product, questions: input.questions },
      {}
    );
    return faqPage;
  },
  {
    name: "build_faq_page",
    description:
      "Build an FAQ page JSON representation from a product and its user questions.",
    schema: z.object({
      product: z.any(),
      questions: z.array(
        z.object({
          id: z.string(),
          category: z.string(),
          question: z.string(),
        })
      ),
      variant: z.enum(["basic", "compact"]).optional(),
    }),
  }
);

const buildProductPage = tool(
  async (input: { product: Product }) => {
    const agent = new ProductPageAgent();
    const page = await agent.run(input.product, {});
    return page;
  },
  {
    name: "build_product_page",
    description:
      "Build a detailed product page JSON representation from a parsed Product.",
    schema: z.object({
      product: z.any(),
    }),
  }
);

const buildComparisonPage = tool(
  async (input: { product: Product }) => {
    const agent = new ComparisonPageAgent();
    const page = await agent.run({ productA: input.product }, {});
    return page;
  },
  {
    name: "build_comparison_page",
    description:
      "Build a comparison page JSON representation between the main product and a fictional competitor.",
    schema: z.object({
      product: z.any(),
    }),
  }
);

const writeOutputFiles = tool(
  async (input: {
    faqPage: FAQPage;
    productPage: ProductPage;
    comparisonPage: ComparisonPage;
  }) => {
    const outDir = path.join(__dirname, "..", "..", "output");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    fs.writeFileSync(
      path.join(outDir, "faq.json"),
      JSON.stringify(input.faqPage, null, 2),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(outDir, "product_page.json"),
      JSON.stringify(input.productPage, null, 2),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(outDir, "comparison_page.json"),
      JSON.stringify(input.comparisonPage, null, 2),
      "utf-8"
    );

    return {
      outputDir: outDir,
    };
  },
  {
    name: "write_output_files",
    description:
      "Persist the generated FAQ, product, and comparison pages to JSON files on disk.",
    schema: z.object({
      faqPage: z.any(),
      productPage: z.any(),
      comparisonPage: z.any(),
    }),
  }
);

interface ContentAgentInput {
  path?: string;
}

interface ContentAgentOutput {
  faqPage: FAQPage;
  productPage: ProductPage;
  comparisonPage: ComparisonPage;
}

const pipeline = RunnableSequence.from<ContentAgentInput, ContentAgentOutput>([
  // 1. Load raw product from disk
  RunnableLambda.from(async (input: ContentAgentInput) => {
    const raw = (await loadRawProduct.invoke({ path: input.path })) as RawProductInput;
    return { raw };
  }),
  // 2. Parse into structured Product
  RunnableLambda.from(async ({ raw }: { raw: RawProductInput }) => {
    const product = (await parseProduct.invoke({ raw })) as Product;
    return { product };
  }),
  // 3. Generate user questions
  RunnableLambda.from(async ({ product }: { product: Product }) => {
    const questions = (await generateQuestions.invoke({
      product,
    })) as UserQuestion[];
    return { product, questions };
  }),
  // 4. Build all pages
  RunnableLambda.from(
    async ({
      product,
      questions,
    }: {
      product: Product;
      questions: UserQuestion[];
    }) => {
      const faqPage = (await buildFaqPage.invoke({
        product,
        questions,
        variant: "basic",
      })) as FAQPage;

      const productPage = (await buildProductPage.invoke({
        product,
      })) as ProductPage;

      const comparisonPage = (await buildComparisonPage.invoke({
        product,
      })) as ComparisonPage;

      return { faqPage, productPage, comparisonPage };
    }
  ),
  // 5. Persist JSON files and return structured output
  RunnableLambda.from(async (pages: ContentAgentOutput) => {
    await writeOutputFiles.invoke(pages);
    return pages;
  }),
]);

export function createContentAgent() {
  return pipeline;
}
