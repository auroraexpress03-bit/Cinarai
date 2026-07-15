'use client';

import { useParams } from 'next/navigation';
import { TeacherDashboardLayout } from '../../components/TeacherDashboardLayout';
import { TeacherHeader } from '../../components/TeacherHeader';
import { TeacherSidebar } from '../../components/TeacherSidebar';

export default function StudentDetailPage() {
  const params = useParams<{ studentId: string }>();

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
      <TeacherDashboardLayout header={<TeacherHeader />} sidebar={<TeacherSidebar />}>
        <div className="rounded-[28px] border border-neutral-100 bg-white p-8 shadow-sm shadow-neutral-200/70">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary-500">Detail Siswa</p>
          <h1 className="mt-2 text-3xl font-black text-neutral-900">{params.studentId}</h1>
          <div className="mt-6 space-y-3 rounded-[24px] border border-dashed border-neutral-200 bg-neutral-50 p-6">
            <p className="text-lg font-semibold text-neutral-800">Nama siswa</p>
            <p className="text-neutral-600">Email</p>
            <p className="text-neutral-600">Kelas</p>
            <p className="mt-4 text-sm font-semibold text-primary-700">Coming Soon</p>
          </div>
        </div>
      </TeacherDashboardLayout>
    </div>
  );
}
