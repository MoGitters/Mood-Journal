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
  ],
  "😍": [
    {
      title: "Love Songs",
      description: "Romantic tunes for when you're feeling love",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=450p7goxZqg&list=PLhd1HyMTk3f40fKCY_D0Da5PrXuFQ-YJM"
    },
    {
      title: "Dreamy Romance",
      description: "Soft and tender melodies for those loving moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=rtOvBOTyX00&list=PLgzTt0k8mXzEP-Bfq4e2pGvoELUQuBnLF"
    },
    {
      title: "Sweet Serenades",
      description: "Beautiful ballads that speak to the heart",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f498.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=YBHQbu5rbdQ&list=PLFJa3JBECeSj5O5ppEuHwfDXvtkrJ3wxV"
    }
  ],
  "😌": [
    {
      title: "Peaceful Calm",
      description: "Gentle melodies for your relaxed state of mind",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=DWcJFNfaw9c&list=PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D"
    },
    {
      title: "Tranquil Moments",
      description: "Serene sounds to enhance your contentment",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=lFcSrYw-ARY&list=PLyHCNuCNgUHaD1SqIJK0gLKoGqBZI7Zxy"
    },
    {
      title: "Gentle Flow",
      description: "Soft ambient music for peaceful reflection",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f30a.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=9FiODWW7V-A&list=PLs-8QJXNEcKIDX56TG4MGJPdRJyEDfP-d"
    }
  ],
  "🥰": [
    {
      title: "Heartfelt Hits",
      description: "Songs that capture feelings of appreciation and love",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=pRpeEdMmmQ0&list=PLtDCbLzCRYBPY8FGTXgB8O8f-RnafUx5n"
    },
    {
      title: "Warm & Cozy",
      description: "Comforting tunes for those warm fuzzy feelings",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=q5GG5HJ1hVk&list=PLzDIvJVUEgmP4oUKBu8sHFcUqQwxGrCUY"
    },
    {
      title: "Sweet Melodies",
      description: "Delightful songs that make your heart smile",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f496.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=SXH8OQHxmi4&list=PLoum0xT_lgY75_N-SGO5YlGOJjY43drC7"
    }
  ],
  "😎": [
    {
      title: "Confidence Boost",
      description: "Tracks to boost your confidence and cool factor",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=btPJPFnesV4&list=PLZyqOyXxaVETqpHhT_c5GPmAPzhJpJ5K7"
    },
    {
      title: "Swagger Sounds",
      description: "Music with attitude for when you're feeling cool",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=UBhdIcb84Hw&list=PL8A83124F1D79BD4F"
    },
    {
      title: "Smooth Grooves",
      description: "Laid-back tracks with serious style",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b8.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=3MJfcu9yi-Y&list=PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D"
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
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=9E6b3swbnWg&list=PLgzTt0k8mXzHcKebL8d0uYtcYfN0wlAGT"
    },
    {
      title: "Uplift Your Spirit",
      description: "Tunes to help you rise from disappointment",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=ZbZSe6N_BXs&list=PL4QNnZJr8sRNKjKzArmzTBAlNYBDN2h-J"
    },
    {
      title: "Tomorrow Is New",
      description: "Music that reminds you better days are ahead",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f305.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=btPJPFnesV4&list=PLsRK9diRwWVPLZQe6JnmW7OfR0Nu4kxO-"
    }
  ],
  "😡": [
    {
      title: "Release The Tension",
      description: "High-energy tracks to channel your frustration",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=eQK7KSTQfaw&list=PLhJU9P8jP3ie_f8MDcn9SmastfXJ3vg-C"
    },
    {
      title: "Calm The Storm",
      description: "Music to help soothe intense emotions",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=n5aMav6q-o0&list=PLOdWwx_wvTXqDiudnnVpf7cHw64WXa6IL"
    },
    {
      title: "Power Through",
      description: "Strong beats to transform anger into strength",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/26a1.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=04F4xlWSFh0&list=PLbspVHA443Z9_q0I9D8Ur5HYjDIqqHKWl"
    }
  ],
  
  // Other moods
  "😴": [
    {
      title: "Sleep Sounds",
      description: "Gentle melodies to help you drift into sleep",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=bP9gMpl1gyQ&list=PLJDrgUQmcM5JCVY5AxxF_rLwJgb8z5-EL"
    },
    {
      title: "Dream Journey",
      description: "Peaceful tunes for restful nights",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&list=PLrJzC2tREWK3fxMoIHmXMu8JkwIGUTadu"
    },
    {
      title: "Night Whispers",
      description: "Soothing ambient sounds for bedtime",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f319.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=1ZYbU82GVz4&list=PLsO8fxO6PnRdR0yQ5hEfo6sQ40ajYmP2z"
    }
  ],
  "🤔": [
    {
      title: "Focus Flow",
      description: "Music to help you concentrate and think clearly",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b6.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A"
    },
    {
      title: "Deep Thoughts",
      description: "Instrumental tracks for contemplative moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3b5.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=rDXQMzlN5aE&list=PLx2rsLdDtDyYggDL7k3iQFCokRvGRk8t1"
    },
    {
      title: "Mind Expansion",
      description: "Thought-provoking music for curious moments",
      imageUrl: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f9e0.svg",
      youtubeUrl: "https://www.youtube.com/watch?v=5yx6BWlEVcY&list=PLwgftDJiBmL-dhrWwh0E6Meulwmm7-okE"
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