import PageClient from "./PageClient";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return <PageClient params={params} />;
}
