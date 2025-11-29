/**
 * Main page: GitHub README Generator
 * User inputs a repo URL, generates README via LLM, previews and downloads
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Github } from 'lucide-react';
import Preview from '@/components/Preview';
import { supabase } from '@/integrations/supabase/client';

interface GenerateResponse {
  readme: string;
  provenance: Array<{ file: string; reason: string }>;
}

export default function Index() {
  const [repoUrl, setRepoUrl] = useState('');
  const [readme, setReadme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provenance, setProvenance] = useState<Array<{ file: string; reason: string }>>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a GitHub repository URL',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setReadme('');
    setProvenance([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-readme', {
        body: { repoUrl },
      });

      if (error) throw error;

      const response: GenerateResponse = data;
      setReadme(response.readme);
      setProvenance(response.provenance);

      toast({
        title: 'Success',
        description: 'README generated successfully!',
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error generating README:', error);
      
      // Extract error message from different error formats
      let errorMessage = 'Failed to generate README';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Provide helpful context for common errors
      if (errorMessage.includes('rate limit')) {
        errorMessage += '\n\nGitHub limits unauthenticated requests to 60 per hour. Try again in a few minutes.';
      } else if (errorMessage.includes('forbidden') || errorMessage.includes('private')) {
        errorMessage += '\n\nThis repository may be private or require authentication.';
      } else if (errorMessage.includes('not found')) {
        errorMessage += '\n\nPlease check the repository URL and try again.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 6000, // Longer duration for error messages
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!readme) return;

    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded',
      description: 'README.md saved to your downloads',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
            <Github className="h-10 w-10 text-primary" />
            README Generator
          </h1>
          <p className="text-muted-foreground">
            Generate comprehensive README files from GitHub repositories using AI
          </p>
        </div>

        {/* Input Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Repository URL</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter a public GitHub repository URL (e.g., https://github.com/vercel/next.js)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                disabled={isLoading}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>

            {/* Provenance info */}
            {provenance.length > 0 && (
              <div className="mt-4 p-4 bg-code-bg border border-code-border rounded">
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Files analyzed:
                </h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {provenance.map((item, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-foreground font-mono">{item.file}</span>
                      <span className="text-muted-foreground">— {item.reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Preview markdown={readme} onDownload={handleDownload} />
      </div>
    </div>
  );
}
