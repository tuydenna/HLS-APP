
'use client';

import {ChangeEvent, FormEvent, JSX, useState} from 'react';
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
import { UserCircle, Mail, KeyRound, ImageUp } from 'lucide-react';
import {IUser} from "@interfaces/user";
import AuthService from "@services/auth-service";
import {IFileResWrap, IFileUpload} from "@interfaces/video";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {RoutesList} from "@util/routes";
import Link from "next/link";
import Image from "next/image";
import {redirectTo} from "@lib/react-adapter";
import FileService from "@services/file-service";

export default function RegisterPage(): JSX.Element {
    // State to hold the avatar file for preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isErrorConfirmPass, setIsErrorConfirmPass] = useState(false);
    const router: AppRouterInstance = useRouter();
    const fileService: FileService = new FileService();
    const authService: AuthService = new AuthService();

    // Handle file selection and create a preview URL
    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setAvatarFile(null);
            setAvatarPreview(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would handle the form data, e.g., send it to your API
        const formData = new FormData(event.currentTarget);
        const name: string = formData.get('name')!.toString();
        const email: string = formData.get('email')!.toString();
        const password: string = formData.get('password')!.toString();
        const confirmPassword = formData.get('confirm-password');
        // You can access the avatar file from the state: `avatarFile

        setIsErrorConfirmPass(false);
        if (password !== confirmPassword) {
            return setIsErrorConfirmPass(true);
        }

        if (!avatarFile) return alert("please upload a avatar");
        try {
            const resAvatar: IFileResWrap<IFileUpload> = await fileService.uploadAvatar(avatarFile!);
            const auth: IUser = await authService.register({name, email, password, avatar: resAvatar.data.filePath});
            alert("handleSubmit");

            if (auth) {
                localStorage.setItem('auth', JSON.stringify(auth));
                return redirectTo(router, '/');
            }
        } catch (e) {
            alert(e)
            console.log(e);
        }
    };

    return (
        <div className="flex items-center justify-center h-dvh bg-gray-50 dark:bg-gray-900 p-2 font-sans">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
                        <CardDescription>Enter your details below to start your journey with us.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="space-y-2 flex flex-col items-center">
                                <Label htmlFor="avatar" className="cursor-pointer">
                                    <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden group">
                                        {avatarPreview ? (
                                            // Replaced next/image with standard img tag for compatibility
                                            <Image src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" width={100} height={100}/>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <ImageUp className="mx-auto h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
                                                <span className="mt-1 text-xs">Upload Avatar</span>
                                            </div>
                                        )}
                                    </div>
                                </Label>
                                <Input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="name">Profile Name</Label>
                                <div className="relative flex items-center">
                                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input name="name" type="text" placeholder="John Doe" className="pl-10" required />
                                </div>
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <div className="relative flex items-center">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input name="confirm-password" type="password" placeholder="••••••••" className="pl-10" required />
                                </div>
                                {
                                    isErrorConfirmPass && <Label className="text-red-600" >Confirm Password is not match</Label>
                                }
                            </div>
                            <Button type="submit" className="w-full h-12 md:h-10">Create Account</Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center text-sm text-gray-500">
                        <p>Already have an account? <Link href={RoutesList.LOGIN} className="font-semibold text-primary hover:underline">Sign In</Link></p>
                    </CardFooter>
                </Card>
        </div>
    );
}
