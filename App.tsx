
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MonkeyScreen } from './components/MonkeyScreen';
import { useSound } from './hooks/useSound';
import { LOCAL_STORAGE_KEYS, MONKEY_SCREAM_SOUND } from './constants';

const App: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [userClicks, setUserClicks] = useState<number>(0);
    const [totalClicks, setTotalClicks] = useState<number>(0);
    const [isScreaming, setIsScreaming] = useState<boolean>(false);
    
    const playScreamSound = useSound(MONKEY_SCREAM_SOUND);
    const screamTimeoutRef = useRef<number | null>(null);

    // Safely parse JSON from localStorage, memoized to prevent re-creation on re-renders.
    const getAllUsersData = useCallback((): { [email: string]: number } => {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEYS.ALL_USERS_DATA);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return {};
        }
    }, []);

    useEffect(() => {
        // On initial load, try to retrieve the currently logged-in user
        const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.EMAIL);
        if (storedEmail) {
            const allUsersData = getAllUsersData();
            const storedUserClicks = allUsersData[storedEmail] || 0;
            setEmail(storedEmail);
            setUserClicks(storedUserClicks);
        }

        // Load total clicks, defaulting to 0 if not found
        const storedTotalClicks = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.TOTAL_CLICKS) || '0', 10);
        setTotalClicks(storedTotalClicks);
    }, [getAllUsersData]);

    const handleLogin = useCallback((userEmail: string) => {
        const normalizedEmail = userEmail.toLowerCase().trim();
        const allUsersData = getAllUsersData();
        const existingUserClicks = allUsersData[normalizedEmail] || 0;
        
        // Set the current user in local storage to persist the session
        localStorage.setItem(LOCAL_STORAGE_KEYS.EMAIL, normalizedEmail);
        
        // Update the component's state
        setEmail(normalizedEmail);
        setUserClicks(existingUserClicks);
    }, [getAllUsersData]);

    const handleLogout = useCallback(() => {
        // Only remove the session email, keeping the user's score saved
        localStorage.removeItem(LOCAL_STORAGE_KEYS.EMAIL);
        setEmail(null);
        setUserClicks(0);
    }, []);

    const handleMonkeyClick = useCallback(() => {
        if (!email) return; // Prevent clicks when not logged in

        playScreamSound();
        setIsScreaming(true);

        // Use functional updates for robustness with rapid clicks.
        // This ensures each click is counted based on the most recent state.
        setUserClicks(currentClicks => {
            const newUserClicks = currentClicks + 1;
            const allUsersData = getAllUsersData();
            allUsersData[email] = newUserClicks;
            localStorage.setItem(LOCAL_STORAGE_KEYS.ALL_USERS_DATA, JSON.stringify(allUsersData));
            return newUserClicks;
        });

        setTotalClicks(currentTotal => {
            const newTotalClicks = currentTotal + 1;
            localStorage.setItem(LOCAL_STORAGE_KEYS.TOTAL_CLICKS, newTotalClicks.toString());
            return newTotalClicks;
        });

        // Reset the animation timer on each click for immediate feedback.
        if (screamTimeoutRef.current) {
            clearTimeout(screamTimeoutRef.current);
        }

        screamTimeoutRef.current = window.setTimeout(() => {
            setIsScreaming(false);
        }, 500); // Duration of the scream animation
    }, [email, playScreamSound, getAllUsersData]);

    if (!email) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
        <MonkeyScreen
            email={email}
            userClicks={userClicks}
            totalClicks={totalClicks}
            onMonkeyClick={handleMonkeyClick}
            onLogout={handleLogout}
            isScreaming={isScreaming}
        />
    );
};

export default App;
