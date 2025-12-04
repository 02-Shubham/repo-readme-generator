// /**
//  * Edge function: generate-readme
//  * Fetches key files from a GitHub repo, assembles context, and calls LLM to generate README
//  */

// import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// };

// // Key files to look for when analyzing a repository
// const KEY_FILES = [
//   'package.json',
//   'README.md',
//   'pyproject.toml',
//   'requirements.txt',
//   'Dockerfile',
//   'docker-compose.yml',
//   'Cargo.toml',
//   'go.mod',
// ];

// interface FileContent {
//   path: string;
//   content: string;
// }

// /**
//  * Parse GitHub repository URL to extract owner and repo name
//  */
// function parseRepoUrl(url: string): { owner: string; repo: string } | null {
//   try {
//     const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/, '');
//     const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
//     if (!match) return null;
    
//     return {
//       owner: match[1],
//       repo: match[2],
//     };
//   } catch (error) {
//     console.error('Error parsing repo URL:', error);
//     return null;
//   }
// }

// /**
//  * Fetch repository contents at the root level
//  */
// async function fetchRepoFiles(owner: string, repo: string, path: string = '') {
//   const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
//   const response = await fetch(url, {
//     headers: {
//       'Accept': 'application/vnd.github.v3+json',
//       'User-Agent': 'Lovable-README-Generator',
//     },
//   });

//   if (!response.ok) {
//     // Check for rate limiting
//     const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
//     const rateLimitReset = response.headers.get('X-RateLimit-Reset');
    
//     if (response.status === 403 && rateLimitRemaining === '0') {
//       const resetTime = rateLimitReset 
//         ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
//         : 'soon';
//       throw new Error(`GitHub rate limit exceeded. Resets at ${resetTime}. Consider adding a GitHub token for higher limits.`);
//     }
    
//     if (response.status === 403) {
//       throw new Error(`Repository access forbidden. It may be private or require authentication.`);
//     }
    
//     if (response.status === 404) {
//       throw new Error(`Repository not found: ${owner}/${repo}`);
//     }
    
//     throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
//   }

//   const data = await response.json();
//   return Array.isArray(data) ? data : [data];
// }

// /**
//  * Get raw content of a specific file
//  */
// async function getFileContent(owner: string, repo: string, path: string): Promise<string> {
//   const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
//   const response = await fetch(url, {
//     headers: {
//       'Accept': 'application/vnd.github.v3+json',
//       'User-Agent': 'Lovable-README-Generator',
//     },
//   });

//   if (!response.ok) {
//     // Handle rate limiting gracefully
//     if (response.status === 403) {
//       const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
//       if (rateLimitRemaining === '0') {
//         throw new Error('Rate limit exceeded');
//       }
//     }
//     console.warn(`Could not fetch ${path}: ${response.status}`);
//     throw new Error(`Failed to fetch ${path}: ${response.status}`);
//   }

//   const data = await response.json();
  
//   // GitHub API returns content as base64
//   if (data.encoding === 'base64') {
//     // Decode base64 using Deno's built-in atob
//     return atob(data.content.replace(/\n/g, ''));
//   }
  
//   return data.content;
// }

// /**
//  * Fetch all key files from a repository
//  */
// async function fetchKeyFiles(owner: string, repo: string): Promise<Map<string, string>> {
//   const fileMap = new Map<string, string>();
  
//   try {
//     console.log(`Fetching files for ${owner}/${repo}`);
//     const rootFiles = await fetchRepoFiles(owner, repo);
    
//     // Check for key files in root
//     for (const file of rootFiles) {
//       if (file.type === 'file' && KEY_FILES.includes(file.name)) {
//         try {
//           const content = await getFileContent(owner, repo, file.path);
//           fileMap.set(file.name, content);
//           console.log(`Fetched ${file.name}`);
//         } catch (error) {
//           console.warn(`Could not fetch ${file.name}:`, error);
//         }
//       }
//     }
    
//     // Check for workflow files in .github/workflows
//     try {
//       const workflowFiles = await fetchRepoFiles(owner, repo, '.github/workflows');
//       for (const file of workflowFiles) {
//         if (file.type === 'file' && file.name.endsWith('.yml')) {
//           try {
//             const content = await getFileContent(owner, repo, file.path);
//             fileMap.set(`.github/workflows/${file.name}`, content);
//             console.log(`Fetched workflow: ${file.name}`);
//           } catch (error) {
//             console.warn(`Could not fetch workflow ${file.name}:`, error);
//           }
//         }
//       }
//     } catch (error) {
//       console.log('No workflows directory found');
//     }
//   } catch (error) {
//     console.error('Error fetching key files:', error);
//     throw error;
//   }
  
