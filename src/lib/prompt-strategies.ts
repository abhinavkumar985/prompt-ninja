import type { LucideIcon } from 'lucide-react';
import { Code2, Users, MessageSquare, Zap, Edit3 } from 'lucide-react';

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

export const PROMPT_STRATEGIES: PromptStrategy[] = [
  {
    id: 'explain-code',
    name: 'Explain Code',
    description: 'Generates a prompt to ask an AI to explain a piece of code, with options for language, focus, and audience level.',
    template: "Please explain the following ${language} code snippet. Focus on ${focusArea} and explain it as if I am ${audienceLevel}.\n\n```${language}\n${code}\n```\n\nKey aspects to cover:\n- Overall purpose of the code\n- Explanation of major functions/classes\n- How data flows through the snippet\n- Any potential edge cases or improvements (if applicable)",
    parameters: [
      { name: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., Python, JavaScript', defaultValue: 'Python' },
      { name: 'code', label: 'Code Snippet', type: 'textarea', placeholder: 'Paste your code here', rows: 8 },
      { name: 'focusArea', label: 'Specific Focus Area', type: 'text', placeholder: 'e.g., specific algorithm, error handling, performance', defaultValue: 'overall functionality' },
      { name: 'audienceLevel', label: 'Audience Level', type: 'select', options: ['a complete beginner', 'someone with basic programming knowledge', 'an intermediate developer', 'an expert'], defaultValue: 'someone with basic programming knowledge' },
    ],
    example: {
      inputs: { language: 'Python', code: "def factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)", focusArea: "recursion", audienceLevel: "a beginner" },
      output: "Please explain the following Python code snippet. Focus on recursion and explain it as if I am a beginner.\n\n```Python\ndef factorial(n):\n  if n == 0:\n    return 1\n  else:\n    return n * factorial(n-1)\n```\n\nKey aspects to cover:\n- Overall purpose of the code\n- Explanation of major functions/classes\n- How data flows through the snippet\n- Any potential edge cases or improvements (if applicable)",
    },
    icon: Code2,
    category: "Code Understanding",
  },
  {
    id: 'persona-prompt',
    name: 'Persona-Based Prompt',
    description: 'Crafts a prompt by instructing the AI to adopt a specific persona for a given task.',
    template: "Act as a ${persona}. Your task is to ${taskDescription}. Your response should be tailored for ${targetAudience} and delivered in ${outputFormat} format. Maintain a ${tone} tone throughout your response.",
    parameters: [
      { name: 'persona', label: 'Persona', type: 'text', placeholder: 'e.g., Senior Software Engineer, UI/UX Designer', defaultValue: 'Helpful AI Assistant' },
      { name: 'taskDescription', label: 'Task Description', type: 'textarea', placeholder: 'e.g., review this code for security vulnerabilities and suggest improvements', rows: 4 },
      { name: 'targetAudience', label: 'Target Audience', type: 'text', placeholder: 'e.g., junior developers, non-technical stakeholders', defaultValue: 'a general technical audience' },
      { name: 'outputFormat', label: 'Output Format', type: 'text', placeholder: 'e.g., a bulleted list, a JSON object, a detailed report', defaultValue: 'a clear, concise summary' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['formal', 'informal', 'technical', 'encouraging', 'critical'], defaultValue: 'technical' },
    ],
    example: {
      inputs: { persona: 'DevOps Engineer', taskDescription: 'suggest a CI/CD pipeline for a Node.js app hosted on AWS', targetAudience: 'a team of developers', outputFormat: 'markdown with code blocks', tone: 'formal' },
      output: "Act as a DevOps Engineer. Your task is to suggest a CI/CD pipeline for a Node.js app hosted on AWS. Your response should be tailored for a team of developers and delivered in markdown with code blocks format. Maintain a formal tone throughout your response.",
    },
    icon: Users,
    category: "Role Playing",
  },
  {
    id: 'generate-code',
    name: 'Generate Code',
    description: 'Generates a prompt to ask an AI to write code for a specific task, including language, libraries, and constraints.',
    template: "Write a ${language} script to ${taskDescription}. Utilize the following libraries/frameworks if appropriate: ${libraries}. The code should adhere to these constraints: ${constraints}. Please include comments explaining key parts of the code.",
    parameters: [
      { name: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., Python, TypeScript', defaultValue: 'Python' },
      { name: 'taskDescription', label: 'Task Description', type: 'textarea', placeholder: 'e.g., read a CSV file, process data, and output a JSON', rows: 4 },
      { name: 'libraries', label: 'Libraries/Frameworks (optional)', type: 'text', placeholder: 'e.g., pandas, React, Express.js', defaultValue: 'standard libraries' },
      { name: 'constraints', label: 'Constraints (optional)', type: 'textarea', placeholder: 'e.g., must be compatible with Python 3.8+, no external API calls', rows: 3, defaultValue: 'standard best practices' },
    ],
    example: {
      inputs: { language: 'Python', taskDescription: 'create a function that takes a list of numbers and returns the sum of even numbers', libraries: 'None', constraints: 'Handle empty list gracefully.' },
      output: "Write a Python script to create a function that takes a list of numbers and returns the sum of even numbers. Utilize the following libraries/frameworks if appropriate: None. The code should adhere to these constraints: Handle empty list gracefully.. Please include comments explaining key parts of the code.",
    },
    icon: Edit3,
    category: "Code Generation",
  },
   {
    id: 'refactor-code',
    name: 'Refactor Code',
    description: 'Provides a prompt to ask an AI to refactor a piece of code for clarity, performance, or style.',
    template: "Please refactor the following ${language} code snippet to improve ${refactorGoal}. \n\nOriginal Code:\n```${language}\n${code}\n```\n\nExplain the changes made and why they are beneficial.",
    parameters: [
      { name: 'language', label: 'Programming Language', type: 'text', placeholder: 'e.g., JavaScript, Java', defaultValue: 'JavaScript' },
      { name: 'code', label: 'Code to Refactor', type: 'textarea', placeholder: 'Paste your code here', rows: 8 },
      { name: 'refactorGoal', label: 'Refactoring Goal', type: 'select', options: ['readability', 'performance', 'maintainability', 'adherence to specific style guide (e.g., PEP8)'], defaultValue: 'readability' },
    ],
    example: {
      inputs: { language: 'JavaScript', code: "function example(arr) { var new_arr = []; for(var i=0; i<arr.length; i++){ if(arr[i] > 10) new_arr.push(arr[i]*2); } return new_arr; }", refactorGoal: 'readability and modern JavaScript syntax' },
      output: "Please refactor the following JavaScript code snippet to improve readability and modern JavaScript syntax. \n\nOriginal Code:\n```JavaScript\nfunction example(arr) { var new_arr = []; for(var i=0; i<arr.length; i++){ if(arr[i] > 10) new_arr.push(arr[i]*2); } return new_arr; }\n```\n\nExplain the changes made and why they are beneficial.",
    },
    icon: Zap,
    category: "Code Improvement",
  }
];
