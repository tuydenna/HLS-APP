import {NextRequest, NextResponse} from 'next/server'
import {RoutesList} from "@util/routes";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const currentUser: string |undefined = request.cookies.get('auth_token')?.value

    if (!currentUser) {
        if (request.nextUrl.pathname.startsWith(RoutesList.REGISTER)) {
            return NextResponse.next();
        }
        if (!request.nextUrl.pathname.startsWith(RoutesList.LOGIN)) {
            return Response.redirect(new URL(RoutesList.LOGIN, request.url))
        }
    }

    if (currentUser && (request.nextUrl.pathname.startsWith(RoutesList.LOGIN) || request.nextUrl.pathname.startsWith(RoutesList.REGISTER))) {
        return Response.redirect(new URL(RoutesList.HOME, request.url))
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    // matcher:  [RoutesList.HOME, RoutesList.UPLOAD_STUDIO, RoutesList.PROFILE, "/display/:id*"],
    matcher: ["/", "/watch/:id*", "/studio", "/search/:searchKey*", "/auth/login", "/auth/profile", "/auth/register"],
}