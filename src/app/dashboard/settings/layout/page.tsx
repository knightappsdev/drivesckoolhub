import { Metadata } from 'next';
import { getUserFromCookies } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LayoutManager from '@/components/settings/LayoutManager';

export const metadata: Metadata = {
  title: 'Layout Management - DriveSchool Pro',
  description: 'Customize dashboard layouts and interface elements',
};

export default async function LayoutManagementPage() {
  const user = await getUserFromCookies({ cookies } as any);

  if (!user || user.role !== 'super_admin') {
    redirect('/dashboard');
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Layout Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          Customize dashboard layouts, navigation, and interface elements for different user roles
        </p>
      </div>

      <LayoutManager />
    </div>
  );
}