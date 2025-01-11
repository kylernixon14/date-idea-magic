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
          <div className="space-y-4">
            {dates.map((date) => (
              <Card key={date.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div
                      className="prose flex-1"
                      dangerouslySetInnerHTML={{ __html: date.date_idea }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(date.id)}
                      className="hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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