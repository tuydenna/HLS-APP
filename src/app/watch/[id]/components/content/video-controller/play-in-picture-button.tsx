import {onDidMount} from "@lib/react-adapter";
import {isPIPMode} from "@watch/helper/media-source-helper";

export default function PlayInPictureButton({videoEl}: {videoEl: HTMLVideoElement | null}) {

    onDidMount(function () {
        if (isPIPMode()) {
            console.log("PIP");
            playInPictureMode()
        }
    })
    
    const playInPictureMode = function () {
        if (videoEl) {
            videoEl.requestPictureInPicture()
        }
    }

    return (
        <button className="mini-player-btn" onClick={playInPictureMode}>
            <svg width="25" height="25" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"/>
            </svg>
        </button>
    )
}