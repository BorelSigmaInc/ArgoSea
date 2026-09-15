import ApiDocView from "../../../../components/maer/ApiDocView";
import { DOC_PAGES } from "../../../../lib/maer/docs";

export const metadata = {
  title: "Marine Maer docs",
  description: "Maersat Cloud documentation for Marine Maer — provisioning, API, Marine MIS, and operations.",
};

export default async function ApiDocPage({ params }) {
  const { slug } = await params;
  const topic = (slug && slug[0]) || "overview";
  const known = DOC_PAGES[topic] ? topic : "overview";
  return <ApiDocView topic={known} />;
}
