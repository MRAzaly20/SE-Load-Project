import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineer & Manager Sign In | SE Project Load - Schneider Electric",
  description: "Schneider Electric Resource & Deployment Management Platform SSO Sign In",
};

export default function SignIn() {
  return <SignInForm />;
}
