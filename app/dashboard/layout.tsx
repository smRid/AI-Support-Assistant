import Sidebar from "@/components/dashboard/sidebar";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const metadataCookie = cookieStore.get("metadata");

  return (
    <div className="bg-[#050509] min-h-screen font-sans antialiased text-white selection:zinc-800 flex">
      {metadataCookie?.value ? <>
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-64 relative min-h-screen transition-all duration-300 ">
        {/* <Header /> */}
        <main className="flex-1">{children}</main>
        </div>
      </> : children}
    </div>
  );
}