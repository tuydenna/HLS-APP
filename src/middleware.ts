import {NextRequest, NextResponse} from 'next/server'
import {RoutesList} from "@util/routes";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get('auth_token')?.value

    if (!currentUser && !request.nextUrl.pathname.startsWith(RoutesList.LOGIN)) {
        return Response.redirect(new URL(RoutesList.LOGIN, request.url))
    }
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    // matcher:  [RoutesList.HOME, RoutesList.UPLOAD_STUDIO, RoutesList.PROFILE, "/display/:id*"],
    matcher: ["/", "/watch/:id*", "/studio"]
}