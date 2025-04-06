import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedBackground from "@/components/AnimatedBackground";
import { JournalEntry } from "@shared/schema";

export default function Entries() {
  const [expandedEntry, setExpandedEntry] = useState<number | null>(null);

  // Fetch all journal entries
  const { data: entries, isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  const toggleExpand = (id: number) => {
    if (expandedEntry === id) {
      setExpandedEntry(null);
    } else {
      setExpandedEntry(id);
    }
  };

  return (
    <div className="relative container mx-auto px-4 py-6 flex flex-col min-h-screen">
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
            >
              <ArrowLeft className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Journal Entries</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="journal-bg rounded-3xl shadow-lg p-6 max-w-3xl mx-auto">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="mb-4 overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : entries && entries.length > 0 ? (
            // Display entries
            entries.map((entry) => (
              <Card 
                key={entry.id} 
                className="mb-4 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => toggleExpand(entry.id)}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {format(new Date(entry.date), "MMMM d, yyyy")}
                  </CardTitle>
                  <div className="text-3xl">{entry.mood}</div>
                </CardHeader>
                <CardContent>
                  {expandedEntry === entry.id ? (
                    <div className="relative">
                      <p className="whitespace-pre-wrap">{entry.content}</p>
                      
                      {/* Render stickers */}
                      {entry.stickers && entry.stickers.length > 0 && (
                        <div className="relative h-40 mt-4 border border-gray-100 rounded-lg">
                          {entry.stickers.map((sticker, index) => (
                            <img
                              key={`${sticker.id}-${index}`}
                              src={sticker.imageUrl}
                              alt={sticker.id}
                              className="absolute"
                              style={{
                                left: `${sticker.posX}px`,
                                top: `${sticker.posY}px`,
                                width: `${sticker.width}px`,
                                height: `${sticker.height}px`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                      {entry.content}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            // No entries
            <div className="text-center py-10">
              <h3 className="text-xl font-medium mb-2">No journal entries yet</h3>
              <p className="text-gray-500 mb-4">Start documenting your moods and feelings today!</p>
              <Link href="/">
                <Button className="bg-pastel-purple text-white">Create First Entry</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
