import {RefObject, useRef, useState} from "react";
import {onDidUpdate} from "@lib/react-adapter";

export default function SoundButton({videoEl}: {videoEl: HTMLVideoElement | null}) {

    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1)
    const volumeSliderRef: RefObject<null | HTMLInputElement>  = useRef(null);

    onDidUpdate(function () {
        if (!videoEl) return
        const {isMuted, volume} = getSoundConfig();
        setIsMuted(isMuted);
        configVolume(volume);
    }, [videoEl]);

    const toggleMuted = function () {
        videoEl!.muted = !isMuted;
        if (isMuted) {
            configVolume(1)
        } else {
            configVolume(0)
        }
        setIsMuted(!isMuted)
    }

    const changeVolume = function ({target}: { target: HTMLInputElement}) {
        configVolume(+target.value);
    }

    function configVolume(volume: number) {
        videoEl!.volume = volume;
        volumeSliderRef.current?.style.setProperty("--value", volume.toString());
        storeSoundConfig({isMuted, volume: volume});
        setVolume(volume);
    }

    function storeSoundConfig(config: {volume: number, isMuted: boolean}) {
        localStorage.setItem("sound_config", JSON.stringify(config));
    }

    function getSoundConfig(): {volume: number, isMuted: boolean} {
        const config: string | null = localStorage.getItem("sound_config");
        if (config) return JSON.parse(config);
        return {volume: 1, isMuted: false};
    }

    return (
        <div className="volume-container">
            <button className="mute-btn" onClick={toggleMuted} data-volume-level={isMuted ? "low" : "high"}>
                <svg width="30" height="30" className="volume-high-icon" viewBox="0 0 24 24" style={{display: isMuted ? "none" : "block"}}>
                    <path fill="currentColor"
                          d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                </svg>
                <svg width="30" height="30" className="volume-low-icon" viewBox="0 0 24 24" style={{display: "none"}}>
                    <path fill="currentColor"
                          d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"/>
                </svg>
                <svg width="30" height="30" className="volume-muted-icon" viewBox="0 0 24 24" style={{display: isMuted ? "block" : "none"}}>
                    <path fill="currentColor"
                          d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
                </svg>
            </button>
            <input  ref={volumeSliderRef} className="volume-slider w-0" type="range" min="0" max="1" step="any" value={volume} onChange={changeVolume}/>
        </div>
    )
}