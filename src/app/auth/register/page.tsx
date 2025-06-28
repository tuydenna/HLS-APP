
'use client';

import {JSX, useState } from 'react';
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
import {uploadFile} from "@util/file";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function RegisterPage(): JSX.Element {
    // State to hold the avatar file for preview
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isErrorConfirmPass, setIsErrorConfirmPass] = useState(false);
    const router: AppRouterInstance = useRouter();

    // Handle file selection and create a preview URL
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Here you would handle the form data, e.g., send it to your API
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');
        // You can access the avatar file from the state: `avatarFile

        setIsErrorConfirmPass(false);
        if (password !== confirmPassword) {
            setIsErrorConfirmPass(true);
        }

        const resAvatar: IFileResWrap<IFileUpload> = await uploadFile(avatarFile!, "/avatar");
        const auth: IUser = await new AuthService().register({name, email, password, avatar: resAvatar.data.dir_path});
        if (auth) {
            localStorage.setItem('auth', JSON.stringify(auth));
            router.push("/");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 font-sans">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Create an Account</CardTitle>
                    <CardDescription>Enter your details below to start your journey with us.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 flex flex-col items-center">
                            <Label htmlFor="avatar" className="cursor-pointer">
                                <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center relative overflow-hidden group">
                                    {avatarPreview ? (
                                        // Replaced next/image with standard img tag for compatibility
                                        <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
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
                        <Button type="submit" className="w-full !mt-8">Create Account</Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-gray-500">
                    <p>Already have an account? <a href="#" className="font-semibold text-primary hover:underline">Sign In</a></p>
                </CardFooter>
            </Card>
        </div>
    );
}
