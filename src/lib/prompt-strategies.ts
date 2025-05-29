
import type { LucideIcon } from 'lucide-react';
import {
  User,
  ListChecks, // For Few-shot if we re-add, or a general "examples" icon
  ListOrdered, // Step-by-step, also good for Iterative Chaining
  Bug,
  Wrench, // Feature Blueprinting
  GitCompareArrows,
  BrainCircuit,
  HelpingHand, // Rubber Ducking
  Filter, // Constraint Anchoring
  BookCopy, // Explicit Context Setup (if re-added)
  Workflow, // Iterative Chaining (if re-added)
  Lightbulb, // Generate Knowledge (general idea icon)
  DatabaseZap, // Retrieval-Augmented Generation (general idea icon)
  Repeat, // Iterative Refinement (general idea icon)
  Users, // Ensemble Methods (general idea icon)
} from 'lucide-react';

export interface PromptParameter {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
  rows?: number; // for textarea
  isConfigurable?: boolean; // True if this param should appear on Settings page
}

export interface PromptStrategy {
  id: string;
  name: string;
  description: string; // Full purpose/description (from "purpose" in user JSON)
  shortDescription: string; // Short description for cards
  template: string; // (from "description" in user JSON, with {vars} -> ${vars})
  parameters: PromptParameter[];
  example: {
    inputs: Record<string, string>;
    output: string;
  };
  icon?: LucideIcon;
  category?: string;
  imagePlaceholderKeywords: string;
}

// Helper function to extract parameters from a template string
const extractParameters = (template: string): Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>[] => {
  const regex = /\$\{(\w+)\}/g;
  let match;
  const params: Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>[] = [];
  const seenParams = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    const paramName = match[1];
    if (!seenParams.has(paramName)) {
      const label = paramName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const textareaKeywords = ['code', 'summary', 'description', 'bullets', 'explanation', 'input', 'instruction', 'requirements', 'template', 'json', 'text', 'context', 'error', 'output', 'goal', 'example', 'content', 'snippet', 'refactor', 'style', 'strategy', 'notes', 'function', 'behavior', 'feature', 'history', 'query', 'criteria', 'response', 'task', 'log', 'issue', 'script', 'detail', 'problem', 'solution', 'payload', 'data', 'config', 'report', 'message', 'comment', 'feedback', 'request', 'test', 'scenario', 'guideline', 'prompt'];
      const isTextarea = textareaKeywords.some(keyword => paramName.toLowerCase().includes(keyword)) || paramName.toLowerCase().endsWith('s') || paramName.toLowerCase().includes('list') || paramName.toLowerCase().includes('text');

      params.push({
        name: paramName,
        label: label,
        type: isTextarea ? 'textarea' : 'text',
        placeholder: `Enter ${label.toLowerCase()}`,
        rows: isTextarea ? 5 : undefined,
      });
      seenParams.add(paramName);
    }
  }
  return params;
};

// Helper function to generate example inputs and output
const generateExample = (template: string, parameters: PromptParameter[]): { inputs: Record<string, string>; output: string } => {
  const inputs: Record<string, string> = {};
  let output = template;

  parameters.forEach(param => {
    let exampleValue = param.defaultValue || `example_${param.name.replace(/\s+/g, '_').toLowerCase()}`;
    if (param.type === 'textarea' && !param.defaultValue) {
      exampleValue = `Example multi-line content for ${param.label.toLowerCase()}.\nFor instance, if this is code:\nfunction hello() {\n  console.log("Hello, World!");\n}`;
    } else if (!param.defaultValue && param.options && param.options.length > 0) {
      exampleValue = param.options[0];
    }
    
    inputs[param.name] = exampleValue;
    const regex = new RegExp(`\\$\\{${param.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}`, 'g');
    output = output.replace(regex, exampleValue);
  });

  return { inputs, output };
};

interface StrategyInputItem {
  jsonId: number;
  name: string;
  templateFromUser: string; // "description" from user JSON in previous context
  purpose: string; // "purpose" from user JSON in previous context
  shortDescription: string;
  icon: LucideIcon;
  category: string;
  imagePlaceholderKeywords: string;
  configurableParameterNames?: string[];
  parameterDefaults?: Record<string, string>; // For setting defaultValues for specific params
}

