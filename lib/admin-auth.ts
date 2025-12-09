import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function getAdminSession() {
  const session = await auth()
  return session
}

export async function requireAdmin() {
  const session = await getAdminSession()
  
  if (!session?.user) {
    redirect("/login-admin")
  }
  
  return session
}
