import { useState } from "react";
import { PlaylistItem } from "@/lib/moodPlaylists";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Music } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface PlaylistRecommendationsProps {
  currentMood: string;
}

export default function PlaylistRecommendations({ currentMood }: PlaylistRecommendationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fixed playlists with the specific titles and links as requested
  const fixedPlaylists: PlaylistItem[] = [
    {
      title: "Happy Vibes",
      description: "Upbeat and cheerful songs to maintain your happy mood",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=I140iNpx1xM"
    },
    {
      title: "Coffee Vibes",
      description: "Feel-good tunes for a positive day",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=Ln4KSN0rchI&t=6s"
    },
    {
      title: "Chill Vibes",
      description: "Bright and sunny melodies to brighten your day",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31e.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=DEWzT1geuPU"
    }
  ];

  // Opens YouTube link in new tab
  const openYouTube = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="mt-6">
      <div 
        className="flex items-center gap-2 cursor-pointer mb-3" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Music className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">
          {isExpanded ? "Hide Music Recommendations" : "Music For Your Mood"}
        </h3>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fixedPlaylists.map((playlist, index) => (
            <motion.div
              key={playlist.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="playlist-card bg-white/90 hover:bg-white">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <img 
                      src={playlist.imageUrl} 
                      alt="Music" 
                      className="playlist-image w-10 h-10" 
                    />
                  </div>
                  <CardTitle className="text-md">{playlist.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{playlist.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  {playlist.youtubeUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                      onClick={() => openYouTube(playlist.youtubeUrl)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4 mr-1" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                      Listen on YouTube
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}