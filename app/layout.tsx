import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import SessionSync from "@/components/auth/session-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Chatbot",
  description: "Customer Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black min-h-screen flex flex-col p-0 antialiased text-zinc-100 font-sans">
        <ClerkProvider>
          <SessionSync />
          <div className="fixed inset-0 -z-20 pointer-events-none">
            <div className="w-full h-full opacity-20">
              <div
                data-us-project="NMLvqnkICwYYJ6lYbO64"
                className="absolute w-full h-full left-0 top-0"
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-[#050509] via-transparent to-transparent opacity-80" />
          </div>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
