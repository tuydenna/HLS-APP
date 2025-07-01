"use client"

import React, {useState} from "react";
import {onDidMount} from "@app/lib/react-adapter";
import { IUser } from "@interfaces/user";
import {getImageURL} from "@util/helper";
import {DropdownProfile} from "@app/home/components/dropdown-profile";
import {getAuth} from "@lib/utils";
import {Input} from "@components/ui/input";
import {Card} from "@components/ui/card";

export default function Header2() {
    const [auth, setAuth] = useState<IUser | null>(null);

    onDidMount(()=> {
        const user: IUser = getAuth();
        user.avatar = getImageURL(user.avatar);
        setAuth(user);
    })

    return (
        <div className="sticky top-0 right-0 left-0 z-10">
            <Card className="py-3 px-5 rounded-sm">
                <div className="flex justify-between">
                    <div className="header__left">
                        <i id="menu" className="material-icons">menu</i>
                        <img
                            src="https://1000logos.net/wp-content/uploads/2017/05/Youtube-logo.jpg"
                            alt=""
                        />
                    </div>

                    <div className="header__search">
                        <form action="" className="flex">
                            <Input type="text" placeholder="Search ..." className="w-96 border-0 border-y-1 border-l-1 rounded-none rounded-l-sm focus:!ring-0 " />
                            <button type="submit" className="border-y-1 border-r-1 rounded-r-sm"><i className="material-icons">search</i></button>
                        </form>
                    </div>

                    <div className="header__icons flex space-between">
                        {
                            /*<Link href="/upload-studio"><i className="material-icons display-this">upload</i></Link>
                            <i className="material-icons">videocam</i>
                            <i className="material-icons">apps</i>
                            <i className="material-icons">notifications</i>*/
                        }
                        <DropdownProfile auth={auth} />
                    </div>
                </div>
            </Card>
        </div>
    )
}