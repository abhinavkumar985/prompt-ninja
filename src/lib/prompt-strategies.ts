
import type { LucideIcon } from 'lucide-react';
import {
  User, // For Role-based
  ListChecks, // For Few-shot
  ListOrdered, // For Step-by-step
  // Keeping other icons in case they are used elsewhere, or for future expansion
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
  ListChecks as ListChecksDuplicate, // alias if needed, but ListChecks is fine
  GitCommitVertical,
  LayoutGrid,
  Wrench,
  Lightbulb,
  MessageCircleQuestion,
  Filter,
  Anchor,
  Binary
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

// Helper function to extract parameters from a template string
const extractParameters = (template: string): PromptParameter[] => {
  const regex = /\$\{(\w+)\}/g; // Updated to match ${param} style
  let match;
  const params: PromptParameter[] = [];
  const seenParams = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    const paramName = match[1];
    if (!seenParams.has(paramName)) {
      params.push({
        name: paramName,
        label: paramName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), // Convert snake_case to Title Case
        type: paramName.includes('code') || paramName.includes('summary') || paramName.includes('description') || paramName.includes('bullets') || paramName.includes('explanation') || paramName.includes('input') || paramName.includes('instruction') ? 'textarea' : 'text',
        placeholder: `Enter ${paramName.replace(/_/g, ' ')}`,
        rows: paramName.includes('code') || paramName.includes('summary') || paramName.includes('description') || paramName.includes('bullets') || paramName.includes('explanation') || paramName.includes('input')  || paramName.includes('instruction')? 4 : undefined,
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
      ? `Example multi-line content for ${param.label.toLowerCase()}.` 
      : `example_${param.name}`;
    inputs[param.name] = exampleValue;
    const regex = new RegExp(`\\$\\{${param.name}\\}`, 'g');
    output = output.replace(regex, exampleValue);
  });

  return { inputs, output };
};

// Define the three strategies from the image
const strategiesData = [
  {
    id: "few-shot",
    name: "Few-shot",
    cardDescription: "Provide examples to guide the AI.", // For landing page card
    libraryDescription: "Guide the AI by providing specific input-output examples, helping it understand the desired format, style, or task.", // For strategy library
    template: "Input: ${example_input_1}\nOutput: ${example_output_1}\n\nInput: ${example_input_2}\nOutput: ${example_output_2}\n\nGiven ${actual_input}, what is the output?",
    icon: ListChecks,
    category: "Guidance"
  },
  {
    id: "role-based",
    name: "Role-based",
    cardDescription: "Define a specific persona for the AI.", // For landing page card
    libraryDescription: "Instruct the AI to adopt a specific persona (e.g., 'senior TypeScript developer', 'security expert') to tailor its responses for code review, generation, or explanation.", // For strategy library
    template: "You are a ${role_description}. Please review the following code snippet: \n```\n${code_snippet}\n```\nYour goal is to ${review_goal}.",
    icon: User,
    category: "Persona"
  },
  {
    id: "step-by-step",
    name: "Step-by-step",
    cardDescription: "Break down complex tasks into smaller steps.", // For landing page card
    libraryDescription: "Decompose complex problems or generation tasks into a sequence of smaller, manageable steps for the AI to follow, ensuring a structured approach.", // For strategy library
    template: "Let's break this down into steps to achieve ${overall_goal}:\n1. ${step_1_instruction}\n2. ${step_2_instruction}\n3. ${step_3_instruction}\n\nPlease provide the complete solution or code based on these steps.",
    icon: ListOrdered,
    category: "Decomposition"
  }
];

export const PROMPT_STRATEGIES: PromptStrategy[] = strategiesData.map(item => {
  const parameters = extractParameters(item.template);
  const example = generateExample(item.template, parameters);

  return {
    id: item.id,
    name: item.name,
    description: item.libraryDescription, // Use libraryDescription for the main PromptStrategy object
    template: item.template,
    parameters,
    example,
    icon: item.icon,
    category: item.category,
    // Add cardDescription if you need to access it directly from PROMPT_STRATEGIES later,
    // otherwise the landing page will handle its own descriptions.
    // For now, let landing page manage its specific card descriptions.
  };
});
