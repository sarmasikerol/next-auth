"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  
    const logoutUrl = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/v2/logout?federated&returnTo=${encodeURIComponent(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    )}&client_id=${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}`;
  
    window.location.href = logoutUrl;
  };
  

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Session yükleniyor... Status: {status}</div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    console.log("Redirecting to login...");
    redirect("/auth/login");
    return null;
  }

  // Session var ama data yok
  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Session yok ama status: {status}</div>
      </div>
    );
  }

  // Admin kontrolü
  const isAdmin = session.user?.roles?.includes("admin");

  return (
    <div className="min-h-screen bg-gray-500">
      <div className="container mx-auto px-4 py-6">
        {/* MAIN */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Hoş Geldiniz, {session.user?.name}
              </h1>
              <p className="text-gray-600 mt-1">Dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="
            bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* USER CONTENT */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Hesap Bilgileri
          </h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-gray-600">Email:</span>
              <p className="font-medium text-blue-800">{session.user?.email}</p>
            </div>
            <div>
              <span className="text-gray-600">Roller:</span>
              <p className="font-medium">
                {session.user?.roles?.map((role) => (
                  <span
                    key={role}
                    className={`inline-block px-2 py-1 rounded-full text-xs mr-2 ${
                      role === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {role}
                  </span>
                ))}
              </p>
            </div>
            <div>
              {isAdmin && (
                <div>
                  <Link
                    href="/admin"
                    className="text-white bg-blue-500 p-3 rounded-md shadow-lg"
                  >
                    Yönetici Paneline Git
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Genel İşlemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
              <h3 className="font-medium mb-2">Profil</h3>
              <p>Profil bilgilerini güncelle</p>
            </button>

            <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
              <h3 className="font-medium mb-2">Ayarlar</h3>
              <p className="text-sm opacity-90">Hesap ayarlarını değiştir</p>
            </button>

            <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
              <h3 className="font-medium mb-2">Destek</h3>
              <p className="text-sm opacity-90">Yardım ve destek al</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
