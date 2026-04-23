import type { Metadata } from "next";
import { UserDetailClient } from "./UserDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `User #${id}`,
    description: `View full profile details for user ID ${id}.`,
  };
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  return <UserDetailClient id={numericId} />;
}
