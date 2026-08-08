"use client";

import { DataTable } from "@/components/admin/common";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { TableColumn } from "@/types/dataTable";
import { AdminUser } from "@/types/adminUser";

const columns: TableColumn<AdminUser>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "role",
    title: "Role",
    render: (user) => (
      <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">
        {user.role}
      </span>
    ),
  },
];

export default function UsersPage() {
  const {
    users,
    loading,
    error,
  } = useAdminUsers();

  if (error) {
    return (
      <div className="rounded bg-red-50 p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Users
      </h1>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
}
