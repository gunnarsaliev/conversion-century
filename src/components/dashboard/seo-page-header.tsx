
import { getDashboardTranslations } from "@/lib/dashboard-locale";
import { PageHeaderBanner } from "@/components/dashboard/page-header-banner";

// Breadcrumb (Overview › SEO › …), title and description shared by the
// Dashboard → SEO pages. `title` omitted means the SEO overview itself.
export async function SeoPageHeader({
  title,
  description,
}: {
  title?: string;
  description: string;
}) {
  const t = await getDashboardTranslations("Seo");

  return (
    <PageHeaderBanner
      title={title ?? t("title")}
      description={description}
      parent={title ? { label: t("title"), href: "/dashboard/seo" } : undefined}
    />
  );
}
