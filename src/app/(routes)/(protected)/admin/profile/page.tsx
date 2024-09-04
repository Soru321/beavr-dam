import { trpcCaller } from "@/app/_trpc/caller";
import Heading from "@/components/admin/ui/heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import ProfileForm from "./_components/profile-form";

export default async function ProfilePage() {
  const user = await (await trpcCaller()).auth.getCurrent();

  return (
    <Card className="m-auto w-fit space-y-6 rounded-3xl px-12 py-16 shadow-xl">
      <CardHeader className="p-0">
        <Heading>Profile</Heading>
      </CardHeader>
      <CardContent className="p-0">
        <ProfileForm user={user} />
      </CardContent>
    </Card>
  );
}
