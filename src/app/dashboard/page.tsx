"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
  }

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hoş Geldiniz, {session.user?.name}</h1>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Çıkış Yap
        </button>
      </div>
      <p className="mt-4">Email: {session.user?.email}</p>
      <p className="mt-2">Roller: {session.user?.roles?.join(", ")}</p>
    </div>
  );
}