//   return fileMap;
// }

// /**
//  * Assemble prompt for LLM from fetched files
//  * Keeps summaries compact (first 400 chars per file)
//  */
// function assemblePrompt(owner: string, repo: string, files: Map<string, string>): string {
//   let prompt = `Generate a comprehensive README.md for the GitHub repository: ${owner}/${repo}\n\n`;
//   prompt += `Repository files analyzed:\n`;
  
//   const fileSummaries: string[] = [];
  
//   for (const [filename, content] of files.entries()) {
//     // Trim content to first 400 characters for compact context
//     const summary = content.substring(0, 400).replace(/`/g, '\\`');
//     fileSummaries.push(`File: ${filename}\n${summary}\n<!--source: ${filename}-->`);
//   }
  
//   prompt += fileSummaries.join('\n\n');
  
//   prompt += `\n\nPlease generate a markdown README with these sections:
// 1. Title (repository name as H1)
// 2. One-line description
// 3. Quick start (install & run instructions)
// 4. Usage example
// 5. Configuration (environment variables if found)
// 6. Contributing guidelines
// 7. License

// Include <!--source: filepath--> HTML comments where content was derived from specific files.
// Keep the README clear, concise, and actionable.`;

//   return prompt;
// }

// /**
//  * Call Lovable AI to generate README content
//  */
// async function callLLM(prompt: string): Promise<string> {
//   const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
//   if (!LOVABLE_API_KEY) {
//     throw new Error('LOVABLE_API_KEY not configured');
//   }

//   console.log('Calling Lovable AI...');
  
//   const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${LOVABLE_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'google/gemini-2.5-flash',
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a technical documentation expert. Generate clear, well-structured README files for software projects.',
//         },
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     console.error('Lovable AI error:', response.status, errorText);
//     throw new Error(`AI generation failed: ${response.status}`);
//   }

//   const data = await response.json();
//   return data.choices[0].message.content;
// }

// /**
//  * Extract provenance from generated README
//  */
// function extractProvenance(readme: string, files: Map<string, string>): Array<{ file: string; reason: string }> {
//   const provenance: Array<{ file: string; reason: string }> = [];
  
//   for (const filename of files.keys()) {
//     let reason = 'general information';
    
//     if (filename === 'package.json') reason = 'install scripts and dependencies';
//     else if (filename === 'README.md') reason = 'existing documentation';
//     else if (filename.includes('workflow')) reason = 'CI/CD configuration';
//     else if (filename === 'Dockerfile') reason = 'containerization setup';
    
//     provenance.push({ file: filename, reason });
//   }
  
//   return provenance;
// }

// serve(async (req) => {
//   // Handle CORS preflight
//   if (req.method === 'OPTIONS') {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const { repoUrl } = await req.json();
    
//     if (!repoUrl) {
//       return new Response(
//         JSON.stringify({ error: 'repoUrl is required' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }

//     // Parse repository URL
//     const parsed = parseRepoUrl(repoUrl);
//     if (!parsed) {
//       return new Response(
//         JSON.stringify({ error: 'Invalid GitHub repository URL' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }

//     const { owner, repo } = parsed;
//     console.log(`Processing repository: ${owner}/${repo}`);

//     // Fetch key files
//     const files = await fetchKeyFiles(owner, repo);
    
//     if (files.size === 0) {
//       return new Response(
//         JSON.stringify({ error: 'No key files found in repository' }),
//         { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }

//     // Assemble prompt
//     const prompt = assemblePrompt(owner, repo, files);
//     console.log(`Prompt assembled (${prompt.length} chars)`);

//     // Generate README
//     const readme = await callLLM(prompt);
//     console.log('README generated successfully');

//     // Extract provenance
//     const provenance = extractProvenance(readme, files);

//     return new Response(
//       JSON.stringify({ readme, provenance }),
//       { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     );
//   } catch (error) {
//     console.error('Error in generate-readme:', error);
    
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
//     // Determine appropriate status code
//     let statusCode = 500;
//     if (errorMessage.includes('rate limit')) {
//       statusCode = 429; // Too Many Requests
//     } else if (errorMessage.includes('not found') || errorMessage.includes('Invalid GitHub')) {
//       statusCode = 404;
//     } else if (errorMessage.includes('forbidden') || errorMessage.includes('private')) {
//       statusCode = 403;
//     }
    
