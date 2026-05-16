import { AppShell } from "@/components/AppShell";
import { NotificationCard } from "@/components/NotificationCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { mockNotifications } from "@/lib/mock-data";

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <AppShell
        title="Notifications"
        description="See wallet funding updates, transfer alerts, security notices, and account status changes."
      >
        <div className="grid gap-4">
          {mockNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}
