'use client';

import {JSX, useState} from 'react';
import { useRouter } from 'next/navigation'
import { Button } from '@app/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@app/components/ui/card';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Mail, KeyRound } from 'lucide-react';
import {IUser} from "@interfaces/user";
import AuthService from "@services/auth-service";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {TErrorCatch} from "@interfaces/error-exeption";
import Link from "next/link";
import {RoutesList} from "@util/routes";

export default function RegisterPage(): JSX.Element {
    // State to hold the avatar file for preview
    const router: AppRouterInstance = useRouter();
    const [errorMsg, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would handle the form data, e.g., send it to your API
        const formData = new FormData(event.currentTarget);
        const email: string = formData.get('email')!.toString();
        const password: string = formData.get('password')!.toString();

        setError("");

        try {
            const auth: IUser = await new AuthService().login({username: email, password});
            console.log("auth", auth);
            if (auth) {
                localStorage.setItem('auth', JSON.stringify(auth));
                router.push("/");
            }
        } catch (e: TErrorCatch) {
            if (e instanceof Error) {
                setError(e.message);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
                    <CardDescription>Enter your details below to start your journey with us.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Label className="text-red-500">{errorMsg}</Label>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative flex items-center">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input name="email" type="email" placeholder="you@example.com" className="pl-10" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative flex items-center">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input name="password" type="password" placeholder="••••••••" className="pl-10" required />
                            </div>
                        </div>
                        <Button type="submit" className="w-full !mt-8">login</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                    <p>Don't have an account? <Link href={RoutesList.REGISTER} className="font-semibold text-primary hover:underline">Sign Up</Link></p>
                </CardFooter>
            </Card>
        </div>
    );
}
