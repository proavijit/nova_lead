import { redirect } from 'next/navigation'

export default function HistoryDetailPage({ params }: { params: { id: string } }) {
  redirect(`/dashboard/history/${params.id}`)
}
