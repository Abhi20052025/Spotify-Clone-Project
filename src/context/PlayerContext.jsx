import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets/assets";

// Create Context it be show the error .sovlve using Blackbox AI,ChatGpt etc.
export const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    // Track current index instead of relying on object reference
    const [currentIndex, setCurrentIndex] = useState(0);
    const [track, setTrack] = useState(songsData[0]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    });

    const Play = () => {
        audioRef.current.play();
        setPlayStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    };

    const playWithId = (id) => {
        setCurrentIndex(id);
        setTrack(songsData[id]);
        audioRef.current.play();
        setPlayStatus(true);
    };

    const previous = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setTrack(songsData[newIndex]);
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const next = () => {
        if (currentIndex < songsData.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setTrack(songsData[newIndex]);
            audioRef.current.play();
            setPlayStatus(true);
        }
    };

    const seekSong = async (e) => {
        audioRef.current.currentTime=((e.nativeEvent.offsetX/ seekBg.current.offsetWidth)*audioRef.current.duration)
    }


    useEffect(() => {
        const updateTime = () => {
            if (!audioRef.current) return;

            seekBar.current.style.width =
                (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";

            setTime({
                currentTime: {
                    second: Math.floor(audioRef.current.currentTime % 60),
                    minute: Math.floor(audioRef.current.currentTime / 60)
                },
                totalTime: {
                    second: Math.floor(audioRef.current.duration % 60),
                    minute: Math.floor(audioRef.current.duration / 60)
                }
            });
        };

        // Attach ontimeupdate directly without setTimeout
        if (audioRef.current) {
            audioRef.current.ontimeupdate = updateTime;
        }

    }, [track]);

    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        Play,
        pause,
        playWithId,
        previous,
        next,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
