import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { authService } from "@/services/authService";
import { bookingService } from "@/services/bookingService";
import { contentService } from "@/services/contentService";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await authService.isAuthenticated())) {
    redirect("/admin/login");
  }

  const [content, bookings] = await Promise.all([
    contentService.getContent(),
    bookingService.list(),
  ]);

  return <AdminDashboard initialContent={content} initialBookings={bookings} />;
}
