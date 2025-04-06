import { motion } from "framer-motion";

type CharacterType = "bear" | "bunny";

interface FloatingCharacterProps {
  type: CharacterType;
  position: {
    left: string;
  };
  animationDelay: number;
  size: {
    width: number;
    height: number;
  };
}

export default function FloatingCharacter({
  type,
  position,
  animationDelay,
  size
}: FloatingCharacterProps) {
  return (
    <motion.div
      className="floating-character"
      style={{
        ...position,
        animationDelay: `${animationDelay}s`,
        opacity: 0.6
      }}
      initial={{ y: "-100vh" }}
      animate={{ y: "100vh" }}
      transition={{
        duration: type === "bear" ? 15 : 10,
        repeat: Infinity,
        ease: "linear",
        delay: animationDelay
      }}
    >
      <motion.div
        className={`relative ${type === "bear" ? "bg-[#CEBB9C]" : "bg-white"} rounded-full`}
        style={{
          width: `${size.width}rem`,
          height: `${size.height}rem`
        }}
        animate={{ rotate: [-5, 5, -5] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Character features */}
        {type === "bear" ? (
          <>
            {/* Bear ears */}
            <div 
              className="absolute bg-[#CEBB9C] rounded-full"
              style={{
                width: `${size.width * 0.375}rem`,
                height: `${size.width * 0.375}rem`,
                top: `${-size.width * 0.1875}rem`,
                left: `${-size.width * 0.0625}rem`
              }}
            ></div>
            <div 
              className="absolute bg-[#CEBB9C] rounded-full" 
              style={{
                width: `${size.width * 0.375}rem`,
                height: `${size.width * 0.375}rem`,
                top: `${-size.width * 0.1875}rem`,
                right: `${-size.width * 0.0625}rem`
              }}
            ></div>
            
            {/* Bear muzzle */}
            <div 
              className="absolute bg-[#F5F5DC] rounded-full" 
              style={{
                width: `${size.width * 0.5}rem`,
                height: `${size.width * 0.3125}rem`,
                bottom: `${size.width * 0.1875}rem`,
                left: `${size.width * 0.25}rem`
              }}
            ></div>
            
            {/* Bear eyes */}
            <div 
              className="absolute bg-black rounded-full" 
              style={{
                width: `${size.width * 0.125}rem`,
                height: `${size.width * 0.125}rem`,
                top: `${size.width * 0.3125}rem`,
                left: `${size.width * 0.25}rem`
              }}
            ></div>
            <div 
              className="absolute bg-black rounded-full" 
              style={{
                width: `${size.width * 0.125}rem`,
                height: `${size.width * 0.125}rem`,
                top: `${size.width * 0.3125}rem`,
                right: `${size.width * 0.25}rem`
              }}
            ></div>
            
            {/* Bear nose */}
            <div 
              className="absolute bg-black rounded-full" 
              style={{
                width: `${size.width * 0.1875}rem`,
                height: `${size.width * 0.125}rem`,
                top: `${size.width * 0.5}rem`,
                left: `50%`,
                transform: `translateX(-50%)`
              }}
            ></div>
          </>
        ) : (
          <>
            {/* Bunny ears */}
            <div 
              className="absolute bg-white rounded-full"
              style={{
                width: `${size.width * 0.36}rem`,
                height: `${size.width * 0.71}rem`,
                top: `${-size.width * 0.57}rem`,
                left: `${-size.width * 0.07}rem`,
                transform: `rotate(-12deg)`
              }}
            ></div>
            <div 
              className="absolute bg-white rounded-full"
              style={{
                width: `${size.width * 0.36}rem`,
                height: `${size.width * 0.71}rem`,
                top: `${-size.width * 0.57}rem`,
                right: `${-size.width * 0.07}rem`,
                transform: `rotate(12deg)`
              }}
            ></div>
            
            {/* Bunny muzzle */}
            <div 
              className="absolute bg-pink-100 rounded-full"
              style={{
                width: `${size.width * 0.43}rem`,
                height: `${size.width * 0.29}rem`,
                bottom: `${size.width * 0.21}rem`,
                left: `${size.width * 0.29}rem`
              }}
            ></div>
            
            {/* Bunny eyes */}
            <div 
              className="absolute bg-black rounded-full"
              style={{
                width: `${size.width * 0.14}rem`,
                height: `${size.width * 0.14}rem`,
                top: `${size.width * 0.36}rem`,
                left: `${size.width * 0.29}rem`
              }}
            ></div>
            <div 
              className="absolute bg-black rounded-full"
              style={{
                width: `${size.width * 0.14}rem`,
                height: `${size.width * 0.14}rem`,
                top: `${size.width * 0.36}rem`,
                right: `${size.width * 0.29}rem`
              }}
            ></div>
            
            {/* Bunny nose */}
            <div 
              className="absolute bg-black rounded-full"
              style={{
                width: `${size.width * 0.14}rem`,
                height: `${size.width * 0.07}rem`,
                top: `${size.width * 0.57}rem`,
                left: `50%`,
                transform: `translateX(-50%)`
              }}
            ></div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
