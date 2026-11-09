import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type { ClientFormOptions } from "@/lib/client-form-schema";

// Services and team members for the client edit drawer's pickers.
// Deduped per request with React `cache`.
const getClientFormOptions = cache(async (): Promise<ClientFormOptions> => {
  const payload = await getPayload({ config });
  const [services, users] = await Promise.all([
    payload.find({
      collection: "services",
      depth: 0,
      limit: 500,
      sort: "name",
      pagination: false,
      select: { name: true },
    }),
    payload.find({
      collection: "users",
      depth: 0,
      limit: 500,
      sort: "firstName",
      pagination: false,
      select: { firstName: true, lastName: true, email: true },
    }),
  ]);

  return {
    services: services.docs.map((service) => ({ id: service.id, name: service.name })),
    users: users.docs.map((user) => ({
      id: user.id,
      name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
    })),
  };
});

export { getClientFormOptions };
