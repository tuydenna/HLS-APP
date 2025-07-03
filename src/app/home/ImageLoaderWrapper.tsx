'use client';

import { JSX, useState, cloneElement } from "react";
import {onDidMount} from "@lib/react-adapter";

export default function ImageLoaderWrapper({ fallBack, children }: { fallBack: JSX.Element, children: JSX.Element }) {
    const [loaded, setLoaded] = useState(false);

    onDidMount(() => {
        const images: HTMLImageElement[] = Array.from(document.querySelectorAll('img'));
        let count: number = 0;

        if (images.length === 0) setLoaded(true);

        images.forEach((img) => {
            if (img.complete) {
                checkDone();
            } else {
                img.addEventListener('load', checkDone);
                img.addEventListener('error', checkDone);
            }
        });

        function checkDone() {
            count++;
            if (count === images.length) setLoaded(true);
        }
    });

    function cloneChildren(children: JSX.Element) {
       return cloneElement(children, {...children.props, style: {opacity: loaded ? 1 : 0}});
    }

    return (
        <>
            {
                !loaded && fallBack
            }
            {
                cloneChildren(children)
            }
        </>
    );
}
