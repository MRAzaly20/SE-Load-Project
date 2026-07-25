import AdminSignInForm from "@/components/auth/AdminSignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin System Portal | Schneider Electric RDMP",
  description: "Dedicated System Administrator Login Portal",
};

export default function AdminSignInPage() {
  return <AdminSignInForm />;
}
