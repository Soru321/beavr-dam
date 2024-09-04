import Heading from "@/components/admin/ui/heading";
import ChangePasswordForm from "@/components/other/change-password-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ChangePasswordPage() {
  return (
    <Card className="m-auto w-fit space-y-6 rounded-3xl px-12 py-16 shadow-xl">
      <CardHeader className="p-0">
        <Heading>Change Password</Heading>
      </CardHeader>
      <CardContent className="p-0">
        <ChangePasswordForm />
      </CardContent>
    </Card>
  );
}
