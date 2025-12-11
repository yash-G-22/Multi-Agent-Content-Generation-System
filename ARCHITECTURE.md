# Agentic Content Generation System (LangChain-based)

## Overview

This project generates three JSON-structured pages for a skincare product:

- `faq.json` – grouped FAQ-style Q&A
- `product_page.json` – product hero + details
- `comparison_page.json` – comparison versus a fictional competitor

The system is implemented as a **LangChain-based agent pipeline** with clear agents, tools, and reusable logic blocks. It does **not** depend on any external AI API keys; all behavior is deterministic and local.

---

## Components

### Domain models (`src/types.ts`)

Defines core types:

- **Product**, **RawProductInput**
- **UserQuestion**, **FAQPage**, **ProductPage**, **ComparisonPage**
- **TemplateDefinition** and related types

These types drive both runtime behavior and the JSON output schemas.

### Reusable content blocks (`src/blocks/contentBlocks.ts`)

Pure functions that encapsulate content logic:

- `generateQuestionsBlock(product)` – builds categorized user questions
- `buildFAQItemsBlock(product, questions)` – maps questions to answers
- `summarizeProductForHero(product)` – hero section structure
- `buildComparisonSummariesBlock(productA, productB)`
- `buildComparisonPointsBlock(summaryA, summaryB)`

These are **reusable logic blocks** used by multiple agents.

### Page templates (`src/templates/*.ts`)

Template definitions describing required fields and simple rules:

- `faqTemplate` and `faqCompactTemplate` for FAQ pages

Templates are consumed by page agents to shape their output.

### Domain agents (`src/agents/*.ts`)

Each agent has a single responsibility and operates on typed inputs/outputs:

- `ProductParserAgent` – parses `RawProductInput` → `Product`
- `QuestionGenerationAgent` – generates `UserQuestion[]` for a `Product`
- `FaqPageAgent` – converts product + questions → `FAQPage` (using a template)
- `ProductPageAgent` – converts `Product` → `ProductPage`
- `ComparisonPageAgent` – builds `ComparisonPage` between the product and a fictional competitor

All agents are **pure/async functions over typed data** and can be reused independently of orchestration.

---

## LangChain-based orchestration

### Tools (`src/agentic/ContentAgent.ts`)

LangChain tools (from `@langchain/core/tools`) wrap domain agents and IO:

- `load_raw_product` – reads `data/product.json` from disk
- `parse_product` – calls `ProductParserAgent`
- `generate_questions` – calls `QuestionGenerationAgent`
- `build_faq_page` – calls `FaqPageAgent` with a selected FAQ template
- `build_product_page` – calls `ProductPageAgent`
- `build_comparison_page` – calls `ComparisonPageAgent`
- `write_output_files` – writes the three page JSON files to `/output`

Each tool has:

- A **name** and **description**
- A **Zod schema** describing its structured input
- Deterministic behavior with fully typed outputs

### Content agent runnable (`src/agentic/ContentAgent.ts`)

The main orchestration is a **LangChain `RunnableSequence`**:

1. **Load** raw product JSON (tool: `load_raw_product`)
2. **Parse** into `Product` (tool: `parse_product`)
3. **Generate questions** (tool: `generate_questions`)
4. **Build pages** (tools: `build_faq_page`, `build_product_page`, `build_comparison_page`)
5. **Write JSON outputs** (tool: `write_output_files`)

This pipeline is defined as:

- A `RunnableSequence<ContentAgentInput, ContentAgentOutput>`
- A series of `RunnableLambda` steps that call tools and pass typed state forward

`createContentAgent()` returns this runnable, which acts as the **top-level agent** of the system.

### Orchestrator (`src/orchestrator.ts`)

`Orchestrator` is a thin shell that delegates to the LangChain agent:

1. Creates the content agent via `createContentAgent()`
2. Invokes it with an optional `{ path?: string }` input (empty input defaults to `data/product.json`)
3. Logs a concise confirmation and the final JSON-structured result

### Entry point (`src/index.ts`)

Runs the orchestrator, handling errors and printing a final success message:

- `npm run build && npm start` will:
  - Execute the LangChain pipeline
  - Produce `output/faq.json`, `output/product_page.json`, `output/comparison_page.json`

---

## JSON-structured outputs

All final artifacts are plain JSON files conforming to the TypeScript types in `src/types.ts`:

- **FAQ** – `FAQPage`
- **Product page** – `ProductPage`
- **Comparison page** – `ComparisonPage`

Because agents and tools operate on typed objects and the final step is `JSON.stringify`, outputs are guaranteed to be fully structured JSON.

---

## Extensibility

- **New tools**: wrap new agents, data sources, or exporters using LangChain `tool` and add them to the pipeline.
- **Alternative templates**: define new `TemplateDefinition` instances and pass them into page agents.
- **Pluggable models**: if desired later, an actual LLM (e.g., via LangChain’s model integrations) can replace or augment the deterministic `QuestionGenerationAgent` while keeping the same tool and pipeline structure.
