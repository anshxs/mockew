import { MarkdownRenderer } from "./markdown-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

export function CodeReview({ review }: { review: string }) {
  return (
    <Card className="border-2 border-2 rounded-[30px]">
  <CardHeader>
    <CardTitle>💖 Code Review</CardTitle>
  </CardHeader>
  <CardContent className="flex-1">
    <ScrollArea type="always" className="h-[70vh] w-full">
      {review ? (
        <MarkdownRenderer content={review} />
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <p>Click &quot;Review File&quot; to analyze this file</p>
        </div>
      )}
    </ScrollArea>
  </CardContent>
</Card>

  );
}