const strategiesInput: StrategyInputItem[] = [
  {
    jsonId: 1,
    name: "Role Prompting",
    templateFromUser: "You are a senior {language} developer. Review this function for {goal}: {function_code}",
    purpose: "Simulate expert-level code review, debugging, or refactoring.",
    shortDescription: "Simulate a specific role to guide AI.",
    icon: User,
    category: "Persona",
    imagePlaceholderKeywords: "expert persona",
    configurableParameterNames: ["language", "goal"],
    parameterDefaults: { language: "TypeScript", goal: "clarity and potential bugs" }
  },
  // { // Removed 2nd strategy: Explicit Context Setup
  //   jsonId: 2,
  //   name: "Explicit Context Setup",
  //   templateFromUser: "Here's the problem: {summary}. The code is below: {code_snippet}. It should do {expected_behavior}, but instead it's doing {factual_behavior}. Why?",
  //   purpose: "Frame the problem clearly to avoid generic, surface-level responses.",
  //   shortDescription: "Clearly define problem context for targeted fixes.",
  //   icon: BookCopy,
  //   category: "Problem Framing",
  //   imagePlaceholderKeywords: "clear context",
  //   configurableParameterNames: ["expected_behavior", "factual_behavior"],
  //   parameterDefaults: { expected_behavior: "return the sum of two numbers", factual_behavior: "returning NaN" }
  // },
  // { // Removed 3rd strategy: Input/Output Examples (Few-shot)
  //   jsonId: 3,
  //   name: "Input/Output Examples (Few-shot)",
  //   templateFromUser: "Task: {task_description}\nExample 1:\nInput: {example_input_1}\nOutput: {example_output_1}\n\nExample 2:\nInput: {example_input_2}\nOutput: {example_output_2}\n\nNow, for the following input, provide the output:\nInput: {actual_input}\nOutput:",
  //   purpose: "Guide the assistant by showing intent through a few examples (few-shot learning).",
  //   shortDescription: "Provide input-output examples to guide AI.",
  //   icon: ListChecks,
  //   category: "Guidance",
  //   imagePlaceholderKeywords: "example driven",
  //   configurableParameterNames: [],
  //   parameterDefaults: { task_description: "Translate English to French."}
  // },
  // { // Removed 4th strategy: Iterative Chaining
  //   jsonId: 4,
  //   name: "Iterative Chaining",
  //   templateFromUser: "First, {initial_task}. (AI provides output for step 1) \nNext, based on the previous output, {second_task}. (AI provides output for step 2)\nThen, {third_task}.",
  //   purpose: "Break larger tasks into steps to avoid overwhelming or vague prompts.",
  //   shortDescription: "Break tasks into smaller, manageable steps.",
  //   icon: Workflow,
  //   category: "Decomposition",
  //   imagePlaceholderKeywords: "stepwise process",
  //   configurableParameterNames: [],
  //   parameterDefaults: { initial_task: "Outline the main sections of a README file."}
  // },
  {
    jsonId: 5,
    name: "Debug with Simulation",
    templateFromUser: "Simulate this function: {function_code} with input {input_values}. Walk through it line by line. What are the variable values at each step? Where might it break given expected output {expected_result}?",
    purpose: "Get the assistant to simulate runtime behavior and surface hidden bugs.",
    shortDescription: "Simulate code execution to find bugs.",
    icon: Bug,
    category: "Debugging",
    imagePlaceholderKeywords: "bug hunt",
    configurableParameterNames: ["expected_result"],
    parameterDefaults: { expected_result: "true" }
  },
  {
    jsonId: 6,
    name: "Feature Blueprinting",
    templateFromUser: "I'm building {feature_name}. Requirements: {requirements_bullets}. Using: {tech_stack}. Please scaffold the initial component(s) and explain your architectural choices.",
    purpose: "Kick off feature development with AI-led planning and scaffolding.",
    shortDescription: "Plan and scaffold new features with AI.",
    icon: Wrench,
    category: "Scaffolding",
    imagePlaceholderKeywords: "project scaffold",
    configurableParameterNames: ["tech_stack"],
    parameterDefaults: { feature_name: "a user authentication flow", tech_stack: "Next.js, TypeScript, and Tailwind CSS" }
  },
  {
    jsonId: 7,
    name: "Code Refactor Guidance",
    templateFromUser: "Refactor this code: {code_to_refactor} to improve {goal_eg_readability_performance}, using {techniques_eg_SOLID_principles}. Explain changes with comments.",
    purpose: "Make AI refactors align with your goals, not arbitrary changes.",
    shortDescription: "Guide AI refactoring towards specific goals.",
    icon: GitCompareArrows,
    category: "Refactoring",
    imagePlaceholderKeywords: "code optimize",
    configurableParameterNames: ["goal_eg_readability_performance", "techniques_eg_SOLID_principles"],
    parameterDefaults: { goal_eg_readability_performance: "readability and maintainability", techniques_eg_SOLID_principles: "SOLID principles" }
  },
  {
    jsonId: 8,
    name: "Ask for Alternatives",
    templateFromUser: "For this code: {code_snippet}, show how to achieve the same result using a {style_1_eg_functional} approach. What would a {style_2_eg_recursive} version look like? Compare pros/cons.",
    purpose: "Explore multiple implementation paths and expand your toolbox.",
    shortDescription: "Request multiple implementation styles.",
    icon: BrainCircuit,
    category: "Exploration",
    imagePlaceholderKeywords: "solution options",
    configurableParameterNames: ["style_1_eg_functional", "style_2_eg_recursive"],
    parameterDefaults: { style_1_eg_functional: "functional programming", style_2_eg_recursive: "recursive" }
  },
  {
    jsonId: 9,
    name: "Rubber Ducking",
    templateFromUser: "My understanding of this function: {function_to_explain} is: {your_explanation}. Am I missing anything? Does this reveal bugs?",
    purpose: "Let the AI challenge your understanding and spot inconsistencies.",
    shortDescription: "Explain code to AI for verification and insights.",
    icon: HelpingHand,
    category: "Validation",
    imagePlaceholderKeywords: "logic check",
    configurableParameterNames: [],
    parameterDefaults: {}
  },
  {
    jsonId: 10,
    name: "Constraint Anchoring",
    templateFromUser: "Generate code for {task_description}. Constraints: use {specific_libraries_versions}, avoid {disallowed_patterns}, optimize for {optimization_goal_eg_memory}. Target environment: {environment_details}. Existing code context: {existing_code_context}",
    purpose: "Prevent the AI from overreaching or introducing incompatible patterns.",
    shortDescription: "Set specific constraints to guide AI output.",
    icon: Filter,
    category: "Constraints",
    imagePlaceholderKeywords: "guideline focus",
    configurableParameterNames: ["specific_libraries_versions", "disallowed_patterns", "optimization_goal_eg_memory", "environment_details"],
    parameterDefaults: { optimization_goal_eg_memory: "memory usage", environment_details: "a web browser" }
  }
];

export const PROMPT_STRATEGIES: PromptStrategy[] = strategiesInput.map(item => {
  // Convert {param} to ${param} for template
  const template = item.templateFromUser.replace(/\{(\w+)\}/g, (match, p1) => `\${${p1}}`);
  
  const extractedParams = extractParameters(template);
  const parameters: PromptParameter[] = extractedParams.map(p => ({
    ...p,
    isConfigurable: item.configurableParameterNames?.includes(p.name) ?? false,
    defaultValue: item.parameterDefaults?.[p.name] || '',
  }));

  const example = generateExample(template, parameters);
  const id = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return {
    id,
    name: item.name,
    description: item.purpose,
    shortDescription: item.shortDescription,
    template,
    parameters,
    example,
    icon: item.icon,
    category: item.category,
    imagePlaceholderKeywords: item.imagePlaceholderKeywords,
  };
});
