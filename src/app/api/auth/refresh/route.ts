import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function POST(req: NextRequest) {
  const rt = req.cookies.get("refreshToken")?.value;
  if (!rt) return NextResponse.json({ message: "No refresh token" }, { status: 401 });

  const r = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: rt }),
  });

  const data = await r.json();
  const res = NextResponse.json(data, { status: r.status });
  if (r.ok) {
    res.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    if (data.refreshToken) {
      res.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }
  }
  return res;
}
