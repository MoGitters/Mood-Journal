import { useState } from "react";
import { getPlaylistsByMood, PlaylistItem } from "@/lib/moodPlaylists";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Music } from "lucide-react";
import { motion } from "framer-motion";

interface PlaylistRecommendationsProps {
  currentMood: string;
}

export default function PlaylistRecommendations({ currentMood }: PlaylistRecommendationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const playlists = getPlaylistsByMood(currentMood);

  // If there are no playlists for this mood, don't render anything
  if (!playlists || playlists.length === 0) {
    return null;
  }

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
          {playlists.map((playlist, index) => (
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
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}