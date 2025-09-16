import {RefObject, useState} from "react";
import {ISettingOption, IVideoConfigRef} from "@interfaces/video-config";
import {PlaybackSetting} from "@constant/video-config";
import {createPortal} from "react-dom";
import {IVideo} from "@interfaces/video";
import {onDidMount} from "@lib/react-adapter";

export default function SettingButton({data, videoEl, videoConfigRef, handleChangeVideoScale}: {
    data: IVideo,
    videoEl: HTMLVideoElement | null,
    videoConfigRef: RefObject<IVideoConfigRef>,
    handleChangeVideoScale: Function}
) {

    const [scale, setScale] = useState("");
    const [playbackRate, setPlaybackRate] = useState("normal");
    const [setting, setSetting] = useState<string>("")
    const [qualities, setQualities] = useState<ISettingOption[]>([])

    onDidMount(function () {
        const scaleOptions: ISettingOption[] = data.quality.map(q => {
            return {name: q.name, value: q.name}
        })
        setQualities(scaleOptions)
        setScale(scaleOptions[0].name || "360p")
    })

    const toggleIsOpen = function () {
        setSetting(setting === "main" ? "" : "main");
    }

    const onConfigScale = function (scale: string) {
        videoConfigRef.current.scale = scale;
        handleChangeVideoScale()
        setScale(scale);
        setSetting("");
    }

    const onConfigPlayback = function (rate: number) {
        if (videoEl) {
            videoEl.playbackRate = rate;
            const playbackOption = PlaybackSetting.find(setting => setting.value === rate);
            if (playbackOption) {
                setPlaybackRate(playbackOption.name);
            }
            setSetting("");
        }
    }

    const onConfigSetting = function (setting: string) {
        setSetting(setting);
    }

    function getOptionData(): [string, Function, Readonly<ISettingOption[]>, string] {
        switch (setting) {
            case "scale":
               return ["Quality", onConfigScale, qualities, scale]
            case "playback":
                return ["Playback Speed", onConfigPlayback, PlaybackSetting, playbackRate]
            default:
                return ["", ()=>{}, qualities, ""]
        }
    }

    function OptionSettingUI() {

        const [label, callback, settingOptions, selected] = getOptionData()

        return (
            <div>
                <div onClick={()=> onConfigSetting("main")} className="cursor-pointer flex items-center justify-between pb-2 mb-2">
                    <div className="flex items-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        <span className="font-semibold">{label}</span>
                    </div>
                </div>
                <div>
                    {
                        settingOptions.map((setting: ISettingOption, index: number) => {
                            return (
                                <div key={index} onClick={() => callback(setting.value)} className="m-0 flex cursor-pointer hover:bg-[#4B566652] active:bg-[#556377] items-center justify-between py-3 border-t border-zinc-700">
                                    <div className={`flex items-center}`}  >
                                        <svg className={`${selected === setting.name ? "visible" : "invisible"} mr-2`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        <span className="capitalize">{setting.name}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    function MainSettingUI() {
        return (
            <div>
                <div className="flex items-center justify-between pb-2 mb-2 ">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.929-1.415a9 9 0 000-12.875M12 21h.01M12 3a9.004 9.004 0 011.666 17.844m-2.332-17.844A9.004 9.004 0 0012 21M7 9a1 1 0 11-2 0 1 1 0 012 0zm0 6a1 1 0 11-2 0 1 1 0 012 0zm10-3a1 1 0 11-2 0 1 1 0 012 0zm0 6a1 1 0 11-2 0 1 1 0 012 0z"/>
                        </svg>
                        <span className="font-semibold">Stable Volume</span>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                        <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-zinc-600 cursor-pointer"></label>
                    </div>
                </div>
                <div>
                    <div  className="m-0 flex cursor-pointer hover:bg-[#4B566652] active:bg-[#556377] items-center justify-between py-3 border-t border-zinc-700">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <span >Subtitles/CC (1)</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-zinc-400 mr-2 capitalize">off</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                    <div className="m-0 flex cursor-pointer hover:bg-[#4B566652] active:bg-[#556377] items-center justify-between py-3 border-t  border-zinc-700">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span >Sleep timer</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-zinc-400 mr-2 capitalize">off</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                    <div onClick={() => onConfigSetting("playback")} className="m-0  flex cursor-pointer hover:bg-[#4B566652] active:bg-[#556377] items-center justify-between py-3 border-t border-zinc-700">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.173a.5.5 0 00-.256.444V14a.5.5 0 00.256.444l.873.5a.5.5 0 00.627-.14l2-2a.5.5 0 00-.01-.707l-2-2a.5.5 0 00-.627-.14l-.873.5zm-5.752 0a.5.5 0 01.256.444V14a.5.5 0 01-.256.444l-.873.5a.5.5 0 01-.627-.14l-2-2a.5.5 0 01-.01-.707l2-2a.5.5 0 01.627-.14l.873.5z"/>
                            </svg>
                            <span>Playback speed</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-zinc-400 mr-2 capitalize">{playbackRate}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                    <div onClick={() => onConfigSetting("scale")} className="m-0 flex cursor-pointer hover:bg-[#4B566652] active:bg-[#556377] items-center justify-between py-3 border-t border-zinc-700">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20.25a.75.75 0 01-.75.75H4.75a.75.75 0 01-.75-.75V3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v16.5zm-6.5-6.5a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75v-2.5a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v2.5zm1.5-6.5a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75V4.75a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v2.5zm6.5-1.5a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75v-2.5a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v2.5zm-6.5-1.5a.75.75 0 01-.75.75h-.25a.75.75 0 01-.75-.75V4.75a.75.75 0 01.75-.75h.25a.75.75 0 01.75.75v2.5z"/>
                            </svg>
                            <span>Quality</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-zinc-400 mr-2">{scale}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {
                setting &&
                    createPortal(
                        <div className={`p-4 z-10 w-80 absolute right-[1%] md:right-5 top-[101%] md:top-auto md:bottom-[10%] py-3 bg-[#1c1b1bfa] md:bg-[#00000096] text-white text-base md:text-sm rounded-lg font-sans`}>
                            {
                                setting == "main" && MainSettingUI()
                            }
                            {
                                (setting == "scale" || setting == "playback") && OptionSettingUI()
                            }
                        </div>,
                        document.getElementById("video-container")!
                    )
            }
            <div onClick={toggleIsOpen} className=" cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none">
                    <button>setting</button>
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.65 3L9.93163 3.53449L9.32754 5.54812L7.47651 4.55141L6.5906 4.68143L4.68141 6.59062L4.55139 7.47652L5.5481 9.32755L3.53449 9.93163L3 10.65V13.35L3.53449 14.0684L5.54811 14.6725L4.55142 16.5235L4.68144 17.4094L6.59063 19.3186L7.47653 19.4486L9.32754 18.4519L9.93163 20.4655L10.65 21H13.35L14.0684 20.4655L14.6725 18.4519L16.5235 19.4486L17.4094 19.3185L19.3186 17.4094L19.4486 16.5235L18.4519 14.6724L20.4655 14.0684L21 13.35V10.65L20.4655 9.93163L18.4519 9.32754L19.4486 7.47654L19.3186 6.59063L17.4094 4.68144L16.5235 4.55142L14.6725 5.54812L14.0684 3.53449L13.35 3H10.65ZM10.4692 6.96284L11.208 4.5H12.792L13.5308 6.96284L13.8753 7.0946C13.9654 7.12908 14.0543 7.16597 14.142 7.2052L14.4789 7.35598L16.7433 6.13668L17.8633 7.25671L16.644 9.52111L16.7948 9.85803C16.834 9.9457 16.8709 10.0346 16.9054 10.1247L17.0372 10.4692L19.5 11.208V12.792L17.0372 13.5308L16.9054 13.8753C16.8709 13.9654 16.834 14.0543 16.7948 14.1419L16.644 14.4789L17.8633 16.7433L16.7433 17.8633L14.4789 16.644L14.142 16.7948C14.0543 16.834 13.9654 16.8709 13.8753 16.9054L13.5308 17.0372L12.792 19.5H11.208L10.4692 17.0372L10.1247 16.9054C10.0346 16.8709 9.94569 16.834 9.85803 16.7948L9.52111 16.644L7.25671 17.8633L6.13668 16.7433L7.35597 14.4789L7.2052 14.142C7.16597 14.0543 7.12908 13.9654 7.0946 13.8753L6.96284 13.5308L4.5 12.792L4.5 11.208L6.96284 10.4692L7.0946 10.1247C7.12907 10.0346 7.16596 9.94571 7.20519 9.85805L7.35596 9.52113L6.13666 7.2567L7.25668 6.13667L9.5211 7.35598L9.85803 7.2052C9.9457 7.16597 10.0346 7.12908 10.1247 7.0946L10.4692 6.96284ZM14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12ZM15.75 12C15.75 14.0711 14.0711 15.75 12 15.75C9.92893 15.75 8.25 14.0711 8.25 12C8.25 9.92893 9.92893 8.25 12 8.25C14.0711 8.25 15.75 9.92893 15.75 12Z" fill="white"/>
                </svg>
            </div>
        </>
    );
}