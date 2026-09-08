import { DashboardLayout } from "@/components/dashboard16-layout";

export default function Dashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
