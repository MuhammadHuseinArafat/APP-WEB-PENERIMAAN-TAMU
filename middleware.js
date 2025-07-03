import { NextResponse } from "@vercel/edge";

// Tentukan path yang ingin Anda lindungi
const PROTECTED_PATH = "/daftar-tamu.html";

export function middleware(req) {
  // Hanya jalankan middleware untuk path yang dilindungi
  if (req.nextUrl.pathname.startsWith(PROTECTED_PATH)) {
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      // Decode dari Base64 menggunakan atob() yang merupakan Web API standar
      const [user, pwd] = atob(authValue).split(":");

      // Gunakan Environment Variables untuk keamanan
      const validUser = process.env.BASIC_AUTH_USER;
      const validPass = process.env.BASIC_AUTH_PASS;

      if (user === validUser && pwd === validPass) {
        // Jika benar, lanjutkan ke halaman yang diminta
        return NextResponse.next();
      }
    }

    // Jika otentikasi gagal atau tidak ada, kirim respons 401 secara langsung.
    return new Response("Authentication required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  // Lanjutkan untuk path lain yang tidak dilindungi
  return NextResponse.next();
}
