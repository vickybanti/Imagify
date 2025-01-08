import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const IBMPlex = IBM_Plex_Sans({
  variable:'--font-ibm-plex',
  weight: ['400','500','600','700'],
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Imagify",
  description: "AI powered image generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      variables:{colorPrimary:'#624cf5'}
    }}>

    <html lang="en">
      <body
        className={cn(`font-IBMPlex antialiased`, IBMPlex.variable )}
      >
        
        {children}
      </body>
    </html>
    </ClerkProvider>

  );
}
