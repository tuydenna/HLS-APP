"use client"
import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {onDidMount} from "@lib/react-adapter";
import {getAuth, storeAuth} from "@lib/utils";
import {IUser} from "@interfaces/user";
import {geImageProxyAPI, getImageURL} from "@util/helper";
import {Label} from "@components/ui/label";
import Image from "next/image";
import {ImageUp} from "lucide-react";
import {useRouter} from "next/navigation";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import AuthService from "@services/auth-service";
import UserService from "@services/user-service";
import {encodeToBase64} from "next/dist/build/webpack/loaders/utils";

// The main App component containing the entire profile settings page UI.
function ProfilePage() {
    // User data state, now editable.
    const [user, setUser] = useState<IUser>();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const router: AppRouterInstance = useRouter();

    onDidMount(function () {
        const user: IUser = getAuth()
        setAvatarPreview(geImageProxyAPI(getImageURL(user.avatar)))
        setUser(user);
    })

    function resetForm(target: EventTarget & HTMLFormElement) {
        setAvatarFile(null);
        target.reset();
    }

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

    const onsubmitUpdateProfile = async function (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target: EventTarget & HTMLFormElement = e.currentTarget;
        const formData = new FormData(target);

        const password: string = formData.get("newPassword")! as string;
        const confirmPassword: string = formData.get("confirmPassword")! as string;

        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        if (!(avatarFile || password)) {
            return alert("Nothing to update!");
        }

        try {
            const data: IUser = await new UserService().update(user!.id, {password, file: avatarPreview});
            console.log(data);
            storeAuth(data);
            resetForm(target);

        } catch (error) {
            alert(error);
            console.log(e);
        }
    }

    return (
        <div className="h-dvh bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-10 ">
               <Button onClick={()=> router.back()} className="absolute top-3 right-3 cursor-pointer bg-red-500">X</Button>
                <div className="flex flex-col items-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">Profile Settings</h1>
                    <p className="text-lg text-gray-500 mt-2">Manage your personal information and password.</p>
                </div>
                <section className="bg-gray-50 rounded-2xl p-6 sm:p-8 shadow-inner border border-gray-100 mb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-10">
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

                        {/* User Details Form */}
                        <form onSubmit={onsubmitUpdateProfile} className="flex-1 w-full space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-2">Channel Name</label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    disabled={true}
                                    value={user?.name || ""}
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    autoComplete={"channel name"}
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">Account Email</label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    disabled={true}
                                    value={user?.email || ""}
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                    autoComplete={"email"}
                                />
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-600 mb-2">New Password</label>
                                    <Input
                                        type="password"
                                        name="newPassword"
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                        placeholder="Enter a new password"
                                        autoComplete={"new-password"}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 mb-2">Confirm Password</label>
                                    <Input
                                        type="password"
                                        name="confirmPassword"
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                        placeholder="Confirm your new password"
                                        autoComplete={"new-password"}
                                    />
                                </div>
                            </div>
                            <div className="pt-2 space-x-2">
                                <Button
                                    type="submit"
                                    className="cursor-pointer h-12 md:h-10 "
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ProfilePage;
