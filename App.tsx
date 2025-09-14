import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { MonkeyScreen } from './components/MonkeyScreen';
import { useSound } from './hooks/useSound';
import { LOCAL_STORAGE_KEYS, SCREAM_SOUND } from './constants';

interface UserData {
    clicks: number;
    lastPlayed: number;
}

// Support old format (number) for backward compatibility during migration
type AllUsersData = { [email: string]: UserData | number };
type NormalizedUsersData = { [email: string]: UserData };

const App: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [userClicks, setUserClicks] = useState<number>(0);
    const [totalClicks, setTotalClicks] = useState<number>(0);
    const [isScreaming, setIsScreaming] = useState<boolean>(false);
    const [recentPlayers, setRecentPlayers] = useState<{ email: string; clicks: number }[]>([]);
    
    const playScreamSound = useSound(SCREAM_SOUND);
    const screamTimeoutRef = useRef<number | null>(null);

    const getAllUsersData = useCallback((): NormalizedUsersData => {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEYS.ALL_USERS_DATA);
            const parsedData: AllUsersData = data ? JSON.parse(data) : {};
            
            // Normalize data to the new format to ensure consistency
            const normalized: NormalizedUsersData = {};
            for (const userEmail in parsedData) {
                const userData = parsedData[userEmail];
                if (typeof userData === 'number') {
                    // Old format: migrate on the fly. Assign a timestamp of 0 so they appear last if never played again.
                    normalized[userEmail] = { clicks: userData, lastPlayed: 0 };
                } else {
                    normalized[userEmail] = userData;
                }
            }
            return normalized;
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            return {};
        }
    }, []);

    useEffect(() => {
        const storedEmail = localStorage.getItem(LOCAL_STORAGE_KEYS.EMAIL);
        if (storedEmail) {
            const allUsersData = getAllUsersData();
            const storedUserData = allUsersData[storedEmail];
            const storedUserClicks = storedUserData ? storedUserData.clicks : 0;
            setEmail(storedEmail);
            setUserClicks(storedUserClicks);
        }

        const storedTotalClicks = parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.TOTAL_CLICKS) || '0', 10);
        setTotalClicks(storedTotalClicks);
    }, [getAllUsersData]);

    // This effect updates the recent players list whenever a click happens (tracked by totalClicks)
    useEffect(() => {
        const allUsersData = getAllUsersData();
        const players = Object.entries(allUsersData)
            .map(([email, data]) => ({
                email,
                clicks: data.clicks,
                lastPlayed: data.lastPlayed
            }))
            .filter(p => p.lastPlayed > 0); // Only show players who have played with the new system

        players.sort((a, b) => b.lastPlayed - a.lastPlayed);

        setRecentPlayers(players.slice(0, 10).map(({ email, clicks }) => ({ email, clicks })));
    }, [totalClicks, getAllUsersData]);


    const handleLogin = useCallback((userEmail: string) => {
        const normalizedEmail = userEmail.toLowerCase().trim();
        const allUsersData = getAllUsersData();
        const existingUserData = allUsersData[normalizedEmail];
        const existingUserClicks = existingUserData ? existingUserData.clicks : 0;
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.EMAIL, normalizedEmail);
        
        setEmail(normalizedEmail);
        setUserClicks(existingUserClicks);
    }, [getAllUsersData]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.EMAIL);
        setEmail(null);
        setUserClicks(0);
    }, []);

    const handleMonkeyClick = useCallback(() => {
        if (!email) return;

        playScreamSound();
        setIsScreaming(true);

        setUserClicks(currentClicks => {
            const newUserClicks = currentClicks + 1;
            const allUsersData = getAllUsersData();
            allUsersData[email] = {
                clicks: newUserClicks,
                lastPlayed: Date.now()
            };
            localStorage.setItem(LOCAL_STORAGE_KEYS.ALL_USERS_DATA, JSON.stringify(allUsersData));
            return newUserClicks;
        });

        setTotalClicks(currentTotal => {
            const newTotalClicks = currentTotal + 1;
            localStorage.setItem(LOCAL_STORAGE_KEYS.TOTAL_CLICKS, newTotalClicks.toString());
            return newTotalClicks;
        });

        // Clear any existing timeout to reset the timer on rapid clicks
        if (screamTimeoutRef.current) {
            clearTimeout(screamTimeoutRef.current);
        }

        // Set a new timeout to return the boy to a normal state
        screamTimeoutRef.current = window.setTimeout(() => {
            setIsScreaming(false);
        }, 75); // A short duration for the scream effect

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
            recentPlayers={recentPlayers}
        />
    );
};

export default App;