# Multi-Agent Content Generation System for GlowBoost Product Data

## Problem Statement

Given a small, constrained product dataset for a skincare product, design and implement a modular **agentic automation system** that:

- Parses the raw product data into a clean internal model.
- Automatically generates at least 15 categorized user questions.
- Uses a custom template system and reusable content logic blocks.
- Assembles three structured content pages:
  - FAQ Page
  - Product Description Page
  - Comparison Page (GlowBoost vs. fictional Product B)
- Outputs all pages as clean, machine-readable JSON.

The system must be modular, agent-based, and not a single monolithic script or simple GPT wrapper.

---

## Solution Overview

The solution is a TypeScript-based CLI system composed of:

- **Agents** with single responsibilities and explicit input/output types.
- **Reusable content logic blocks** (pure functions) that transform the internal product model into content elements (questions, answers, summaries, comparison points).
- **Templates** that define the structure, fields, rules, and required blocks for each page type.
- A central **orchestrator** that wires agents into an automation flow and writes the final JSON outputs.

The pipeline takes a single product JSON (`data/product.json`) as input and produces:

- `output/faq.json`
- `output/product_page.json`
- `output/comparison_page.json`

All intermediate decisions are encoded in code, not hidden prompts.

---

## Scopes & Assumptions

- **Scope**
  - Supports a single product at a time, but the architecture allows more products with minimal changes
  - Generates comprehensive content including 31 categorized questions
  - Focuses on structured content generation for e-commerce products
  - Handles various content types: FAQs, product pages, and comparisons

- **Assumptions**
  - No external research or domain knowledge is added for the primary product. Only the provided fields are used
  - A fictional Product B is constructed as structured data within the system for the comparison page
  - JSON outputs must be consumable by downstream systems (e.g., CMS, frontend)
  - Questions are categorized into: informational, usage, safety, purchase, and comparison
  - All content is generated based on the provided product data structure

---

## Content Coverage

### 1. Question Distribution

```mermaid
pie title Question Distribution by Category
    "Informational (29%)" : 9
    "Usage (26%)" : 8
    "Safety (19%)" : 6
    "Purchase (16%)" : 5
    "Comparison (10%)" : 3
```

### Sample Questions by Category

#### 1. Informational
- What is [product]?
- What are the key ingredients in [product]?
- What are the main benefits of using [product]?
- Which skin types is [product] suitable for?
- What is the Vitamin C concentration in [product]?
- How long does it take to see results with [product]?
- What is the shelf life of [product] after opening?
- How should I store [product] to maintain its potency?
- Does [product] need to be refrigerated?

#### 2. Usage
- How should I use [product] in my routine?
- When during the day should I apply [product]?
- How many drops of [product] should I use at a time?
- Should I apply sunscreen after using [product]?
- Can I use [product] with other active ingredients like retinol or AHAs?
- Do I need to shake [product] before use?
- What visible changes can I expect from using [product]?
- How long will the results from using [product] typically last?

#### 3. Safety
- Are there any side effects of using [product]?
- Is [product] suitable for sensitive skin?
- What should I do if I feel tingling after applying [product]?
- Can I use [product] during pregnancy or while breastfeeding?
- What should I do if [product] gets into my eyes?
- Can I use [product] if I have a Vitamin C allergy?

#### 4. Purchase
- What is the price of [product]?
- Is [product] a daily-use product or occasional treatment?
- What size options are available for [product]?
- Is there a money-back guarantee for [product]?
- Where can I buy authentic [product]?

#### 5. Comparison
- How does [product] compare to another Vitamin C serum?
- How does the concentration of [product] compare to other serums?
- What makes [product] different from other serums on the market?

## System Design

### Image Content

```mermaid
graph TD
    %% Image content nodes with simple styling
    A[System Architecture]
    B[Data Flow]
    C[Agent Interactions]
    D[UI Mockups]
    
    %% Connections
    A --> B --> C --> D
    
    %% Add note
    Note[Note: These are placeholder descriptions for image content]
    D --> Note
```


### 1. Agent Orchestration Flow (DAG)

```mermaid
graph TD
    %% Simplified DAG for GitHub compatibility
    Start([Start])
    
    %% Input and Parsing
    A[Raw Product Data] -->|Input| B[Product Parser Agent]
    B --> C[Normalized Product]
    
    %% Question Generation
    C --> D[Question Generation Agent]
    D --> E[User Questions]
    
    %% Parallel Processing
    C --> F[FAQ Agent]
    C --> G[Product Page Agent]
    C --> H[Comparison Agent]
    E --> F
    
    %% Outputs
    F --> I[FAQ Content]
    G --> J[Product Page Content]
    H --> K[Comparison Content]
    
    %% Legend
    subgraph Legend
        direction TB
        StartNode([Start/End])
        Agent[Agent]
        Data[(Data)]
        Output[Output]
    end
```

### 2. High-Level Architecture

