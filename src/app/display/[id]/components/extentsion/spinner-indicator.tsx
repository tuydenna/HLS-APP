import Image from "next/image";
import {useEffect, useState} from "react";

export default function SpinnerIndicator({videoEl}: {videoEl: HTMLVideoElement | null}) {
    const [isSpinning, setIsSpinning] = useState<boolean>(false)

    useEffect(() => {
        if (!videoEl) return

        function isBufferingData(event: Event) {
            setIsSpinning(true)
        }

        function isCanPlay() {
            setIsSpinning(false)
        }

        videoEl.addEventListener("waiting", isBufferingData)
        videoEl.addEventListener("canplay", isCanPlay)

        return () => {
            videoEl.removeEventListener("waiting", isBufferingData)
            videoEl.removeEventListener("canplay", isCanPlay)
        }
    });

    return (
        <div className="flex justify-center h-full w-full absolute" style={{opacity: isSpinning ? 1 : 0}}>
            <Image src="/spinner.svg" width={100} height={100} alt="Buffering"/>
        </div>
    )
}