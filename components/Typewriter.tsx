import React, { useState, useEffect, useRef } from 'react';
import { SFX_SOURCES } from '../storyData';

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  enableSound?: boolean;
  instant?: boolean; // New prop to force immediate display
}

const Typewriter: React.FC<Props> = ({ text, speed = 30, onComplete, className = "", enableSound = false, instant = false }) => {
  const [displayLength, setDisplayLength] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    if (enableSound && !audioRef.current) {
        audioRef.current = new Audio(SFX_SOURCES.TYPING_DATA);
        audioRef.current.volume = 0.2; 
    }
  }, [enableSound]);

  const playTypingSound = () => {
      if (audioRef.current && !instant) {
          const clone = audioRef.current.cloneNode() as HTMLAudioElement;
          clone.volume = 0.15;
          clone.play().catch(() => {});
      }
  };

  // Reset when text changes
  useEffect(() => {
    setDisplayLength(0);
    setIsFinished(false);
  }, [text]);

  // Instant Display Logic
  useEffect(() => {
      if (instant && !isFinished) {
          setDisplayLength(text.length);
          setIsFinished(true);
          if (onComplete) onComplete();
      }
  }, [instant, text.length, isFinished, onComplete]);

  // Typing Interval Logic
  useEffect(() => {
    // If instant is true, we rely on the effect above, skip interval
    if (instant) return;

    if (displayLength >= text.length) {
        if (!isFinished) {
            setIsFinished(true);
            if (onComplete) onComplete();
        }
        return;
    }

    const timeoutId = setTimeout(() => {
        setDisplayLength((prev) => prev + 1);
        if (enableSound && displayLength % 3 === 0) { // Play sound every 3rd char
            playTypingSound();
        }
    }, speed);

    return () => clearTimeout(timeoutId);
  }, [displayLength, text, speed, enableSound, isFinished, onComplete, instant]);

  // Use slice to ensure we render exact substring, preventing duplication
  const displayedText = text.slice(0, displayLength);

  return (
    <div className={className}>
      {displayedText}
      {!isFinished && <span className="animate-pulse text-emerald-500 font-bold">_</span>}
    </div>
  );
};

export default Typewriter;