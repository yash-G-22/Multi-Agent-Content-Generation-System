export interface AgentContext {
  [key: string]: unknown;
}

export interface Agent<I = unknown, O = unknown> {
  name: string;
  run(input: I, context: AgentContext): Promise<O>;
}
