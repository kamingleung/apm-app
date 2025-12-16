import { ServiceDetailPage } from "@/components/service-detail-page";

interface ServiceDetailProps {
  params: {
    serviceName: string;
  };
}

export default function ServiceDetail({ params }: ServiceDetailProps) {
  return <ServiceDetailPage serviceName={params.serviceName} />;
}