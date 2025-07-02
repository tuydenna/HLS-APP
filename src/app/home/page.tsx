'use server'

import LeftSidebar from "@app/home/components/left-sidebar";
import Content from "@app/home/components/content";
import Header from "@components/layout/header";

export default async function HomePage () {

    return (
        <>
            <Header/>
            <div className="flex">
                <LeftSidebar/>
                <Content/>
            </div>
        </>
    )
}
