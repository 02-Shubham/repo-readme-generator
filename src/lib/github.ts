/**
 * GitHub API integration for fetching repository files
 * Uses GitHub REST API v3
 */

export interface RepoFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha: string;
}

export interface FileContent {
  path: string;
  content: string;
  encoding: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Parse GitHub repository URL to extract owner and repo name
 * Supports formats:
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo.git
 * - github.com/owner/repo
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Remove trailing slash and .git
    const cleanUrl = url.replace(/\/$/, '').replace(/\.git$/, '');
    
    // Extract owner and repo from URL
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    
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
 * Returns list of files and directories
 */
export async function fetchRepoFiles(
  owner: string,
  repo: string,
  path: string = ''
): Promise<RepoFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      // Optional: Add GitHub token for higher rate limits
      // 'Authorization': `token ${GITHUB_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Ensure we return an array even for single files
  return Array.isArray(data) ? data : [data];
}

/**
 * Get raw content of a specific file
 * Decodes base64 content returned by GitHub API
 */
export async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }

  const data: FileContent = await response.json();
  
  // GitHub API returns content as base64
  if (data.encoding === 'base64') {
    return atob(data.content.replace(/\n/g, ''));
  }
  
  return data.content;
}

/**
 * Key files to look for when analyzing a repository
 */
export const KEY_FILES = [
  'package.json',
  'README.md',
  'pyproject.toml',
  'requirements.txt',
  'Dockerfile',
  'docker-compose.yml',
  'Cargo.toml',
  'go.mod',
] as const;

/**
 * Fetch all key files from a repository
 * Returns a map of filename to content
 */
export async function fetchKeyFiles(
  owner: string,
  repo: string
): Promise<Map<string, string>> {
  const fileMap = new Map<string, string>();
  
  try {
    // Get root directory contents
    const rootFiles = await fetchRepoFiles(owner, repo);
    
    // Check for key files in root
    for (const file of rootFiles) {
      if (file.type === 'file' && KEY_FILES.includes(file.name as any)) {
        try {
          const content = await getFileContent(owner, repo, file.path);
          fileMap.set(file.name, content);
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
          } catch (error) {
            console.warn(`Could not fetch workflow ${file.name}:`, error);
          }
        }
      }
    } catch (error) {
      // No workflows directory, that's fine
    }
  } catch (error) {
    console.error('Error fetching key files:', error);
    throw error;
  }
  
  return fileMap;
}
