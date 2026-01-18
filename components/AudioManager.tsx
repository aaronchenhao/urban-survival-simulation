import React, { useEffect, useRef, useState } from 'react';
import { GameState } from '../types';
import { AUDIO_SOURCES, BGM_PLAYLIST } from '../storyData';

interface Props {
  gameState: GameState;
}

const AudioManager: React.FC<Props> = ({ gameState }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Default muted
  const [volume, setVolume] = useState(0.25); // Max volume comfortably below text reading level

  // Decide which track should play based on GameState
  const getTargetTrack = (): string | null => {
    const { screen, endingType, currentEvents, currentEventIndex } = gameState;

    if (screen === 'intro' || screen === 'allocation') {
      return BGM_PLAYLIST.INTRO;
    }

    if (screen === 'summary') {
      return BGM_PLAYLIST.SUMMARY;
    }

    if (screen === 'ending') {
      if (endingType === 'slaughtered') return BGM_PLAYLIST.ENDING_BAD;
      if (endingType === 'survival') return BGM_PLAYLIST.ENDING_SURVIVAL;
      if (endingType === 'success') return BGM_PLAYLIST.ENDING_SUCCESS;
      return BGM_PLAYLIST.ENDING_BAD;
    }

    if (screen === 'game') {
      const currentEvent = currentEvents[currentEventIndex];
      if (!currentEvent || !currentEvent.category) return BGM_PLAYLIST.DEFAULT;

      switch (currentEvent.category) {
        case 'work': return BGM_PLAYLIST.WORK;
        case 'love': return BGM_PLAYLIST.LOVE;
        case 'housing': return BGM_PLAYLIST.HOUSING;
        case 'health': return BGM_PLAYLIST.HEALTH;
        case 'moral': return BGM_PLAYLIST.MORAL;
        default: return BGM_PLAYLIST.DEFAULT;
      }
    }

    return BGM_PLAYLIST.DEFAULT;
  };

  useEffect(() => {
    const targetTrackName = getTargetTrack();
    if (!targetTrackName) return;

    // Handle "Silence before Ending"
    if (gameState.screen === 'ending' && targetTrackName !== currentTrack) {
        // Stop current
        if (audioRef.current) {
            fadeOutAndStop(audioRef.current, () => {
                 setTimeout(() => {
                    playTrack(targetTrackName);
                 }, 6000); // 6s Silence
            });
        } else {
             setTimeout(() => {
                playTrack(targetTrackName);
             }, 6000);
        }
        return;
    }

    // Normal Transition
    if (targetTrackName !== currentTrack) {
       playTrack(targetTrackName);
    }
  }, [gameState.screen, gameState.currentEventIndex, gameState.endingType]);

  const playTrack = (trackName: string) => {
      const url = AUDIO_SOURCES[trackName];
      if (!url) return;

      if (audioRef.current) {
          // Crossfade logic: Fade out old, then set src, then fade in
          fadeOutAndStop(audioRef.current, () => {
              setCurrentTrack(trackName);
              if (audioRef.current) {
                  audioRef.current.src = url;
                  audioRef.current.volume = 0;
                  const playPromise = audioRef.current.play();
                  if (playPromise !== undefined) {
                      playPromise.then(() => {
                          fadeIn(audioRef.current!);
                      }).catch(e => console.log("Audio play blocked (user interaction required):", e));
                  }
              }
          });
      } else {
          // First time init
          setCurrentTrack(trackName);
          const audio = new Audio(url);
          audio.loop = true;
          audio.volume = 0;
          audioRef.current = audio;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
              playPromise.then(() => {
                  fadeIn(audio);
              }).catch(e => console.log("Audio play blocked:", e));
          }
      }
  };

  const fadeOutAndStop = (audio: HTMLAudioElement, callback: () => void) => {
      const fadeInterval = setInterval(() => {
          if (audio.volume > 0.02) {
              audio.volume -= 0.02;
          } else {
              clearInterval(fadeInterval);
              audio.pause();
              callback();
          }
      }, 50); // Fade out over ~1 sec (0.25 -> 0 / 50ms)
  };

  const fadeIn = (audio: HTMLAudioElement) => {
      if (isMuted) return; // Don't fade in if muted
      const fadeInterval = setInterval(() => {
          if (audio.volume < volume - 0.02) {
              audio.volume += 0.02;
          } else {
              audio.volume = volume;
              clearInterval(fadeInterval);
          }
      }, 50);
  };

  useEffect(() => {
      if (audioRef.current) {
          audioRef.current.muted = isMuted;
          if (!isMuted) audioRef.current.volume = volume;
      }
  }, [isMuted, volume]);

  return (
    <div className="fixed top-16 right-2 md:top-20 md:right-4 z-50 pointer-events-auto">
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="bg-black/80 backdrop-blur border border-zinc-700 text-cyan-400 p-1.5 md:p-2 rounded-full hover:bg-zinc-800 transition-colors opacity-50 hover:opacity-100"
        style={{ fontSize: '14px' }}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
      {/* Hidden debug info if needed */}
      {/* <div className="text-[10px] text-zinc-600 mt-1 text-right">{currentTrack}</div> */}
    </div>
  );
};

export default AudioManager;