import { moodEmojis } from "@shared/schema";

interface MoodSelectorProps {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
}

export default function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3 text-center text-pastel-purple">
        How are you feeling today?
      </h2>
      
      <div className="emoji-grid grid grid-cols-5 gap-2 p-3 bg-white bg-opacity-50 rounded-2xl shadow-sm max-w-xs mx-auto">
        {moodEmojis.map((emoji) => (
          <div 
            key={emoji}
            className={`text-center p-2 text-3xl hover:bg-white hover:bg-opacity-50 rounded-xl transition cursor-pointer ${
              selectedMood === emoji ? "bg-white bg-opacity-50" : ""
            }`}
            onClick={() => onMoodSelect(emoji)}
          >
            {emoji}
          </div>
        ))}
      </div>
      
      {/* Selected Mood Display */}
      <div className="flex justify-center mt-6 mb-6">
        <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center shadow-md">
          <span className="text-5xl">{selectedMood}</span>
        </div>
      </div>
    </div>
  );
}
