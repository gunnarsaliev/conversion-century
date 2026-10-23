import { ClientPipelinePage } from "@/components/dashboard/client-pipeline-page";

export default function ConsultationsPage() {
  return (
    <ClientPipelinePage
      statuses={["consultation"]}
      namespace="Consultations"
      newStatus="consultation"
    />
  );
}
