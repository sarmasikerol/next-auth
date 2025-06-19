import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.roles?.includes("admin")) {
    redirect("/auth/login");
  }

  return (
    <div>
      <h1>Admin Paneline Hoşgeldin, {session.user.name}</h1>
      {/* Admin sayfası içeriği */}
    </div>
  );
}
