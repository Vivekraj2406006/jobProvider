import { Mail, User } from "lucide-react";

interface CustomerCardProps {
  customer: {
    name: string;
    email: string;
  };
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        Customer Information
      </h2>

      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-100 p-3">
            <User className="text-blue-600" size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Customer Name</p>

            <p className="font-semibold text-gray-900">{customer.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-green-100 p-3">
            <Mail className="text-green-600" size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="font-semibold text-gray-900">{customer.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
