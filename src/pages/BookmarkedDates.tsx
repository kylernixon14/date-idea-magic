import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookmarkedDate {
  id: string;
  date_idea: string;
  created_at: string;
}

const BookmarkedDates = () => {
  const [dates, setDates] = useState<BookmarkedDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBookmarkedDates();
  }, []);

  const loadBookmarkedDates = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmarked_dates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDates(data || []);
    } catch (error) {
      console.error('Error loading bookmarked dates:', error);
      toast({
        title: "Error loading bookmarked dates",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarked_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDates(dates.filter(date => date.id !== id));
      toast({
        title: "Date deleted",
        description: "The date has been removed from your bookmarks.",
      });
    } catch (error) {
      console.error('Error deleting date:', error);
      toast({
        title: "Error deleting date",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Bookmarked Dates</h1>
        {isLoading ? (
          <p>Loading your bookmarked dates...</p>
        ) : dates.length === 0 ? (
          <p>You haven't bookmarked any dates yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dates.map((date) => (
              <Card key={date.id} className="h-full">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full">
                    <div
                      className="prose prose-sm flex-1 mb-3"
                      dangerouslySetInnerHTML={{ __html: date.date_idea }}
                    />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(date.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookmarkedDates;