import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const r = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  const res = NextResponse.json(data, { status: r.status });
  if (r.ok) {
    // Make accessToken readable by the client so that Axios can attach it
    // to the Authorization header on subsequent requests. Keeping it
    // non-HttpOnly allows hooks like `useMyProfile` and the sell page to
    // access the token via `document.cookie`.
    res.cookies.set("accessToken", data.accessToken, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
    });
    res.cookies.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }
  return res;
}
