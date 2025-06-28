'use server'

import "./styles.css"
import LeftSidebar from "@app/home/components/left-sidebar";
import Header from "@app/home/components/header";
import Content from "@app/home/components/content";

export default async function HomePage () {

    return (
        <>
            <Header/>
            <div className="mainBody">
                <LeftSidebar/>
                <Content/>
            </div>
        </>
    )
}
