import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const roles = req.nextauth.token?.roles;

    const isAdmin = Array.isArray(roles) && roles.includes("admin");

    if (req.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.rewrite(new URL("/auth/access-denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
