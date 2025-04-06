// Mood-based playlist recommendations
// Maps mood emojis to playlist suggestions with titles and descriptions

export interface PlaylistItem {
  title: string;
  description: string;
  // In a real app, this could be a link to Spotify, Apple Music, etc.
  // For now, we'll use YouTube links
  imageUrl: string;
  youtubeUrl?: string; // Make it optional since not all playlists have links yet
}

export const moodPlaylists: Record<string, PlaylistItem[]> = {
  // Happy/Positive moods
  "😊": [
    {
      title: "Happy Hits",
      description: "Upbeat and cheerful songs to maintain your happy mood",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=I140iNpx1xM"
    },
    {
      title: "Good Vibes",
      description: "Feel-good tunes for a positive day",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=Ln4KSN0rchI"
    },
    {
      title: "Sunshine Pop",
      description: "Bright and sunny melodies to brighten your day",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f31e.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=HyHNuVaZJ-k&list=PLhd1HyMTk3f5PzRjJzmzH7kkxjfkz9rOZ"
    }
  ],
  "😍": [
    {
      title: "Love Songs",
      description: "Romantic tunes for when you're feeling love",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Dreamy Romance",
      description: "Soft and tender melodies for those loving moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Sweet Serenades",
      description: "Beautiful ballads that speak to the heart",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f498.svg"
    }
  ],
  "😌": [
    {
      title: "Peaceful Calm",
      description: "Gentle melodies for your relaxed state of mind",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Tranquil Moments",
      description: "Serene sounds to enhance your contentment",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Gentle Flow",
      description: "Soft ambient music for peaceful reflection",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f30a.svg"
    }
  ],
  "🥰": [
    {
      title: "Heartfelt Hits",
      description: "Songs that capture feelings of appreciation and love",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Warm & Cozy",
      description: "Comforting tunes for those warm fuzzy feelings",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Sweet Melodies",
      description: "Delightful songs that make your heart smile",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f496.svg"
    }
  ],
  "😎": [
    {
      title: "Confidence Boost",
      description: "Tracks to boost your confidence and cool factor",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Swagger Sounds",
      description: "Music with attitude for when you're feeling cool",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Smooth Grooves",
      description: "Laid-back tracks with serious style",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b8.svg"
    }
  ],
  
  // Sad/Negative moods
  "😢": [
    {
      title: "Melancholy Melodies",
      description: "Songs that understand your sadness",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=60ItHLz5WEA&list=PLw-VjHDlEOgvWPpRBs9FRGgJcKpDimTqf"
    },
    {
      title: "Healing Tunes",
      description: "Music to help process your feelings",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=6Ejga4kJUts&list=PLCVGGn6GhhDtYomlFrJ-cUxdpC5e2gNiP"
    },
    {
      title: "Rainy Day Reflections",
      description: "Contemplative songs for emotional moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f327.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=M_nGCIASWHA&list=PL-xO__JU8YNTDb5x3sRsWmEuJZW9vJZ0U"
    }
  ],
  "😞": [
    {
      title: "Blue Mood",
      description: "Songs to accompany your disappointment",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Uplift Your Spirit",
      description: "Tunes to help you rise from disappointment",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Tomorrow Is New",
      description: "Music that reminds you better days are ahead",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f305.svg"
    }
  ],
  "😡": [
    {
      title: "Release The Tension",
      description: "High-energy tracks to channel your frustration",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Calm The Storm",
      description: "Music to help soothe intense emotions",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Power Through",
      description: "Strong beats to transform anger into strength",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/26a1.svg"
    }
  ],
  
  // Other moods
  "😴": [
    {
      title: "Sleep Sounds",
      description: "Gentle melodies to help you drift into sleep",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Dream Journey",
      description: "Peaceful tunes for restful nights",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Night Whispers",
      description: "Soothing ambient sounds for bedtime",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg"
    }
  ],
  "🤔": [
    {
      title: "Focus Flow",
      description: "Music to help you concentrate and think clearly",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg"
    },
    {
      title: "Deep Thoughts",
      description: "Instrumental tracks for contemplative moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg"
    },
    {
      title: "Mind Expansion",
      description: "Thought-provoking music for curious moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9e0.svg"
    }
  ]
};

// Default playlist recommendations for when no specific mood is matched
export const defaultPlaylists: PlaylistItem[] = [
  {
    title: "Mood Mix",
    description: "A balanced mix of songs for any mood",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
    youtubeUrl: "https://www.youtube.com/watch?v=kTJczUoc26U&list=PLfOG5qRn-NH5sTwG5_XQWlRKWUZnqYN6f"
  },
  {
    title: "Daily Discovery",
    description: "New music to discover regardless of your mood",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
    youtubeUrl: "https://www.youtube.com/watch?v=CvUK-YWYcaE&list=PLO2MyApnT0PKMeBKzPz0y43QHwSnXSvxD"
  },
  {
    title: "Timeless Classics",
    description: "Evergreen hits that work for any emotion",
    imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b8.svg",
    youtubeUrl: "https://www.youtube.com/watch?v=C4p_Oyez1JI&list=PLf8_TFoQQLQqsOQR02EgMTJqpLqDJN9vS"
  }
];

// Get playlist recommendations based on mood
export function getPlaylistsByMood(mood: string): PlaylistItem[] {
  return moodPlaylists[mood] || defaultPlaylists;
}