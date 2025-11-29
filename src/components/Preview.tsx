/**
 * Markdown preview component
 * Renders markdown content with syntax highlighting and custom styling
 */

import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface PreviewProps {
  markdown: string;
  onDownload: () => void;
}

export default function Preview({ markdown, onDownload }: PreviewProps) {
  if (!markdown) {
    return (
      <Card className="h-full border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Generated README will appear here...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-card-foreground">Preview</CardTitle>
        <Button
          onClick={onDownload}
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download README.md
        </Button>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[calc(100vh-12rem)]">
        <div className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown
            components={{
              // Custom styling for markdown elements
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-foreground mb-4 mt-6 border-b border-border pb-2">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-foreground mb-3 mt-5">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-foreground mb-3 leading-relaxed">{children}</p>
              ),
              code: ({ node, className, children, ...props }: any) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-code-bg text-primary px-1.5 py-0.5 rounded text-sm border border-code-border">
                    {children}
                  </code>
                ) : (
                  <code className="block bg-code-bg text-foreground p-4 rounded border border-code-border overflow-x-auto text-sm">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                <pre className="bg-code-bg rounded border border-code-border overflow-x-auto my-4">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside text-foreground mb-3 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside text-foreground mb-3 space-y-1">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-foreground ml-4">{children}</li>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
