import React, { JSX } from "react";
import Image from "next/image";

export function PendingIcon(): JSX.Element {
    return (
        <Image src="/pending.gif" alt="" width={16} height={16} />
    )
}

export function SuccessIcon(): JSX.Element {
    return (
        <svg
            width={16}
            height={16}
            style={{ marginTop: 2 }}
            className="octicon octicon-check-circle-fill color-fg-success"
            aria-label="completed successfully: "
            viewBox="0 0 16 16"
            version="1.1"
            role="img"
        >
            <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z" />
        </svg>
    )
}

export function ErrorIcon(): JSX.Element {
    return (
        <svg
            width={16}
            height={16}
            style={{marginTop: 2}}
            className="octicon octicon-x-circle-fill color-fg-danger"
            aria-label="failed: "
            viewBox="0 0 16 16"
            version="1.1"
            role="img"
        >
            <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"/>
        </svg>
    )
}