//     return new Response(
//       JSON.stringify({ error: errorMessage }),
//       { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     );
//   }
// });

/**
 * Edge function: generate-readme
 * Fetches key files from a GitHub repo, assembles context, and calls LLM to generate README
 */

/**
 * Edge function: generate-readme
 * Fetches key files from a GitHub repo, assembles context, and calls LLM to generate README
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Deno is a global runtime object, no import needed but TypeScript needs the type definitions
// This is implicit in Deno environment

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Key files to look for when analyzing a repository
const KEY_FILES = [
  'package.json',
  'README.md',
  'pyproject.toml',
  'requirements.txt',
  'Dockerfile',
  'docker-compose.yml',
  'Cargo.toml',
  'go.mod',
];

interface FileContent {
  path: string;
  content: string;
}

/**
 * Parse GitHub repository URL to extract owner and repo name
 */
function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/, '');
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    
    if (!match) return null;
    
    return {
      owner: match[1],
      repo: match[2],
    };
  } catch (error) {
    console.error('Error parsing repo URL:', error);
    return null;
  }
}

/**
 * Fetch repository contents at the root level
 */
async function fetchRepoFiles(owner: string, repo: string, path: string = '') {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Lovable-README-Generator',
    },
  });

  if (!response.ok) {
    // Check for rate limiting
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitReset = response.headers.get('X-RateLimit-Reset');
    
    if (response.status === 403 && rateLimitRemaining === '0') {
      const resetTime = rateLimitReset 
        ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
        : 'soon';
      throw new Error(`GitHub rate limit exceeded. Resets at ${resetTime}. Consider adding a GitHub token for higher limits.`);
    }
    
    if (response.status === 403) {
      throw new Error(`Repository access forbidden. It may be private or require authentication.`);
    }
    
    if (response.status === 404) {
      throw new Error(`Repository not found: ${owner}/${repo}`);
    }
    
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

/**
 * Get raw content of a specific file
 */
async function getFileContent(owner: string, repo: string, path: string): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Lovable-README-Generator',
    },
  });

  if (!response.ok) {
    // Handle rate limiting gracefully
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      if (rateLimitRemaining === '0') {
        throw new Error('Rate limit exceeded');
      }
    }
    console.warn(`Could not fetch ${path}: ${response.status}`);
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data = await response.json();
  
  // GitHub API returns content as base64
  if (data.encoding === 'base64') {
    // Decode base64 using Deno's built-in atob
    return atob(data.content.replace(/\n/g, ''));
  }
  
  return data.content;
}

/**
 * Fetch all key files from a repository
 */
