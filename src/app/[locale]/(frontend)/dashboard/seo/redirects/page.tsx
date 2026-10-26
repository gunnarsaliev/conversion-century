import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

import { RedirectManager } from "@/components/dashboard/redirect-manager";
import { SeoPageHeader } from "@/components/dashboard/seo-page-header";
import { requireDashboardUser } from "@/lib/dashboard-auth";
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { isAdminOrEditor } from "@/lib/roles";
import { SITE_URL } from "@/lib/seo/site";

// ---------------------------------------------------------------------------
// SEO → Redirects
// ---------------------------------------------------------------------------
//
// The `redirects` collection as an editable table (components/dashboard/
// redirect-manager, saved through ./actions). src/proxy.ts applies the
// enabled rules. Admins and editors only.
export default async function RedirectsPage() {
  const user = await requireDashboardUser();
  if (!isAdminOrEditor(user)) notFound();

  const t = await getDashboardTranslations("Seo.redirects");
  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "redirects",
    depth: 0,
    pagination: false,
    sort: "from",
  });

  return (
    <>
      <SeoPageHeader title={t("title")} description={t("description")} />
      <RedirectManager
        siteHost={new URL(SITE_URL).host}
        redirects={docs.map(({ id, from, to, statusCode, enabled }) => ({
          id,
          from,
          to,
          statusCode: statusCode ?? "301",
          enabled: enabled ?? true,
        }))}
      />
    </>
  );
}
