import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

import { Dashboard16Content } from "@/components/dashboard16-content";

export default async function Dashboard() {
  const headers = await getHeaders();
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers });

  const fullUser = user
    ? await payload
        .findByID({ collection: "users", id: user.id, depth: 0 })
        .catch(() => null)
    : null;

  const userName =
    [fullUser?.firstName, fullUser?.lastName].filter(Boolean).join(" ") ||
    user?.email;

  return <Dashboard16Content userName={userName} />;
}
