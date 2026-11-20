export async function logoutTo(destination: "/" | "/auth?tab=masuk") {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Gagal keluar dari akun.");
  window.location.replace(destination);
}
