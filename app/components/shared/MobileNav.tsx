"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/app/constants";
import { usePathname } from "next/navigation";
import { ColourfulText } from "./ui/colourful-text";
import { MenuItem, ProductItem } from "./ui/NavbarMenu";

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <div>
      {/* Header Section */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Logo */}
          <Link href="/">
            <h2 className="font-extrabold text-xl">
              <ColourfulText text="Mooreplaza" />
            </h2>
          </Link>

          {/* Mobile Navigation Sheet */}
          <nav>
            <Sheet>
              {/* Menu Trigger */}
              <SheetTrigger>
                <Image
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="menu"
                  width={32}
                  height={32}
                  className="cursor-pointer "
                />
              </SheetTrigger>

              {/* Sheet Content */}
              <SheetContent className="sm:w-64">
                {/* Logo Inside Sheet */}
                <Link href="/">
                  <h2 className="font-extrabold text-xl mb-6">
                    <ColourfulText text="Mooreplaza" />
                  </h2>
                </Link>

                {/* Navigation Links */}
                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li key={link.route}>
                        <MenuItem
                          item={link.label}
                          setActive={() => {}}
                          active={isActive}
                        >
                          {/* Link */}
                          <Link
                            className="sidebar-link flex items-center space-x-2"
                            href={link.route}
                          >
                            <Image
                              src={link.icon}
                              alt={link.label}
                              width={24}
                              height={24}
                            />
                            <span>{link.label}</span>
                          </Link>

                          {/* Product Items */}
                          {link.productItems && (
                            <div className="text-sm grid grid-cols-1 gap-4 p-4 z-50">
                              {link.productItems.map((product) => (
                                <ProductItem
                                  key={product.title}
                                  title={product.title}
                                  href={product.href}
                                  src={product.src}
                                  description={product.description}
                                />
                              ))}
                            </div>
                          )}
                        </MenuItem>
                      </li>
                    );
                  })}
                </ul>

                {/* Profile Image Inside Sheet */}
                <SheetTitle className="pt-7">
                  <div className="relative w-10 h-10 p-2 rounded-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] hover:shadow-none transition-shadow">
                    <Image
                      src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      alt="user"
                      fill
                      className="rounded-full bg-[#042D29]"
                    />
                  </div>
                </SheetTitle>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default MobileNav;
