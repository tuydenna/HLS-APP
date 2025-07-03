import { JSX } from "react"
import "./loading.css"

export default function Loading(): JSX.Element {
    return (
        <div className="fixed flex flex-col justify-center items-center inset-1">
            <span className="root-loading"></span>
            <div className=" text-sm">
                Loading ...
            </div>
        </div>
    )
}