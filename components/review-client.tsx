"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CodeReview } from "./code-review";
import { FileContent } from "./file-content";
import {Badge} from "@/components/ui/badge"

export function ReviewClient({
  files,
  selectedFile,
  file: currentFile,
  onSelectFile,
}: {
  files: string[];
  selectedFile: { content?: string; error?: string };
  file: string;
  onSelectFile: (fileName: string) => void;
}) {

  const [review, setReview] = useState<string>("");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [lineComments, setLineComments] = useState<Record<number, string>>({});
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Reset review state when file changes
    setReview("");
    setHighlightedLines([]);
    setLineComments({});
    setSelectedLine(null);
    setShowDialog(false);
  }, [currentFile]);

  useEffect(() => {
    if (review) {
      const lines = new Set<number>();
      const comments: Record<number, string> = {};

      // Patterns to match line numbers in the review
      const lineNumberPatterns = [
        /Line\s+(\d+)-(\d+):/g, // Matches "Line 1-5:"
        /Line\s+(\d+):/g, // Matches "Line 1:"
        /^\s*(\d+)\.\s+/gm, // Matches "1. " at start of line
        /^\s*(\d+)\)\s+/gm, // Matches "1) " at start of line
        /^\s*(\d+)\s+/gm, // Matches "1 " at start of line
        /line\s+(\d+)/gi, // Matches "line 1" (case insensitive)
        /lines?\s+(\d+)(?:\s*-\s*(\d+))?/gi, // Matches "line 1" or "lines 1-5"
      ];

      for (const pattern of lineNumberPatterns) {
        let match;
        while ((match = pattern.exec(review)) !== null) {
          if (match[1] && match[2]) {
            // Handle line ranges (e.g., "lines 1-5")
            const startLine = parseInt(match[1]);
            const endLine = parseInt(match[2]);
            if (!isNaN(startLine) && !isNaN(endLine)) {
              for (let i = startLine; i <= endLine; i++) {
                lines.add(i);
                // Extract the comment text after the line number
                const commentStart = match.index + match[0].length;
                const nextSectionMatch = review
                  .slice(commentStart)
                  .match(
                    /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                  );
                if (nextSectionMatch) {
                  comments[i] = nextSectionMatch[0].trim();
                }
              }
            }
          } else if (match[1]) {
            // Handle single line (e.g., "line 1")
            const lineNumber = parseInt(match[1]);
            if (!isNaN(lineNumber)) {
              lines.add(lineNumber);
              const commentStart = match.index + match[0].length;
              const nextSectionMatch = review
                .slice(commentStart)
                .match(
                  /^[^\n]+(?:\n(?!\d+\.|\d+\)|\d+\s|Line\s+\d|line\s+\d)[^\n]*)*/
                );
              if (nextSectionMatch) {
                comments[lineNumber] = nextSectionMatch[0].trim();
              }
            }
          }
        }
      }

      setHighlightedLines(Array.from(lines).sort((a, b) => a - b));
      setLineComments(comments);
    }
  }, [review]);

  const handleLineClick = (lineNumber: number) => {
    setSelectedLine(lineNumber);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedLine(null);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6'>
      <Card className='border-2 rounded-[30px]'>
        <CardHeader>
          <CardTitle>ᛋ Project Files</CardTitle>
        </CardHeader>
        <CardContent className='flex-1'>
            <ScrollArea type="always" className="h-[70vh] w-full">
              <div>
                {files.length === 0 ? (
                  <p className='text-muted-foreground'>Loading files...</p>
                ) : (
                  files.map((file) => (
                    <div
  key={file}
  onClick={() => onSelectFile(file)}
  className="px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-pink-50"
>


                      <div className='flex items-center justify-between'>
                        <span
                          className={cn(
                            "font-mono",
                            file === currentFile && "text-purple-600 font-bold"
                          )}
                        >
                          {file}
                        </span>
                        {file === currentFile && (
                          <Badge className='bg-purple-600/10 text-purple-600'>
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
        </CardContent>
      </Card>

      <FileContent
        selectedFile={currentFile}
        fileContent={selectedFile.content || ""}
        highlightedLines={highlightedLines}
        lineComments={lineComments}
        onLineClick={handleLineClick}
        setReview={setReview}
        showDialog={showDialog}
        selectedLine={selectedLine}
        onCloseDialog={handleCloseDialog}
      />

      <CodeReview review={review} />
    </div>
  );
}