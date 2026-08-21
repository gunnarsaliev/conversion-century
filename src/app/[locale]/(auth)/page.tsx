import { headers as getHeaders } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import { Signup10 } from "@/components/signup10";

export default async function LoginPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  if (user) {
    redirect("/getting-started");
  }

  return <Signup10 />;
}
