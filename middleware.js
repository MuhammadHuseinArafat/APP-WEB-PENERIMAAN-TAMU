import { NextResponse } from "@vercel/edge";

// Tentukan path yang ingin Anda lindungi
const PROTECTED_PATH = "/daftar-tamu.html";

export function middleware(req) {
  // Hanya jalankan middleware untuk path yang dilindungi
  if (req.nextUrl.pathname.startsWith(PROTECTED_PATH)) {
    const basicAuth = req.headers.get("authorization");
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      // Decode dari Base64 menggunakan Buffer (lebih andal di lingkungan server)
      const [user, pwd] = Buffer.from(authValue, "base64")
        .toString()
        .split(":");

      // Gunakan Environment Variables untuk keamanan
      const validUser = process.env.BASIC_AUTH_USER;
      const validPass = process.env.BASIC_AUTH_PASS;

      if (user === validUser && pwd === validPass) {
        // Jika benar, lanjutkan ke halaman yang diminta
        return NextResponse.next();
      }
    }

    // Jika salah atau tidak ada, minta otentikasi
    url.pathname = "/api/auth";
    return NextResponse.rewrite(url);
  }

  // Lanjutkan untuk path lain yang tidak dilindungi
  return NextResponse.next();
}
