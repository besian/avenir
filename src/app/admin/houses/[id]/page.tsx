import { HouseEditor } from '@/components/admin/HouseEditor';

/** /admin/houses/new creates a house; /admin/houses/AH-101 edits one. */
export default async function EditHousePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HouseEditor id={decodeURIComponent(id)} />;
}
