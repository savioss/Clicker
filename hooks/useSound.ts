import { useCallback, useRef, useEffect } from 'react';

export const useSound = (soundUrl: string): (() => void) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // This effect manages the lifecycle of the Audio object. It creates the
  // object when the component mounts (or soundUrl changes) and cleans it
  // up when the component unmounts.
  useEffect(() => {
    // Create the audio object but do not play it. This is compliant with
    // modern browser autoplay policies that require a user gesture for playback.
    const audio = new Audio(soundUrl);
    audio.preload = 'auto'; // Hint to the browser to start loading the audio
    audioRef.current = audio;

    // Cleanup function:
    // When the component unmounts or soundUrl changes, pause any ongoing
    // playback and release the reference.
    return () => {
      if (audio) {
        audio.pause();
      }
      audioRef.current = null;
    };
  }, [soundUrl]); // This effect re-runs if the soundUrl prop ever changes.

  const play = useCallback(() => {
    if (!audioRef.current) {
      console.error("Audio element is not available.");
      return;
    }
    
    // Rewind to the start before playing. This allows the sound to be
    // played again in rapid succession.
    audioRef.current.currentTime = 0;
    
    // The .play() method returns a Promise.
    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // This error is common and expected in certain situations:
        // 1. In sandboxed environments (like the AI Studio preview) that block audio.
        // 2. If .play() is called without a direct user interaction (e.g., a click).
        console.error("Audio playback failed:", error);
      });
    }
  }, []); // The play function itself doesn't need dependencies as it uses the ref.

  return play;
};