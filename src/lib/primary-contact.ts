import type { Payload } from "payload";

import type { Client, Contact } from "../../payload-types";

type ContactInput = Pick<Contact, "name"> & Partial<Pick<Contact, "email" | "role">>;

// Updates the client's primary contact, or creates one and makes it primary
// when the client has none yet.
export async function upsertPrimaryContact(
  payload: Payload,
  client: Pick<Client, "id" | "primaryContact">,
  data: ContactInput,
) {
  const primaryId =
    client.primaryContact && typeof client.primaryContact === "object"
      ? client.primaryContact.id
      : client.primaryContact;

  if (primaryId) {
    await payload.update({ collection: "contacts", id: primaryId, data });
    return;
  }

  const contact = await payload.create({
    collection: "contacts",
    data: { ...data, client: client.id, status: "active" },
  });
  await payload.update({
    collection: "clients",
    id: client.id,
    data: { primaryContact: contact.id },
  });
}

// Name of the client's primary contact, when the relation is populated.
export function primaryContactName(client: Pick<Client, "primaryContact">) {
  return client.primaryContact && typeof client.primaryContact === "object"
    ? client.primaryContact.name
    : undefined;
}

// The client's contacts from its `contacts` join (populated at depth ≥ 1),
// primary contact first.
export function clientContacts(client: Pick<Client, "primaryContact" | "contacts">) {
  const primaryId =
    client.primaryContact && typeof client.primaryContact === "object"
      ? client.primaryContact.id
      : client.primaryContact;

  return (client.contacts?.docs ?? [])
    .filter((contact): contact is Contact => typeof contact === "object")
    .map((contact) => ({ ...contact, isPrimary: contact.id === primaryId }))
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
}
