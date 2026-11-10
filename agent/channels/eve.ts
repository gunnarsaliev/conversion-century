import { type AuthFn, localDev } from "eve/channels/auth";
import { eveChannel } from "eve/channels/eve";

import { appUrl } from "../lib/app-url";

// Only signed-in dashboard users may talk to the agent. The browser calls
// /eve/v1/* on the app's own domain, so Payload's `payload-token` cookie
// comes along; we ask Payload who it belongs to.
const payloadSession: AuthFn<Request> = async (request) => {
  const cookie = request.headers.get("cookie");
  if (!cookie?.includes("payload-token=")) return null;

  const response = await fetch(`${appUrl()}/api/users/me`, {
    headers: { cookie },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const { user } = (await response.json()) as {
    user: { id: number | string; email?: string; role?: string } | null;
  };
  if (!user) return null;

  return {
    authenticator: "payload",
    principalId: String(user.id),
    principalType: "user",
    attributes: { role: user.role ?? "user" },
  };
};

export default eveChannel({
  auth: [payloadSession, localDev()],
});
