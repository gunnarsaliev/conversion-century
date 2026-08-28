import { headers as getHeaders } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getPayload } from "payload";

import config from "@payload-config";
import { Signup10 } from "@/components/signup10";

export default async function LoginPage() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });
  const locale = await getLocale();

  if (user) {
    redirect({ href: "/docs/getting-started", locale });
  }

  return <Signup10 />;
}
