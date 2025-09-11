"use client"
import React, {ChangeEvent, useState} from 'react';
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {onDidMount} from "@lib/react-adapter";
import {getAuth} from "@lib/utils";
import {IUser} from "@interfaces/user";
import {geImageProxyAPI, getImageURL} from "@util/helper";
import {Label} from "@components/ui/label";
import Image from "next/image";
import {ImageUp} from "lucide-react";

// The main App component containing the entire profile settings page UI.
const App = () => {
    // User data state, now editable.
    const [user, setUser] = useState<IUser>();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    onDidMount(function () {
        const user: IUser = getAuth()
        setAvatarPreview(getImageURL(user.avatar))
        setUser(user);
    })

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

    // const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const file: File | undefined = event.target.files?.[0];
    //     if (file) {
    //         setAvatarFile(file);
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setAvatarPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setAvatarFile(null);
    //         setAvatarPreview(null);
    //     }
    // };

    console.log("avatarPreview", avatarPreview);
    return (
        <div className="h-dvh bg-gray-50 flex items-center justify-center p-4 sm:p-8 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-6 sm:p-10">

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
                                        <Image src={geImageProxyAPI(avatarPreview)} alt="Avatar Preview" className="h-full w-full object-cover" width={100} height={100}/>
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
                        <form className="flex-1 w-full space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-2">Name</label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={user?.name}
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={user?.email}
                                    className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-600 mb-2">New Password</label>
                                    <Input
                                        type="password"
                                        id="newPassword"
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                        placeholder="Enter a new password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 mb-2">Confirm Password</label>
                                    <Input
                                        type="password"
                                        id="confirmPassword"
                                        className="w-full p-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                                        placeholder="Confirm your new password"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
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
};

export default App;
