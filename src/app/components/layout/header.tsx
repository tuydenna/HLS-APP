"use client"

import React, {useState} from "react";
import {onDidMount} from "@app/lib/react-adapter";
import { IUser } from "@interfaces/user";
import {getImageURL} from "@util/helper";
import {DropdownProfile} from "@app/home/components/dropdown-profile";
import {getAuth} from "@lib/utils";

export default function Header() {
    const [auth, setAuth] = useState<IUser | null>(null);

    onDidMount(()=> {
        const user: IUser = getAuth();
        user.avatar = getImageURL(user.avatar);
        setAuth(user);
    })
    return (
        <div className="header">
            <div className="header__left">
                <i id="menu" className="material-icons">menu</i>
                <img
                    src="https://1000logos.net/wp-content/uploads/2017/05/Youtube-logo.jpg"
                    alt=""
                />
            </div>

            <div className="header__search">
                <form action="">
                    <input type="text" placeholder="Search"/>
                    <button><i className="material-icons">search</i></button>
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
    )
}