import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "artist" ? "/artist/dashboard" : "/dashboard");
  return <AuthForm mode="login" />;
}
