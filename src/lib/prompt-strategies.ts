
import type { LucideIcon } from 'lucide-react';
import {
  Users,
  MessageSquare,
  TerminalSquare,
  Workflow,
  Bug,
  ClipboardList,
  Zap,
  GitCompareArrows,
  BrainCircuit,
  Target,
  FileText,
  ListOrdered,
  ListChecks,
  GitCommitVertical,
  LayoutGrid,
  Wrench,
  Lightbulb,
  MessageCircleQuestion,
  Filter,
  Anchor,
  Binary // Added Binary as a potential icon
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
  description: string;
  template: string;
  parameters: PromptParameter[];
  example: {
    inputs: Record<string, string>;
    output: string;
  };
  icon?: LucideIcon;
  category?: string;
}

const extractParameters = (template: string): PromptParameter[] => {
  const regex = /\{(\w+)\}/g;
  let match;
  const params: PromptParameter[] = [];
  const seenParams = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    const paramName = match[1];
    if (!seenParams.has(paramName)) {
      params.push({
        name: paramName,
        label: paramName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Convert snake_case to Title Case
        type: paramName.includes('code') || paramName.includes('summary') || paramName.includes('description') || paramName.includes('bullets') || paramName.includes('explanation') ? 'textarea' : 'text',
        placeholder: `Enter ${paramName.replace(/_/g, ' ')}`,
        rows: paramName.includes('code') || paramName.includes('summary') || paramName.includes('description') || paramName.includes('bullets') || paramName.includes('explanation') ? 4 : undefined,
      });
      seenParams.add(paramName);
    }
  }
  return params;
};

const generateExample = (template: string, parameters: PromptParameter[]): { inputs: Record<string, string>; output: string } => {
  const inputs: Record<string, string> = {};
  let output = template;

  parameters.forEach(param => {
    const exampleValue = param.type === 'textarea' ? `Example content for ${param.label.toLowerCase()}.` : `example_${param.name}`;
    inputs[param.name] = exampleValue;
    const regex = new RegExp(`\\{${param.name}\\}`, 'g');
    output = output.replace(regex, exampleValue);
  });

  return { inputs, output };
};

const newStrategiesData = [
  {
    jsonId: 1,
    name: "Role Prompting",
    templateContent: "You are a senior {language} developer. Review this function for {goal}.",
    descriptionContent: "Simulate expert-level code review, debugging, or refactoring",
    icon: Users,
    category: "Code Review"
  },
  {
    jsonId: 2,
    name: "Explicit Context Setup",
    templateContent: "Here's the problem: {summary}. The code is below. It should do {expected_behavior}, but instead it's doing {factual_behavior}. Why?",
    descriptionContent: "Frame the problem clearly to avoid generic, surface-level responses",
    icon: MessageSquare,
    category: "Debugging"
  },
  {
    jsonId: 3,
    name: "Input/Output Examples",
    templateContent: "This function should return {expected_output} when given {input}. Can you write or fix the code?",
    descriptionContent: "Guide the assistant by showing intent through examples",
    icon: TerminalSquare,
    category: "Code Generation"
  },
  {
    jsonId: 4,
    name: "Iterative Chaining",
    templateContent: "Let's break this down. First, {step1}. Next, {step2}. Then, {step3}.",
    descriptionContent: "Break larger tasks into steps to avoid overwhelming or vague prompts",
    icon: Workflow,
    category: "Task Breakdown"
  },
  {
    jsonId: 5,
    name: "Debug with Simulation",
    templateContent: "Please simulate the execution of the following code, walking through it line by line. For each significant step or loop iteration, state the current values of key variables. Identify potential points where it might break or behave unexpectedly.\n\n```\n{function_code}\n```",
    descriptionContent: "Get the assistant to simulate runtime behavior and surface hidden bugs",
    icon: Bug,
    category: "Debugging"
  },
  {
    jsonId: 6,
    name: "Feature Blueprinting",
    templateContent: "I'm building {feature}. Requirements:\n{bullets}\n\nUsing: {tech_stack}.\n\nPlease scaffold the initial component and explain your choices.",
    descriptionContent: "Kick off feature development with AI-led planning and scaffolding",
    icon: ClipboardList,
    category: "Scaffolding"
  },
  {
    jsonId: 7,
    name: "Code Refactor Guidance",
    templateContent: "Please refactor the following code to improve {goal}. Focus on aspects like {examples_for_goal}. Ensure you use comments to explain the key changes made and their benefits.\n\n```\n{code_to_refactor}\n```",
    descriptionContent: "Make AI refactors align with your goals, not arbitrary changes",
    icon: Zap,
    category: "Code Improvement"
  },
  {
    jsonId: 8,
    name: "Ask for Alternatives",
    templateContent: "Here's a piece of code:\n\n```\n{code_snippet}\n```\n\nPlease provide an alternative implementation based on the following approach: {alternative_approach}. Explain the differences and trade-offs.",
    descriptionContent: "Explore multiple implementation paths and expand your toolbox",
    icon: GitCompareArrows,
    category: "Exploration"
  },
  {
    jsonId: 9,
    name: "Rubber Ducking",
    templateContent: "I'm trying to understand a piece of code. Here's my current understanding of what it does:\n\n{your_explanation}\n\nOptionally, here's the code I'm referring to:\n```\n{function_code}\n```\n\nAm I missing any key aspects? Are there any potential misunderstandings or bugs that my explanation might reveal? Please challenge my assumptions.",
    descriptionContent: "Let the AI challenge your understanding and spot inconsistencies",
    icon: BrainCircuit,
    category: "Understanding"
  },
  {
    jsonId: 10,
    name: "Constraint Anchoring",
    templateContent: "Please process/generate/modify the following code (or address the task):\n\n```\n{code_snippet_or_task}\n```\n\nWhen doing so, adhere to these constraints:\n- Avoid: {things_to_avoid}\n- Stick to: {things_to_stick_to}\n- Optimize for: {optimization_goal}",
    descriptionContent: "Prevent the AI from overreaching or introducing incompatible patterns",
    icon: Target,
    category: "Constraints"
  }
];

export const PROMPT_STRATEGIES: PromptStrategy[] = newStrategiesData.map(item => {
  const parameters = extractParameters(item.templateContent);
  const example = generateExample(item.templateContent, parameters);
  
  // Convert {param} to ${param} for the final template string
  const finalTemplate = item.templateContent.replace(/\{(\w+)\}/g, '${"$1"}');
  // And update example output to use the same placeholder syntax if needed, or rather, ensure example output is fully resolved
  let finalExampleOutput = item.templateContent;
   parameters.forEach(param => {
    const regex = new RegExp(`\\{${param.name}\\}`, 'g');
    finalExampleOutput = finalExampleOutput.replace(regex, example.inputs[param.name]);
  });


  return {
    id: item.name.toLowerCase().replace(/\s+/g, '-'),
    name: item.name,
    description: item.descriptionContent,
    template: finalTemplate,
    parameters,
    example: {
      inputs: example.inputs,
      output: finalExampleOutput
    },
    icon: item.icon,
    category: item.category,
  };
});
