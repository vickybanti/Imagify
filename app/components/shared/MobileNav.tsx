"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { navLinks } from "@/app/constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  const { data, status } = useSession();

  return (
    <div className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      <nav className="flex gap-2">
        {status === "authenticated" ? (
          <>
            <div className="relative w-10 h-10 p-2 rounded-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-none transition-shadow">
              <Image
                src={
                  data?.user.image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="user"
                fill
                className="rounded-full bg-[#042D29]"
              />
            </div>
            <Sheet>
              <SheetTrigger>
                <Image
                  src="/assets/icons/menu.svg"
                  alt="menu"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </SheetTrigger>
              <SheetContent className="sheet-content sm:w-64">
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />

                <ul className="header-nav_elements">
                  {navLinks.slice(0, 6).map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={`p-18 flex whitespace-nowrap text-dark-700 ${
                          isActive ? "gradient-text text-white" : ""
                        }`}
                      >
                        <Link
                          className="sidebar-link cursor-pointer"
                          href={link.route}
                        >
                          <Image
                            src={link.icon}
                            alt="icon"
                            width={24}
                            height={24}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <SheetTitle className="pt-7">
                  <div className="relative w-10 h-10 p-2 rounded-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-none transition-shadow">
                    <Image
                      src={
                        data?.user.image ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="user"
                      fill
                      className="rounded-full bg-[#042D29]"
                    />
                  </div>
                  {data?.user?.name}
                </SheetTitle>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/login">Login</Link>
          </Button>
        )}
      </nav>
    </div>
  );
};

export default MobileNav;
