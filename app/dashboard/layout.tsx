export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#050509] font-sans antialiased text-white">
      {children}
    </div>
  );
}
