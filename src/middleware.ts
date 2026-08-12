import {NextRequest, NextResponse} from 'next/server'
import {RoutesList} from "@util/routes";

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value;
    const {pathname} = request.nextUrl;

    console.log("Middleware check. Auth token:", authToken ? "present" : "missing");

    // If user is not logged in
    if (!authToken) {
        // Allow access to register page
        if (pathname.startsWith(RoutesList.REGISTER)) {
            return NextResponse.next();
        }
        // Redirect any other protected page to the login page
        if (!pathname.startsWith(RoutesList.LOGIN)) {
            return NextResponse.redirect(new URL(RoutesList.LOGIN, request.url));
        }
    }

    // If user is logged in, prevent access to login/register pages
    if (authToken && (pathname.startsWith(RoutesList.LOGIN) || pathname.startsWith(RoutesList.REGISTER))) {
        return NextResponse.redirect(new URL(RoutesList.HOME, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/watch/:id*", "/studio", "/search/:searchKey*", "/auth/login", "/auth/profile", "/auth/register"],
}