async function fetchKeyFiles(owner: string, repo: string): Promise<Map<string, string>> {
  const fileMap = new Map<string, string>();
  
  try {
    console.log(`Fetching files for ${owner}/${repo}`);
    const rootFiles = await fetchRepoFiles(owner, repo);
    
    // Check for key files in root
    for (const file of rootFiles) {
      if (file.type === 'file' && KEY_FILES.includes(file.name)) {
        try {
          const content = await getFileContent(owner, repo, file.path);
          fileMap.set(file.name, content);
          console.log(`Fetched ${file.name}`);
        } catch (error) {
          console.warn(`Could not fetch ${file.name}:`, error);
        }
      }
    }
    
    // Check for workflow files in .github/workflows
    try {
      const workflowFiles = await fetchRepoFiles(owner, repo, '.github/workflows');
      for (const file of workflowFiles) {
        if (file.type === 'file' && file.name.endsWith('.yml')) {
          try {
            const content = await getFileContent(owner, repo, file.path);
            fileMap.set(`.github/workflows/${file.name}`, content);
            console.log(`Fetched workflow: ${file.name}`);
          } catch (error) {
            console.warn(`Could not fetch workflow ${file.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.log('No workflows directory found');
    }
  } catch (error) {
    console.error('Error fetching key files:', error);
    throw error;
  }
  
  return fileMap;
}

/**
 * Assemble prompt for LLM from fetched files
 * Keeps summaries compact (first 400 chars per file)
 */
function assemblePrompt(owner: string, repo: string, files: Map<string, string>): string {
  let prompt = `Generate a comprehensive README.md for the GitHub repository: ${owner}/${repo}\n\n`;
  prompt += `Repository files analyzed:\n`;
  
  const fileSummaries: string[] = [];
  
  for (const [filename, content] of files.entries()) {
    // Trim content to first 400 characters for compact context
    const summary = content.substring(0, 400).replace(/`/g, '\\`');
    fileSummaries.push(`File: ${filename}\n${summary}\n<!--source: ${filename}-->`);
  }
  
  prompt += fileSummaries.join('\n\n');
  
  prompt += `\n\nPlease generate a comprehensive and engaging markdown README with these sections:

1. **Title** (repository name as H1 with an appropriate emoji)

2. **Description** (3-4 lines)
   - What the project does and its main purpose
   - Key features or capabilities
   - What problems it solves
   - Target audience or use cases

3. **Quick Start** (Easy copy-paste commands)
   - Prerequisites (if any)
   - Installation steps
   - Basic run/start command
   - Expected output or what to do next

4. **How It Works** (Technical overview)
   - High-level architecture or workflow
   - Key components and their roles
   - Technologies and frameworks used
   - Important implementation details

5. **Usage Examples** (Practical demonstrations)
   - Common use cases with code snippets
   - API usage if applicable
   - Configuration examples
   - Screenshots or output examples if relevant

6. **Configuration** (Environment & settings)
   - Environment variables with descriptions
   - Configuration files and their purposes
   - Optional settings and defaults

7. **Contributing & License**
   - Quick note on how to contribute (1-2 lines)
   - License type (1 line)
Make the README engaging, developer-friendly, and actionable. Use proper markdown formatting with code blocks, badges, and clear headings.`;

  return prompt;
}

/**
 * Call Google Gemini API to generate README content
 */
async function callLLM(prompt: string): Promise<string> {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log('Calling Google Gemini API...');
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are a technical documentation expert. Generate clear, well-structured README files for software projects.\n\n${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', response.status, errorText);
    throw new Error(`AI generation failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Gemini API response received:', JSON.stringify(data, null, 2));
  
  // Extract text from Gemini's response format
  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Successfully extracted README text, length:', generatedText.length);
    return generatedText;
  }
  
  // Debug: log the full response if parsing failed
  console.error('Failed to extract text from Gemini response. Full response:', JSON.stringify(data));
  throw new Error('Unexpected response format from Gemini API - no text in candidates');
}

/**
 * Extract provenance from generated README
 */
function extractProvenance(readme: string, files: Map<string, string>): Array<{ file: string; reason: string }> {
  const provenance: Array<{ file: string; reason: string }> = [];
  
  for (const filename of files.keys()) {
    let reason = 'general information';
    
    if (filename === 'package.json') reason = 'install scripts and dependencies';
    else if (filename === 'README.md') reason = 'existing documentation';
    else if (filename.includes('workflow')) reason = 'CI/CD configuration';
    else if (filename === 'Dockerfile') reason = 'containerization setup';
    
    provenance.push({ file: filename, reason });
  }
  
  return provenance;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl } = await req.json();
    
    if (!repoUrl) {
      return new Response(
        JSON.stringify({ error: 'repoUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse repository URL
    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Invalid GitHub repository URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { owner, repo } = parsed;
    console.log(`Processing repository: ${owner}/${repo}`);

    // Fetch key files
    const files = await fetchKeyFiles(owner, repo);
    
    if (files.size === 0) {
      return new Response(
        JSON.stringify({ error: 'No key files found in repository' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Assemble prompt
    const prompt = assemblePrompt(owner, repo, files);
    console.log(`Prompt assembled (${prompt.length} chars)`);

    // Generate README
    const readme = await callLLM(prompt);
    console.log('README generated successfully');

    // Extract provenance
    const provenance = extractProvenance(readme, files);

    return new Response(
      JSON.stringify({ readme, provenance }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-readme:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    // Determine appropriate status code
    let statusCode = 500;
    if (errorMessage.includes('rate limit')) {
      statusCode = 429; // Too Many Requests
    } else if (errorMessage.includes('not found') || errorMessage.includes('Invalid GitHub')) {
      statusCode = 404;
    } else if (errorMessage.includes('forbidden') || errorMessage.includes('private')) {
      statusCode = 403;
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});