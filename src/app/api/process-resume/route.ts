// src/app/api/process-resume/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ResumeTemplate, resumeTemplates } from "@/lib/templates";
import { createRateLimiter, retry, sleep, getErrorMessage } from "@/lib/utils";

// Define the message type locally
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface CustomizationOptions {
  colorScheme: string;
  fontPairing: string;
  spacing: 'compact' | 'normal' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
}

interface Section {
  type: string;
  content: string;
  priority: number;
}

interface Contact {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

interface ProcessedResume {
  contact: Contact;
  sections: Section[];
}

const rateLimiter = createRateLimiter(3);

// Updated GPT-4 API call function with proper typing
async function callGPT4Api(
  messages: ChatMessage[],
  options: {
    jsonResponse?: boolean;
    temperature?: number;
    max_tokens?: number;
  } = {}
) {
  await rateLimiter.waitForRateLimit();
  
  return retry(
    async () => {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens,
        response_format: options.jsonResponse ? { type: "json_object" } : undefined
      });
      return completion.choices[0].message.content || "";
    },
    {
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 5000,
    }
  );
}

async function parseResumeStructure(content: string): Promise<ProcessedResume> {
  const response = await callGPT4Api(
    [
      {
        role: "system",
        content: "You are an expert resume parser. Parse the resume structure precisely following the requested format."
      },
      {
        role: "user",
        content: `Parse this resume and extract contact information and sections. Return JSON format.

        Resume content:
        ${content}`
      }
    ],
    {
      jsonResponse: true,
      temperature: 0.1
    }
  );

  return JSON.parse(response) as ProcessedResume;
}

async function optimizeSection(
  section: Section,
  jobDescription: string,
  template: ResumeTemplate
): Promise<string> {
  const response = await callGPT4Api(
    [
      {
        role: "system",
        content: `You are optimizing the ${section.type} section of a ${template.category} resume.`
      },
      {
        role: "user",
        content: `
        Original Content:
        ${section.content}
        
        Job Description:
        ${jobDescription}
        
        Optimize this section for the ${template.category} style template.`
      }
    ],
    {
      temperature: 0.7
    }
  );

  return response;
}

async function formatContact(
  contact: Contact,
  template: ResumeTemplate
): Promise<string> {
  const response = await callGPT4Api(
    [
      {
        role: "system",
        content: `Format contact information for a ${template.category} resume template.`
      },
      {
        role: "user",
        content: `Format this contact information in LaTeX:
        ${JSON.stringify(contact, null, 2)}`
      }
    ],
    {
      temperature: 0.3
    }
  );

  return response;
}

async function generateLatexDocument(
  contact: string,
  sections: { type: string; content: string }[],
  template: ResumeTemplate,
  customization: CustomizationOptions
): Promise<string> {
  let latexTemplate = template.latexTemplate;
  const colorScheme = template.colorSchemes.find(
    scheme => scheme.id === customization.colorScheme
  ) || template.colorSchemes[0];

  const spacingValues = {
    compact: '0.75',
    normal: '1.0',
    spacious: '1.25'
  } as const;

  const fontSize = {
    small: '10',
    medium: '11',
    large: '12'
  } as const;

  latexTemplate = latexTemplate
    .replace(/\\documentclass\[.*?\]{article}/, 
      `\\documentclass[${fontSize[customization.fontSize]}pt]{article}`)
    .replace(/\\geometry{.*?}/, 
      `\\geometry{left=${spacingValues[customization.spacing]}in,right=${spacingValues[customization.spacing]}in,top=${spacingValues[customization.spacing]}in,bottom=${spacingValues[customization.spacing]}in}`)
    .replace(/\\definecolor{primary}{.*?}/, 
      `\\definecolor{primary}{RGB}{${colorScheme.primary}}`)
    .replace(/\\definecolor{secondary}{.*?}/, 
      `\\definecolor{secondary}{RGB}{${colorScheme.secondary}}`);

  const fullContent = [
    contact,
    ...sections.map(section => section.content)
  ].join('\n\n');

  return latexTemplate.replace('%CONTENT%', fullContent);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;
    const templateId = formData.get('template') as string;
    const templateCustomization = JSON.parse(
      formData.get('templateCustomization') as string
    ) as CustomizationOptions;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const selectedTemplate = resumeTemplates.find(t => t.id === templateId);
    if (!selectedTemplate) {
      return NextResponse.json(
        { error: "Invalid template selected" },
        { status: 400 }
      );
    }

    const fileContent = await file.text();
    const parsedResume = await parseResumeStructure(fileContent);
    const formattedContact = await formatContact(parsedResume.contact, selectedTemplate);
    
    const processedSections = await Promise.all(
      parsedResume.sections
        .sort((a, b) => a.priority - b.priority)
        .map(async section => ({
          type: section.type,
          content: await optimizeSection(section, jobDescription, selectedTemplate)
        }))
    );

    const latexContent = await generateLatexDocument(
      formattedContact,
      processedSections,
      selectedTemplate,
      templateCustomization
    );

    return NextResponse.json({
      optimizedResume: latexContent,
      sections: processedSections.map(s => s.type),
      success: true
    });

  } catch (error) {
    console.error('Resume processing error:', error);
    
    const errorMessage = getErrorMessage(error);
    const isRateLimit = errorMessage.toLowerCase().includes('rate limit');
    
    return NextResponse.json(
      {
        error: isRateLimit
          ? "Processing limit reached. Please try again in a few minutes."
          : `Failed to process resume: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}