'use client';

import React, {isValidElement, JSX, useState} from 'react';
import {onDidMount} from "@lib/react-adapter";

export default function ImageLoaderWrapper({ fallBack, children }: { fallBack: JSX.Element, children: React.ReactElement }) {
    const [loaded, setLoaded] = useState(false);

    onDidMount(() => {
        const images = Array.from(document.querySelectorAll('img'));
        let count = 0;

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
            console.log('done', count, images.length);
            if (count === images.length) setLoaded(true);
        }
    });

    return (
        <>
            {
                !loaded && fallBack
            }
            {
                React.Children.map(children, (child) => {
                    if (isValidElement(child)) {
                        return React.cloneElement(child, {
                            style: {
                                ...(child.props.style || {}),
                                opacity: loaded ? 1  : 0,
                            },
                        });
                    }
                    return child; // for non-element children
                })
            }
        </>
    );
}
