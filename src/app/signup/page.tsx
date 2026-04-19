import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect(user.role === "artist" ? "/artist/dashboard" : "/dashboard");
  const { role } = await searchParams;
  const defaultRole = role === "artist" ? "artist" : "customer";
  return <AuthForm mode="signup" defaultRole={defaultRole} />;
}
