
import type { LucideIcon } from 'lucide-react';
import {
  User,
  ListChecks,
  ListOrdered,
  Bug,
  Wrench,
  GitCompareArrows,
  BrainCircuit,
  HelpingHand,
  Filter,
  Lightbulb,
  DatabaseZap, // For Generate Knowledge, or Retrieval Augmented
  Repeat, // For Self-consistency or Iterative Refinement
  MessageSquare, // Zero-shot
  AlertTriangle, // Error Correction
  Zap, // Placeholder for general AI interaction
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
  name: string; // Name from the mockup radio buttons
  templateString: string; // The prompt template
  description: string; // Full purpose
  shortDescription: string; // Short desc for UI hints
  icon: LucideIcon; // For internal use if needed elsewhere
  category: string;
  imagePlaceholderKeywords: string; // For strategy library card, if reinstated
  configurableParameterNames?: string[];
  parameterDefaults?: Record<string, string>;
  additionalParameters?: Array<Omit<PromptParameter, 'isConfigurable' | 'defaultValue'>>; // To define params not in template
}

const strategiesInput: StrategyInputItem[] = [
  {
    name: "Zero-shot",
    templateString: "\${main_input}",
    description: "Directly provide the task or question to the AI without any examples.",
    shortDescription: "Direct instruction without examples.",
    icon: MessageSquare,
    category: "Basic",
    imagePlaceholderKeywords: "direct command",
  },
  {
    name: "Few-shot",
    templateString: "Here are some examples:\nExample 1 Input: \${example_input_1}\nExample 1 Output: \${example_output_1}\n\nNow, for the following input, provide the output:\nInput: \${main_input}\nOutput:",
    description: "Provide a few examples of input-output pairs to guide the AI's response pattern.",
    shortDescription: "Guide with input-output examples.",
    icon: ListChecks,
    category: "Guidance",
    imagePlaceholderKeywords: "example learning",
    additionalParameters: [
      { name: 'example_input_1', label: 'Example Input 1', type: 'textarea', placeholder: 'Input for first example', rows: 2 },
      { name: 'example_output_1', label: 'Example Output 1', type: 'textarea', placeholder: 'Output for first example', rows: 2 },
    ]
  },
  {
    name: "Chain-of-Thought",
    templateString: "Think step by step to solve this problem or answer this question:\n\nProblem/Question:\n\${main_input}\n\nLet's break this down:",
    description: "Encourage the AI to break down complex problems into a series of intermediate steps, explaining its reasoning.",
    shortDescription: "Step-by-step problem solving.",
    icon: ListOrdered,
    category: "Reasoning",
    imagePlaceholderKeywords: "logical steps",
  },
  {
    name: "Self-consistency",
    templateString: "Consider multiple approaches or reasoning paths for the following task: \n\${main_input}\n\nEvaluate these paths and provide the most consistent and robust solution/answer.",
    description: "Prompt the AI to generate multiple reasoning paths and then choose the most consistent or common answer, improving reliability.",
    shortDescription: "Multiple reasoning paths for reliability.",
    icon: Repeat,
    category: "Reasoning",
    imagePlaceholderKeywords: "consistent answers",
  },
  {
    name: "Generate knowledge",
    templateString: "Before addressing the main query, please provide some relevant background knowledge or context on the topic of: \${related_topic}.\n\nNow, with that context, please address the following:\n\${main_input}",
    description: "Instruct the AI to first generate relevant knowledge or context about a topic before answering the main query.",
    shortDescription: "Generate context before answering.",
    icon: Lightbulb, // or DatabaseZap
    category: "Contextualization",
    imagePlaceholderKeywords: "knowledge context",
    additionalParameters: [
      { name: 'related_topic', label: 'Topic for Knowledge Generation', type: 'text', placeholder: 'e.g., "React Hooks" or "Python decorators"' }
    ]
  },
  {
    name: "Role Prompting",
    templateString: "You are a senior \${language} developer. Review the following for \${goal}:\n\n\${main_input}",
    description: "Simulate an expert-level persona for tasks like code review, debugging, or refactoring.",
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
  {
    name: "Error Correction",
    templateString: "The following code or process resulted in an error.\n\nInput/Code:\n\${main_input}\n\nError Details:\n\${error_details}\n\nPlease explain the cause of the error and provide a corrected version or solution.",
    description: "Provide the AI with erroneous code/input and the resulting error, asking for an explanation and correction.",
    shortDescription: "Explain and fix errors.",
    icon: AlertTriangle,
    category: "Debugging",
    imagePlaceholderKeywords: "bug fix code",
    additionalParameters: [
        { name: 'error_details', label: 'Error Message / Details', type: 'textarea', placeholder: 'Paste the full error message or describe the error encountered.', rows: 3 },
    ]
  }
];

export const PROMPT_STRATEGIES: PromptStrategy[] = strategiesInput.map(item => {
  const template = item.templateString;
  
  // Extract parameters from template
  const templateParams = extractParameters(template);
  
  // Combine template parameters with explicitly defined additional parameters
  const allParamDefinitions = [...templateParams];
  if (item.additionalParameters) {
    item.additionalParameters.forEach(additionalParam => {
      if (!allParamDefinitions.find(p => p.name === additionalParam.name)) {
        allParamDefinitions.push(additionalParam);
      }
    });
  }
  
  // Ensure 'main_input' is treated as a textarea if it's a primary input method.
  const mainInputParam = allParamDefinitions.find(p => p.name === 'main_input');
  if (mainInputParam) {
    mainInputParam.type = 'textarea';
    mainInputParam.rows = 8;
    mainInputParam.label = 'Primary Input (Code/Error/Question)';
  }


  const parameters: PromptParameter[] = allParamDefinitions.map(p => ({
    ...p,
    isConfigurable: item.configurableParameterNames?.includes(p.name) ?? false,
    defaultValue: item.parameterDefaults?.[p.name] || '',
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