```mermaid
graph TB
    subgraph Input
        A[Raw Product Data] --> B[Product Parser Agent]
    end
    
    subgraph Content Generation
        B --> C[Normalized Product]
        C --> D[Question Generation Agent]
        D --> E[User Questions]
        
        subgraph Content Agents
            F[FAQ Agent] -->|Uses| E
            G[Product Page Agent]
            H[Comparison Agent]
        end
        
        C --> F
        C --> G
        C --> H
        
        F --> I[Structured FAQ Content]
        G --> J[Product Page Content]
        H --> K[Comparison Content]
    end
    
    subgraph Output
        I --> L[JSON Output Files]
        J --> L
        K --> L
    end
    
    style Input fill:#f9f,stroke:#333,stroke-width:2px
    style Content\ Generation fill:#bbf,stroke:#333,stroke-width:2px
    style Output fill:#9f9,stroke:#333,stroke-width:2px
```

### 2. System Components

```mermaid
classDiagram
    class ProductParserAgent {
        +parse(raw: RawProductInput): Product
    }
    
    class QuestionGenerationAgent {
        +generateQuestions(product: Product): UserQuestion[]
    }
    
    class FaqPageAgent {
        +generateFAQ(product: Product, questions: UserQuestion[]): FAQPage
    }
    
    class ProductPageAgent {
        +generatePage(product: Product): ProductPage
    }
    
    class ComparisonAgent {
        +compare(productA: Product): ComparisonPage
    }
    
    class Orchestrator {
        -agents: Agent[]
        +run(): void
        -saveOutputs()
    }
    
    Orchestrator --> ProductParserAgent
    Orchestrator --> QuestionGenerationAgent
    Orchestrator --> FaqPageAgent
    Orchestrator --> ProductPageAgent
    Orchestrator --> ComparisonAgent
    
    FaqPageAgent ..> QuestionGenerationAgent : uses
    ProductPageAgent ..> ProductParserAgent : uses
```

### 3. Content Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant Orchestrator
    participant Parser
    participant QuestionGen
    participant FAQAgent
    participant ProductAgent
    participant CompareAgent
    
    User->>CLI: Run content generation
    CLI->>Orchestrator: Execute pipeline
    
    Orchestrator->>Parser: Parse product data
    Parser-->>Orchestrator: Normalized Product
    
    Orchestrator->>QuestionGen: Generate questions
    QuestionGen-->>Orchestrator: List of questions
    
    par Parallel Processing
        Orchestrator->>FAQAgent: Generate FAQ page
        FAQAgent-->>Orchestrator: FAQ content
        
        Orchestrator->>ProductAgent: Generate product page
        ProductAgent-->>Orchestrator: Product page content
        
        Orchestrator->>CompareAgent: Generate comparison
        CompareAgent-->>Orchestrator: Comparison content
    end
    
    Orchestrator->>Orchestrator: Save all outputs
    Orchestrator-->>CLI: Success message
    CLI-->>User: Generation complete
```

### 4. Data Flow Diagram

```mermaid
flowchart LR
    %% Define node styles
    classDef input fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#01579b
    classDef process fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#1b5e20
    classDef output fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#e65100
    classDef data fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px,color:#4a148c
    
    %% Define nodes
    A[Raw Product Data]:::input --> B[Product Parser Agent]:::process
    B --> C[Normalized Product]:::data
    C --> D[Question Generation Agent]:::process
    D --> E[User Questions]:::data
    C --> F[FAQ Agent]:::process
    E --> F
    F --> G[Structured FAQ Content]:::data
    C --> H[Product Page Agent]:::process
    H --> I[Product Page Content]:::data
    C --> J[Comparison Agent]:::process
    J --> K[Comparison Content]:::data
    G --> L[Output Files]:::output
    I --> L
    K --> L
    
    %% Add legend
    subgraph Legend
        direction TB
        Input[Input]:::input
        Process[Process]:::process
        Data[Data]:::data
        Output[Output]:::output
    end
    class B,D,E,F,G process
    class C,H,I,J data
```

### 5. Deployment Architecture

```mermaid
graph TD
    %% Simplified Deployment Architecture for GitHub
    
    subgraph "Local Development"
        A[Developer Machine] -->|Edit| B[Source Code]
        B -->|Run| C[CLI Tool]
        C -->|Generate| D[Output Files]
    end
    
    subgraph "CI/CD Pipeline"
        E[GitHub Actions] -->|On Push| F[Run Tests]
        F -->|Success| G[Build Package]
        G -->|Publish| H[NPM Registry]
    end
    
    subgraph "Production"
        I[Server] -->|Pull| H
        I -->|Run| J[Content Generation]
        J -->|Output| K[CDN/Storage]
    end
    
    %% Add simple legend
    subgraph " "
        direction LR
        Local[Local Dev]:::local
        CICD[CI/CD]:::cicd
        Prod[Production]:::prod
    end
    
    %% Simple styling that works in GitHub
    classDef local fill:#e6f3ff,stroke:#3399ff,color:#003366
    classDef cicd fill:#e6ffe6,stroke:#33cc33,color:#003300
    classDef prod fill:#fff2e6,stroke:#ff9933,color:#4d2600
    
    class A,B,C,D local
    class E,F,G,H cicd
    class I,J,K prod
