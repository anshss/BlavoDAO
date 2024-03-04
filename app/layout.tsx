"use client";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//     title: "DeSci",
//     description: "we trying",
// };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
                <title>DeSci</title>
            </head>
            <body>
                <Providers>
                            <div>{children}</div>
                </Providers>
            </body>
        </html>
    );
}
