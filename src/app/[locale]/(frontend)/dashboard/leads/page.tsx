import { ClientPipelinePage } from "@/components/dashboard/client-pipeline-page";

export default function LeadsPage() {
  return <ClientPipelinePage statuses={["lead"]} namespace="Leads" newStatus="lead" />;
}
