import { Dashboard16Content } from "@/components/dashboard16-content";
import { sidebarData } from "@/components/dashboard16-layout";

export default function Dashboard() {
  return <Dashboard16Content userName={sidebarData.user?.name} />;
}
