
import type { LucideIcon } from 'lucide-react';
import {
  User, // For Role Prompting
  // Other icons can be removed if not used by Role Prompting
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
  description: string; // Full purpose/description
  shortDescription: string; // Short description for cards/UI elements
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
const extractParameters = (template: string): Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>[] => {
  const regex = /\$\{(\w+)\}/g;
  let match;
  const params: Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>[] = [];
  const seenParams = new Set<string>();

  while ((match = regex.exec(template)) !== null) {
    const paramName = match[1];
    if (!seenParams.has(paramName)) {
      let label = paramName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      if (paramName === 'main_input') label = 'Primary Input (Code/Error/Question)';

      const textareaKeywords = ['code', 'summary', 'description', 'bullets', 'explanation', 'input', 'instruction', 'requirements', 'template', 'json', 'text', 'context', 'error', 'output', 'goal', 'example', 'content', 'snippet', 'refactor', 'style', 'strategy', 'notes', 'function', 'behavior', 'feature', 'history', 'query', 'criteria', 'response', 'task', 'log', 'issue', 'script', 'detail', 'problem', 'solution', 'payload', 'data', 'config', 'report', 'message', 'comment', 'feedback', 'request', 'test', 'scenario', 'guideline', 'prompt', 'main_input'];
      const isTextarea = textareaKeywords.some(keyword => paramName.toLowerCase().includes(keyword)) || paramName.toLowerCase().endsWith('s') || paramName.toLowerCase().includes('list') || paramName.toLowerCase().includes('text');

      params.push({
        name: paramName,
        label: label,
        type: isTextarea ? 'textarea' : 'text',
        placeholder: `Enter ${label.toLowerCase()}`,
        rows: isTextarea ? (paramName === 'main_input' ? 8 : 3) : undefined,
      });
      seenParams.add(paramName);
    }
  }
  return params;
};

// Helper function to generate example inputs and output
const generateExample = (template: string, parameters: PromptParameter[], strategyName?: string): { inputs: Record<string, string>; output: string } => {
  const inputs: Record<string, string> = {};
  let output = template;

  parameters.forEach(param => {
    let exampleValue = param.defaultValue || `[Example ${param.label.toLowerCase()}]`;
    if (param.name === 'main_input') {
      exampleValue = `This is the main input for the "${strategyName || 'strategy'}". It could be a code snippet, an error message, or a general question.`;
    } else if (param.type === 'textarea' && !param.defaultValue) {
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
  name: string;
  templateString: string;
  description: string; // Full purpose
  shortDescription: string; // Short desc for UI hints
  icon: LucideIcon;
  category: string;
  imagePlaceholderKeywords: string;
  configurableParameterNames?: string[];
  parameterDefaults?: Record<string, string>;
  additionalParameters?: Array<Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>>;
}

const strategiesInput: StrategyInputItem[] = [
  {
    name: "Role Prompting",
    templateString: "You are a senior ${language} developer. Review the following for ${goal}:\n\n${main_input}",
    description: "Simulate an expert-level persona for tasks like code review, debugging, or refactoring by defining the AI's role, the programming language, and the specific goal of the review or task.",
    shortDescription: "Simulate a specific expert role.",
    icon: User,
    category: "Persona",
    imagePlaceholderKeywords: "expert persona",
    configurableParameterNames: ["language", "goal"],
    parameterDefaults: { language: "TypeScript", goal: "clarity and potential bugs" },
    additionalParameters: [
      { name: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., Python, JavaScript' },
      { name: 'goal', label: 'Goal of Review/Task', type: 'text', placeholder: 'e.g., identify bugs, improve performance' },
    ]
  },
  // All other strategies have been removed
];

export const PROMPT_STRATEGIES: PromptStrategy[] = strategiesInput.map(item => {
  const template = item.templateString;
  
  const templateParams = extractParameters(template);
  
  const allParamDefinitions = [...templateParams];
  if (item.additionalParameters) {
    item.additionalParameters.forEach(additionalParam => {
      if (!allParamDefinitions.find(p => p.name === additionalParam.name)) {
        allParamDefinitions.push(additionalParam);
      }
    });
  }
  
  const mainInputParam = allParamDefinitions.find(p => p.name === 'main_input');
  if (mainInputParam) {
    mainInputParam.type = 'textarea';
    mainInputParam.rows = 8; // Default rows for main_input
    mainInputParam.label = 'Primary Input (Code/Error/Question)';
  }


  const parameters: PromptParameter[] = allParamDefinitions.map(p => ({
    ...p,
    isConfigurable: item.configurableParameterNames?.includes(p.name) ?? false,
    defaultValue: item.parameterDefaults?.[p.name] || '', // Use defined default or empty string
  }));

  const example = generateExample(template, parameters, item.name);
  const id = item.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  return {
    id,
    name: item.name,
    description: item.description,
    shortDescription: item.shortDescription,
    template,
    parameters,
    example,
    icon: item.icon,
    category: item.category,
    imagePlaceholderKeywords: item.imagePlaceholderKeywords,
  };
});
