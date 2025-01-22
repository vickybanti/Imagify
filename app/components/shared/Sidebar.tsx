"use client";

import { navLinks } from '@/app/constants';
import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const { data, status } = useSession();
    const userName = data?.user?.name;

    return (
        <aside className="sidebar">
            <div className="flex size-full flex-col gap-4">
                <Link href="/" className="sidebar-logo">
                    <Image src="/assets/imageslogo-text.svg" alt="logo" width={180} height={28} />
                </Link>

                <nav className="sidebar-nav">
                    {status === 'authenticated' ? (
                        <>
                            <ul className="sidebar-nav_elements">
                                {navLinks.slice(0, 6).map((link) => {
                                    const isActive = link.route === pathname;

                                    return (
                                        <li
                                            key={link.route}
                                            className={`sidebar-nav_element group ${
                                                isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                            }`}
                                        >
                                            <Link className="sidebar-link" href={link.route}>
                                                <Image
                                                    src={link.icon}
                                                    alt="icon"
                                                    width={24}
                                                    height={24}
                                                    className={`${isActive && 'brightness-200'}`}
                                                />
                                                {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>

                            <ul className="sidebar-nav_elements pt-6">
                                {navLinks.slice(6).map((link) => {
                                    const isActive = link.route === pathname;

                                    return (
                                        <li
                                            key={link.route}
                                            className={`sidebar-nav_element group ${
                                                isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                                            }`}
                                        >
                                            <Link className="sidebar-link" href={link.route}>
                                                <Image
                                                    src={link.icon}
                                                    alt="icon"
                                                    width={24}
                                                    height={24}
                                                    className={`${isActive && 'brightness-200'}`}
                                                />
                                                {link.label}
                                            </Link>
                                        </li>
                                    );
                                })}

                                <li className="flex-center cursor-pointer gap-2 p-4">
                                    {/* Ensure UserButton exists or replace */}

                                    <div className="relative w-10 h-10 p-2 rounded-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-none transition-shadow">
                    <Image
                      src={
                        data?.user.photo ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="user"
                      fill
                      className="rounded-full bg-[#042D29]"
                    />
                  </div>
                  {data?.user?.firstName}
                                </li>
                            </ul>
                        </>
                    ) : (
                        <Button asChild className="button bg-purple-gradient bg-cover">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
