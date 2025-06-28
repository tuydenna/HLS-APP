import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@app/components/ui/dropdown-menu"
import React, { JSX } from "react"
import {IUser} from "@interfaces/user";
import { useRouter } from 'next/navigation'

export function DropdownProfile({auth}: {auth:  IUser | null}): JSX.Element {
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                    <img src={auth?.avatar} alt="profile" className="w-8 h-8 rounded-full" />
                    <span className="text-sm font-medium">{auth?.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-3" style={{padding: 10}} align="start">
                <DropdownMenuLabel style={{padding: "6px 8px"}}>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem style={{padding: "6px 8px"}} onClick={(e) =>
                        e.preventDefault() }>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem style={{padding: "6px 8px"}} onClick={() => {router.push("/upload-studio")}}>
                        Studio
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem style={{padding: "6px 8px"}}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{padding: "6px 8px"}}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
