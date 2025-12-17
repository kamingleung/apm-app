import { ServiceDetailPage } from "@/components/service-detail-page";

interface ServiceDetailProps {
  params: Promise<{
    serviceName: string;
  }>;
}

export default async function ServiceDetail({ params }: ServiceDetailProps) {
  const { serviceName } = await params;
  return <ServiceDetailPage serviceName={serviceName} />;
}