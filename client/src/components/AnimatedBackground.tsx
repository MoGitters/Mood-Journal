import FloatingCharacter from "./FloatingCharacter";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Bears */}
      <FloatingCharacter
        type="bear"
        position={{ left: "15%" }}
        animationDelay={0}
        size={{ width: 16, height: 16 }}
      />
      
      <FloatingCharacter
        type="bear"
        position={{ left: "75%" }}
        animationDelay={3}
        size={{ width: 12, height: 12 }}
      />
      
      {/* Bunnies */}
      <FloatingCharacter
        type="bunny"
        position={{ left: "30%" }}
        animationDelay={5}
        size={{ width: 14, height: 14 }}
      />
      
      <FloatingCharacter
        type="bunny"
        position={{ left: "60%" }}
        animationDelay={8}
        size={{ width: 10, height: 10 }}
      />

      {/* Additional characters */}
      <FloatingCharacter
        type="bear"
        position={{ left: "45%" }}
        animationDelay={2.5}
        size={{ width: 14, height: 14 }}
      />
      
      <FloatingCharacter
        type="bunny"
        position={{ left: "85%" }}
        animationDelay={6}
        size={{ width: 12, height: 12 }}
      />
    </div>
  );
}
