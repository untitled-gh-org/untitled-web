export interface User {
  userId: string
  username: string
  email: string
  roles: string[]
  exp: number
}

function getCsrfToken(): string {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ""
}

export async function fetchMe(): Promise<User> {
  const res = await fetch(`${import.meta.env.VITE_UNTITLED_BFF_URL}/api/me`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Unauthenticated")
  return res.json() as Promise<User>
}

export function redirectToLogin(loginUri: string, postLoginUri?: string): void {
  const url = new URL(loginUri)
  url.searchParams.set(
    "post_login_success_uri",
    postLoginUri ?? window.location.href,
  )

  window.location.href = url.toString()
}

export async function performLogout(): Promise<void> {
  const postLogoutUri = window.location.origin + "/"
  const res = await fetch(`${import.meta.env.VITE_UNTITLED_BFF_URL}/logout`, {
    method: "POST",
    headers: {
      "X-XSRF-TOKEN": getCsrfToken(),
      "X-POST-LOGOUT-SUCCESS-URI": postLogoutUri,
      "X-RESPONSE-STATUS": "200",
    },
    credentials: "include",
  })
  const location = res.headers.get("Location")
  window.location.href = location ?? postLogoutUri
}
