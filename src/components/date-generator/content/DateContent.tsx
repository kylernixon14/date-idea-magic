interface DateContentProps {
  dateIdea: string | null;
  isLoading: boolean;
}

export function DateContent({ dateIdea, isLoading }: DateContentProps) {
  if (isLoading) {
    return <p className="text-muted-foreground">Generating your perfect date idea...</p>;
  }

  return (
    <div 
      id="date-idea-content"
      className="prose max-w-none text-base md:text-lg whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: dateIdea || '' }}
    />
  );
}