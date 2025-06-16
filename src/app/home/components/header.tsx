"use client"

import Link from "next/link";

export default function Header() {

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

            <div className="header__icons">
                <Link href="/upload-studio"><i className="material-icons display-this">upload</i></Link>
                <i className="material-icons">videocam</i>
                <i className="material-icons">apps</i>
                <i className="material-icons">notifications</i>
                <i className="material-icons display-this">account_circle</i>
            </div>
        </div>
    )
}