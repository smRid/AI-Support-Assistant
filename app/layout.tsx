import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
      <body className={`${inter.variable} bg-[#b47d7d] min-h-screen flex flex-col p-0 antialiased text-zinc-100 font-sans`}>
        {children}

        <div className="fixed inset-0 -z-20 pointer-events-none">
          <div className="w-full h-full opacity-20">
            <div
              data-us-project="NMLvqnkICwYYJ6lYbO64"
              className="absolute w-full h-full left-0 top-0"
            />
          </div>
        </div>
      </body>
    </html>
  );
}
