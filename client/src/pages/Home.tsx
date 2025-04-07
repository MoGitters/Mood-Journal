import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BookOpen, Settings, ClipboardList, BarChart2 } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import DateSelector from "@/components/DateSelector";
import MoodSelector from "@/components/MoodSelector";
import JournalEntry from "@/components/JournalEntry";
import StickerPanel from "@/components/StickerPanel";
import PlaylistRecommendations from "@/components/PlaylistRecommendations";
import { JournalEntry as JournalEntryType, Sticker, moodEmojis } from "@shared/schema";

// Extend the Window interface for our debounced save
declare global {
  interface Window {
    stickerSaveTimeout?: ReturnType<typeof setTimeout>;
  }
}

export default function Home() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMood, setSelectedMood] = useState<string>(moodEmojis[0]);
  const [journalText, setJournalText] = useState<string>("");
  const [appliedStickers, setAppliedStickers] = useState<Sticker[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

  // Format date as YYYY-MM-DD for API
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Fetch journal entry for the selected date
  const { data: journalEntry, isLoading } = useQuery<JournalEntryType | null>({
    queryKey: ["/api/journal", formattedDate],
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(`/api/journal/${queryKey[1]}`);
        if (res.status === 404) {
          return null;
        }
        if (!res.ok) {
          throw new Error("Failed to fetch journal entry");
        }
        return res.json();
      } catch (error) {
        console.error("Error fetching entry:", error);
        return null;
      }
    }
  });

  // Update form when entry data is loaded or date changes
  useEffect(() => {
    if (journalEntry) {
      setSelectedMood(journalEntry.mood);
      setJournalText(journalEntry.content);
      setAppliedStickers(journalEntry.stickers || []);
    } else {
      setSelectedMood(moodEmojis[0]);
      setJournalText("");
      setAppliedStickers([]);
    }
  }, [journalEntry, formattedDate]);

  // Save journal entry
  const saveMutation = useMutation({
    mutationFn: async () => {
      const entry = {
        date: selectedDate,
        mood: selectedMood,
        content: journalText,
        stickers: appliedStickers
      };
      
      return apiRequest("POST", "/api/journal", entry);
    },
    onSuccess: () => {
      toast({
        title: "Journal saved!",
        description: "Your mood and thoughts have been saved.",
      });
      // Invalidate the query to refetch data
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/journal", formattedDate] });
    },
    onError: (error) => {
      toast({
        title: "Failed to save",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Handle saving entry
  const handleSaveEntry = () => {
    saveMutation.mutate();
  };

  // Handle clearing entry
  const handleClearEntry = () => {
    setSelectedMood(moodEmojis[0]);
    setJournalText("");
    setAppliedStickers([]);
  };

  // Add sticker to journal
  const handleAddSticker = (sticker: Omit<Sticker, "posX" | "posY" | "width" | "height">) => {
    const canvasElement = document.getElementById("sticker-canvas");
    if (!canvasElement) return;
    
    const canvasRect = canvasElement.getBoundingClientRect();
    
    // Calculate position to be exactly centered in the canvas
    const posX = Math.max(0, (canvasRect.width / 2) - 25);
    const posY = Math.max(0, (canvasRect.height / 2) - 25);
    
    // Create new sticker with centered position
    const newSticker: Sticker = {
      ...sticker,
      posX,
      posY,
      width: 50,
      height: 50
    };
    
    setAppliedStickers([...appliedStickers, newSticker]);
    
    // Save the journal automatically when adding a sticker to ensure persistence
    setTimeout(() => {
      saveMutation.mutate();
    }, 500);
  };

  // Update sticker position
  const updateStickerPosition = (id: string, posX: number, posY: number) => {
    setAppliedStickers(appliedStickers.map(sticker => 
      sticker.id === id ? { ...sticker, posX, posY } : sticker
    ));
    
    // Use a debounced save to avoid too many API calls
    if (window.stickerSaveTimeout) {
      clearTimeout(window.stickerSaveTimeout);
    }
    
    window.stickerSaveTimeout = setTimeout(() => {
      saveMutation.mutate();
    }, 800); // Save 800ms after the last position update
  };

  return (
    <div className="relative container mx-auto px-4 py-6 flex flex-col min-h-screen">
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 bg-white flex items-center justify-center">
            <span className="text-xl">📓</span>
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-md">Mood Journal</h1>
        </div>
        
        <div className="flex gap-2">
          <Link href="/entries">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
              title="Journal Entries"
            >
              <BookOpen className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
          <Link href="/reminders">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
              title="Reminders"
            >
              <ClipboardList className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
          <Link href="/analytics">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
              title="Mood Analytics"
            >
              <BarChart2 className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-pastel-purple" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        <div className="journal-bg rounded-3xl shadow-lg p-6 max-w-3xl mx-auto">
          <DateSelector 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
          
          <MoodSelector 
            selectedMood={selectedMood}
            onMoodSelect={setSelectedMood}
          />
          
          <JournalEntry
            journalText={journalText}
            onJournalTextChange={setJournalText}
            appliedStickers={appliedStickers}
            updateStickerPosition={updateStickerPosition}
          />
          
          <div className="flex justify-between">
            <Button 
              onClick={handleClearEntry}
              className="px-6 py-2 bg-[#6D9BC3] text-white rounded-full shadow-md hover:shadow-lg transition font-medium flex items-center gap-2"
            >
              <span>Clear</span>
            </Button>
            
            <Button 
              onClick={handleSaveEntry}
              className="px-6 py-2 bg-[#4A8EC9] text-white rounded-full shadow-md hover:shadow-lg transition font-medium flex items-center gap-2"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? "Saving..." : "Save Entry"}
            </Button>
          </div>
          
          {/* Mood-based playlist recommendations */}
          <PlaylistRecommendations currentMood={selectedMood} />
        </div>
      </main>

      <StickerPanel 
        isOpen={isPanelOpen}
        onToggle={() => setIsPanelOpen(!isPanelOpen)}
        onStickerSelect={handleAddSticker}
      />
    </div>
  );
}
