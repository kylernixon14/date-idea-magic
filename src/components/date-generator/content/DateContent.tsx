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
      className="prose prose-slate max-w-none text-base md:text-lg [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-0 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-6 [&>p]:mb-4 [&>ul]:mt-2 [&>ul]:mb-4 [&>ul>li]:mb-2"
      dangerouslySetInnerHTML={{ __html: dateIdea || '' }}
    />
  );
}