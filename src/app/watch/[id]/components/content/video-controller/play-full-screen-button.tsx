import {isInFullScreenMode} from "@util/helper";

export default function PlayFullScreenButton({videoEl}: { videoEl: HTMLVideoElement | null}) {

    const exitFullScreen = function () {
        document.exitFullscreen();
    }

    const enterFullScreen = function () {
        const videContainerEl: Element | null = document.querySelector(".video-container");
        if (videContainerEl && ("requestFullscreen" in videContainerEl)) { // For any Browsers
            videContainerEl.requestFullscreen()
        } else { // For Safari
            // @ts-ignore
            videoEl!.webkitEnterFullscreen()
        }
    }

     function toggleInFullScreenMode () {
         let retryCount: number = 0;
         const retry = function () {
            try {
                if (isInFullScreenMode()) {
                   return exitFullScreen();
                } else {
                    return enterFullScreen();
                }
            } catch (error) {
                console.warn("[Request FUll-Screen Failed]", error);
                alert(error)
                if (retryCount < 2) {
                    retryCount++;
                    return retry();
                }
            }
         }
         return retry()
    }

    return (
        <button className="full-screen-btn" onClick={toggleInFullScreenMode}>
            <svg width="30" height="30" className="open" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
            <svg width="30" height="30" className="close" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
        </button>
    )
}