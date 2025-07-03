import {RefObject} from "react";

export default function PlayInTheatreButton({videoEl}: {videoEl: HTMLVideoElement | null}) {

    const playInPictureMode = function () {
        if (videoEl) {
            videoEl.requestPictureInPicture()
        }
    }

    return (
        <button className="theater-btn">
            <svg className="tall" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/>
            </svg>
            <svg className="wide" viewBox="0 0 24 24">
                <path fill="currentColor"
                      d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"/>
            </svg>
        </button>
    )
}