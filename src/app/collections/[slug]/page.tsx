import ClientView from "./ClientView";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageIdx = Math.max(0, parseInt(page ?? "0", 10) || 0);

  return <ClientView slug={slug} pageIdx={pageIdx} />;
}