```

### 1. Core Concepts

1. **Product Model**
   - `RawProductInput` mirrors the input dataset.
   - `Product` is the normalized internal model used by all agents and blocks.

2. **Agents**
   - Each agent:
     - Has a single responsibility.
     - Implements `Agent<I, O>` interface.
     - Communicates only through explicit inputs/outputs and a shared `AgentContext` (no hidden global state).

3. **Content Blocks**
   - Pure functions (no I/O, no context mutation).
   - Examples:
     - `generateQuestionsBlock(product)`
     - `buildFAQItemsBlock(product, questions)`
     - `summarizeProductForHero(product)`
     - `buildComparisonSummariesBlock(productA, productB)`
     - `buildComparisonPointsBlock(summaryA, summaryB)`

4. **Templates**
   - Encoded as `TemplateDefinition` objects.
   - Define:
     - `pageType` (faq, product, comparison)
     - `fields` and types
     - Optional `rules` (e.g., minQuestions)
     - `requiredBlocks` (dependencies on content blocks)

5. **Orchestrator**
   - Encapsulates the automation graph (pipeline).
   - No business logic; only coordinates agents and persists results.

---

### 2. Agent Responsibilities

1. **ProductParserAgent**
   - **Input:** `RawProductInput`
   - **Output:** `Product`
   - **Responsibility:** Normalize raw JSON fields into the internal product model (split lists, trim strings, etc.).

2. **QuestionGenerationAgent**
   - **Input:** `Product`
   - **Output:** `UserQuestion[]`
   - **Responsibility:** Use `generateQuestionsBlock` to produce at least 15 categorized questions (informational, usage, safety, purchase, comparison).

3. **FaqPageAgent**
   - **Input:** `{ product: Product; questions: UserQuestion[] }`
   - **Output:** `FAQPage`
   - **Responsibility:**
     - Map questions to answers using `buildFAQItemsBlock`.
     - Group Q&As by `category` into FAQ sections.

4. **ProductPageAgent**
   - **Input:** `Product`
   - **Output:** `ProductPage`
   - **Responsibility:**
     - Build hero section using `summarizeProductForHero`.
     - Assemble details (ingredients, benefits, usage, side-effects) into a structured page.

5. **ComparisonPageAgent**
   - **Input:** `{ productA: Product }`
   - **Output:** `ComparisonPage`
   - **Responsibility:**
     - Create a structured fictional Product B.
     - Use `buildComparisonSummariesBlock` and `buildComparisonPointsBlock` to generate comparison summaries and rows.

---

### 3. Automation Flow / Orchestration Graph

The system follows a **directed acyclic graph (DAG)** of agent invocations:

1. **Parse Product**
   - `ProductParserAgent`  
   `RawProductInput → Product`

2. **Generate Questions**
   - `QuestionGenerationAgent`  
   `Product → UserQuestion[]`

3. **Generate FAQ Page**
   - `FaqPageAgent`  
   `{ Product, UserQuestion[] } → FAQPage`

4. **Generate Product Page**
   - `ProductPageAgent`  
   `Product → ProductPage`

5. **Generate Comparison Page**
   - `ComparisonPageAgent`  
   `{ productA: Product } → ComparisonPage`

The **Orchestrator** executes these in order, collects results, and writes:

- `faq.json`
- `product_page.json`
- `comparison_page.json`

---

### 4. Reusable Logic & Extensibility

- All page agents depend on **blocks** instead of directly using raw product data.  
  This allows:
  - Reuse across agents (e.g., benefits block could be used on FAQ and product page).
  - Easy replacement or extension (e.g., plugging in an LLM-backed block while keeping the same template).

- **Templates** are data, not code.  
  New template variants (e.g., `faq-compact-v2`) can be defined by adding new `TemplateDefinition`s and swapping them in agents or orchestrator without rewriting the flow.

---

### 5. Content Generation Process

```mermaid
graph LR
    %% Define styles
    classDef process fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#0d47a1
    classDef data fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#1b5e20
    classDef output fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#e65100
    
    %% Process Flow
    A[1. Input Product Data] -->|JSON| B[2. Parse & Validate]:::process
    B --> C[3. Generate Questions]:::process
    C --> D[4. Create Content]:::process
    D --> E[5. Generate Output]:::process
    
    %% Data Flow
    B -->|Structured Data| C
    C -->|Questions| D
    D -->|Formatted Content| E
    
    %% Content Types
    subgraph Content Types
        D --> F[FAQ Page]:::data
        D --> G[Product Page]:::data
        D --> H[Comparison Page]:::data
    end
    
    %% Outputs
    E --> I[FAQ JSON]:::output
    E --> J[Product Page JSON]:::output
    E --> K[Comparison JSON]:::output
    
    %% Add legend
    subgraph Legend
        direction TB
        Process[Process]:::process
        Data[Data]:::data
        Output[Output]:::output
    end
```

### 6. Data & Output Structure

- All final outputs conform to TypeScript interfaces and are serialized as JSON.
- No free-form text pages; everything is structured into:
  - fields like `hero.title`, `details.skinTypes[]`, `sections[].items[]`.
- This ensures:
  - Machine readability.
  - Easy consumption by frontends, CMSs, or downstream services.
