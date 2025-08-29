"use client"

import React, {FormEvent, RefObject, useRef, useState} from "react";
import {onDidMount, redirectTo} from "@app/lib/react-adapter";
import { IUser } from "@interfaces/user";
import {DropdownProfile} from "@app/components/layout/dropdown-profile";
import {getAuth} from "@lib/utils";
import {Input} from "@components/ui/input";
import {Card} from "@components/ui/card";
import SearchService from "@services/search-service";
import { useRouter, useParams } from 'next/navigation';
import {RoutesList} from "@util/routes";
import Link from "next/link";

export default function Header() {
    const [auth, setAuth] = useState<IUser | null>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchList, setSearchList] = useState<string[]>([]);
    const searchInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
    const params: {searchKey: string} | null = useParams<{searchKey: string}>();
    let timeout: NodeJS.Timeout;
    const router = useRouter();

    onDidMount(()=> {
        setAuth(getAuth());
        searchInputRef.current!.value = params?.searchKey ? decodeURIComponent(params.searchKey) : ""
    })

    function onTypeSearching() {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
            const searchKey: string | undefined = searchInputRef.current?.value.trim();
            if (searchKey) {
                const posts: string[] = await new SearchService().searchAutocompletes(searchKey);
                if (posts.length) {
                    setIsSearching(true);
                    setSearchList(posts);
                }
            } else {
                setIsSearching(false);
            }
        }, 500)
    }

    function onSearch(searchKey: string) {
        if (searchKey.trim()) {
            redirectTo(router, RoutesList.SEARCH + encodeURIComponent(searchKey.trim()));
            return;
        }
        redirectTo(router, RoutesList.HOME);
    }

    function onSummit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        onSearch(searchInputRef.current!.value);
    }

    function onLeaveSearch() {
        setIsFocused(false);
        setIsSearching(false);
    }

    return (
        <div className="sticky top-0 right-0 left-0 z-10">
            <Card className="py-3 px-5 rounded-sm">
                <div className="flex justify-between items-center">
                    <div className="header__left">
                        {/*<i id="menu" className="material-icons">menu</i>*/}
                        <Link href="/">
                            <img
                                src="/favicon.ico"
                                alt=""
                                width={30}
                                height={30}
                            />
                        </Link>

                    </div>

                    <div className="header__search relative">
                        <form action="" className="flex" onSubmit={onSummit}>
                            <Input id="search-input" onFocus={() => setIsFocused(true)} onBlur={onLeaveSearch}  onKeyUp={onTypeSearching} type="text" ref={searchInputRef} placeholder="Search ..." className="text-base md:text-sm w-full md:w-[calc(30vw)] border-0 border-y-1 border-l-1 rounded-none rounded-l-sm !ring-0" />
                            <button type="submit"  className={`border-y-1 border-r-1 rounded-r-sm  ${isFocused ? "border-[var(--ring)]": ""}`}><i className="material-icons">search</i></button>
                        </form>
                        {
                            isSearching &&
                            <div>
                                <ul className="absolute text-sm z-10 w-full bg-white p-2 border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                    {
                                        searchList.map((title, index) => (
                                            <li key={index} onMouseDown={() => onSearch(title)} className="px-4 py-2 hover:bg-gray-100 hover:rounded-sm cursor-pointer">
                                                {title}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
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