
import type { LucideIcon } from 'lucide-react';
import {
  User,
  FileText,
  ListChecks,
  ListOrdered,
  Bug,
  LayoutGrid,
  GitCompareArrows,
  BrainCircuit,
  MessageCircleQuestion,
  Anchor,
  Workflow, 
  Wrench, 
  Filter 
} from 'lucide-react';

export interface PromptParameter {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  defaultValue?: string;
  placeholder?: string;
  rows?: number; // for textarea
}

export interface PromptStrategy {
  id: string;
  name: string;
  description: string; // Full purpose/description
  shortDescription: string; // Short description for cards
  template: string;
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
const extractParameters = (template: string): PromptParameter[] => {
  const regex = /\$\{(\w+)\}/g;
  let match;
  const params: PromptParameter[] = [];
  const seenParams = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    const paramName = match[1];
    if (!seenParams.has(paramName)) {
      const label = paramName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      // A more robust check for textarea type based on common keywords in param names
      const textareaKeywords = ['code', 'summary', 'description', 'bullets', 'explanation', 'input', 'instruction', 'requirements', 'template', 'json', 'text', 'context', 'error', 'output', 'goal', 'example', 'content', 'snippet', 'refactor', 'style', 'strategy', 'notes', 'function', 'behavior', 'feature'];
      const isTextarea = textareaKeywords.some(keyword => paramName.toLowerCase().includes(keyword));
      
      params.push({
        name: paramName,
        label: label,
        type: isTextarea ? 'textarea' : 'text',
        placeholder: `Enter ${label.toLowerCase()}`,
        rows: isTextarea ? 5 : undefined, // Default 5 rows for textareas
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
    const exampleValue = param.type === 'textarea'
      ? `Example multi-line content for ${param.label.toLowerCase()}.\nFor instance, if this is code:\nfunction hello() {\n  console.log("Hello, World!");\n}`
      : `example_${param.name.replace(/\s+/g, '_').toLowerCase()}`;
    inputs[param.name] = exampleValue;
    const regex = new RegExp(`\\$\\{${param.name}\\}`, 'g');
    output = output.replace(regex, exampleValue);
  });

  return { inputs, output };
};


const strategiesInput = [
  {
    jsonId: 1,
    name: "Role Prompting",
    templateFromUser: "You are a senior {language} developer. Review this function for {goal}: {function_code}",
    purpose: "Simulate expert-level code review, debugging, or refactoring.",
    shortDescription: "Simulate a specific role (e.g., senior developer) to guide the AI's response style and focus.",
    icon: User,
    category: "Persona",
    imagePlaceholderKeywords: "expert persona"
  },
  {
    jsonId: 2,
    name: "Explicit Context Setup",
    templateFromUser: "Here's the problem context: {problem_summary}. The relevant code is: {code_snippet}. It should achieve {expected_behavior}, but instead it's exhibiting {factual_behavior}. Can you identify why and suggest a fix?",
    purpose: "Frame the problem clearly with all necessary context to avoid generic, surface-level responses and get targeted solutions.",
    shortDescription: "Clearly define problem context, relevant code, and desired vs. actual behavior for targeted fixes.",
    icon: FileText,
    category: "Problem Framing",
    imagePlaceholderKeywords: "clear problem"
  },
  {
    jsonId: 3,
    name: "Input/Output Examples (Few-shot)",
    templateFromUser: "Task: {task_description}\nExample 1:\nInput: {example_input_1}\nOutput: {example_output_1}\n\nExample 2:\nInput: {example_input_2}\nOutput: {example_output_2}\n\nNow, for the following input, provide the output:\nInput: {actual_input}\nOutput:",
    purpose: "Guide the assistant by showing intent through a few examples (few-shot learning), especially for pattern recognition or specific formatting.",
    shortDescription: "Provide a few input-output examples to guide the AI for tasks requiring specific formatting or pattern recognition.",
    icon: ListChecks,
    category: "Guidance",
    imagePlaceholderKeywords: "example driven"
  },
  {
    jsonId: 4,
    name: "Iterative Chaining / Step-by-Step",
    templateFromUser: "Let's build this step by step. \nFirst, {initial_task}. Provide the code for this step.\n(After reviewing) Next, based on the previous step, {second_task}. \n(After reviewing) Then, {third_task}, incorporating the previous results.",
    purpose: "Break larger, complex tasks into a sequence of smaller, manageable steps to avoid overwhelming the AI and to allow for refinement at each stage.",
    shortDescription: "Break down complex tasks into a sequence of manageable steps, allowing for review and refinement at each stage.",
    icon: Workflow,
    category: "Decomposition",
    imagePlaceholderKeywords: "stepwise process"
  },
  {
    jsonId: 5,
    name: "Debug with Simulation",
    templateFromUser: "Please simulate the execution of this function: {function_code} with the input {input_values}. Walk through it line by line. What are the values of key variables at each step? Where do you think the logic might break or lead to an unexpected result: {expected_result} vs {actual_or_potential_issue}?",
    purpose: "Get the assistant to simulate runtime behavior, trace variable states, and surface hidden bugs or logical flaws by thinking through execution paths.",
    shortDescription: "Ask the AI to simulate code execution line-by-line with given inputs to identify bugs or logical flaws.",
    icon: Bug,
    category: "Debugging",
    imagePlaceholderKeywords: "bug hunt"
  },
  {
    jsonId: 6,
    name: "Feature Blueprinting",
    templateFromUser: "I'm planning to build a new feature: {feature_name}. Key requirements are: {requirements_bullets}. The current tech stack includes: {tech_stack}. Please outline a high-level plan, suggest main components/modules, and scaffold the initial directory structure or key files. Explain your architectural choices.",
    purpose: "Kick off feature development by having the AI help with planning, scaffolding, and architectural considerations based on requirements.",
    shortDescription: "Use AI to plan and scaffold new features, including component outlines and architectural suggestions based on requirements.",
    icon: Wrench,
    category: "Scaffolding",
    imagePlaceholderKeywords: "project scaffold"
  },
  {
    jsonId: 7,
    name: "Code Refactor Guidance",
    templateFromUser: "Please refactor this code snippet: {code_to_refactor}. The main goal is to improve {specific_goal_eg_readability_performance}. Consider {specific_techniques_or_patterns_eg_functional_programming_SOLID_principles}. Use comments to explain significant changes made.",
    purpose: "Make AI refactors align with specific goals (e.g., readability, performance, adherence to patterns) rather than arbitrary changes.",
    shortDescription: "Guide AI refactoring towards specific goals like readability or performance, using defined techniques or patterns.",
    icon: GitCompareArrows,
    category: "Refactoring",
    imagePlaceholderKeywords: "code optimize"
  },
  {
    jsonId: 8,
    name: "Ask for Alternatives / Explore Styles",
    templateFromUser: "Here's a piece of code: {code_snippet}. Can you show me how to achieve the same result using a {style_1_eg_functional} approach? What would a {style_2_eg_recursive} version look like? Compare the pros and cons.",
    purpose: "Explore multiple implementation paths, coding styles, or alternative algorithms to expand understanding and find optimal solutions.",
    shortDescription: "Request the AI to provide multiple implementation styles or alternative solutions for a given piece of code.",
    icon: BrainCircuit,
    category: "Exploration",
    imagePlaceholderKeywords: "solution options"
  },
  {
    jsonId: 9,
    name: "Rubber Ducking / Explain & Verify",
    templateFromUser: "I'm trying to understand this function: {function_to_explain}. My current understanding is: {your_explanation}. Could you verify if my understanding is correct? Am I missing any edge cases or potential issues? Does this explanation reveal any bugs in the code itself?",
    purpose: "Use the AI as a 'rubber duck' to articulate your understanding, allowing it to challenge assumptions, spot inconsistencies, or identify flaws in your logic or the code.",
    shortDescription: "Explain your understanding of code to the AI, asking it to verify, find flaws, or identify missed edge cases.",
    icon: MessageCircleQuestion,
    category: "Validation",
    imagePlaceholderKeywords: "logic check"
  },
  {
    jsonId: 10,
    name: "Constraint Anchoring",
    templateFromUser: "Generate code for {task_description}. Important constraints: must use {specific_libraries_or_versions}, must avoid {disallowed_patterns_or_functions}, and should optimize for {optimization_goal_eg_memory_cpu}. The target environment is {environment_details}. Here's some existing relevant code, if any: {existing_code_context}",
    purpose: "Prevent the AI from overreaching, using deprecated methods, or introducing incompatible patterns by clearly stating constraints, allowed tools, and optimization targets.",
    shortDescription: "Set specific constraints (libraries, patterns to avoid, optimization goals) to guide AI output and prevent unwanted results.",
    icon: Filter,
    category: "Constraints",
    imagePlaceholderKeywords: "guideline focus"
  }
];


export const PROMPT_STRATEGIES: PromptStrategy[] = strategiesInput.map(item => {
  // Convert {param} to ${param} for template
  const template = item.templateFromUser.replace(/\{(\w+)\}/g, (match, p1) => `\${${p1}}`);
  const parameters = extractParameters(template);
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

