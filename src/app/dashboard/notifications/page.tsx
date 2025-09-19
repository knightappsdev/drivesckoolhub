import { Metadata } from 'next';
import { getUserFromCookies } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export const metadata: Metadata = {
  title: 'Notifications - DriveSchool Pro',
  description: 'Manage your notifications and preferences',
};

export default async function NotificationsPage() {
  const user = await getUserFromCookies({ cookies } as any);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your notifications and customize your preferences
        </p>
      </div>

      <NotificationCenter userId={user.id} />
    </div>
  );
}