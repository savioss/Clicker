import { useCallback, useRef, useEffect } from 'react';

// Create a single, shared AudioContext to be reused.
// It starts in a "suspended" state in most browsers until a user gesture.
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
    if (!audioContext) {
        // The 'any' type is used for webkitAudioContext to support older Safari versions.
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};

// This hook manages loading and playing a sound via the more reliable Web Audio API.
export const useSound = (soundUrl: string): (() => void) => {
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const isLoadedRef = useRef(false);

    // Effect to fetch the audio file and decode it into a buffer.
    // This happens once when the component mounts or the soundUrl changes.
    useEffect(() => {
        isLoadedRef.current = false; // Reset loading state if URL changes.

        const loadSound = async () => {
            try {
                const context = getAudioContext();
                const response = await fetch(soundUrl);
                const arrayBuffer = await response.arrayBuffer();
                // Asynchronously decode the audio data.
                const decodedData = await context.decodeAudioData(arrayBuffer);
                audioBufferRef.current = decodedData;
                isLoadedRef.current = true;
            } catch (error) {
                console.error("Failed to load or decode sound:", error);
                isLoadedRef.current = false;
            }
        };

        loadSound();
        
    }, [soundUrl]);

    // The play function that uses the pre-loaded audio buffer.
    const play = useCallback(() => {
        if (!isLoadedRef.current || !audioBufferRef.current) {
            console.warn("Sound not loaded yet, cannot play.");
            return;
        }

        const context = getAudioContext();

        // **This is the crucial fix.**
        // On the first user interaction (the click), we resume the AudioContext
        // if it's in a suspended state. This is required by modern browsers.
        if (context.state === 'suspended') {
            context.resume();
        }

        // Create a new source node from the buffer for each playback.
        const source = context.createBufferSource();
        source.buffer = audioBufferRef.current;
        
        // Connect the source to the context's destination (i.e., the speakers).
        source.connect(context.destination);
        
        // Play the sound immediately.
        source.start(0);

    }, []); // This function is stable and doesn't need dependencies as it uses refs.

    return play;
};
