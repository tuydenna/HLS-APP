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
import AuthService from "@services/auth-service";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {RoutesList} from "@util/routes";
import {redirectTo} from "@lib/react-adapter";
import {AvatarUI} from "@components/ui/avatar";

export function DropdownProfile({auth}: {auth:  IUser | null}): JSX.Element {
    const router: AppRouterInstance = useRouter();

    async function onLogout() {
        try {
            await new AuthService().logout();
            redirectTo(router, RoutesList.LOGIN);
        } catch (e) {

        }
    }

    function toUploadStudio() {
        return redirectTo(router, RoutesList.UPLOAD_STUDIO);
    }

     function toProfile() {
        return redirectTo(router, RoutesList.PROFILE);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                    <AvatarUI src={auth?.avatar} fallbackName={auth?.name} widthClass="w-10" heightClass="h-10"/>
                    <span className="text-sm font-medium">{auth?.name}</span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-3" style={{padding: 10}} align="start">
                <DropdownMenuLabel style={{padding: "6px 8px"}}>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem style={{padding: "6px 8px"}} onClick={toProfile}>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>

                    <DropdownMenuItem style={{padding: "6px 8px"}} onClick={toUploadStudio}>
                        Studio
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem style={{padding: "6px 8px"}}>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{padding: "6px 8px"}} onClick={onLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
