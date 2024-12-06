import React from "react";
import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "StoreIt - Your Storage Solution",
  description:
    "StoreIt helps you manage and organize your storage efficiently.",
  openGraph: {
    title: "StoreIt - Your Storage Solution",
    description:
      "StoreIt helps you manage and organize your storage efficiently.",
    url: "https://files-management.vercel.app",
    siteName: "StoreIt",
    images: [
      {
        url: "/public/assets/images/dashboardPreview.png",
        width: 1200,
        height: 630,
        alt: "StoreIt Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoreIt - Your Storage Solution",
    description:
      "StoreIt helps you manage and organize your storage efficiently.",
    images: ["/public/assets/images/dashboardPreview.png"],
  },
};

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser) return redirect("/sign-in");
  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header userId={currentUser.$id} accountId={currentUser.accountId} />

        <div className="main-content">{children}</div>
      </section>
      <Toaster />
    </main>
  );
};

export default Layout;
