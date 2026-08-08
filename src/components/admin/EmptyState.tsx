import { Inbox } from "lucide-react";

interface Props {
  title: string;
  message: string;
}

export default function EmptyState({
  title,
  message,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white py-20 text-center">
      <Inbox
        size={60}
        className="mx-auto text-gray-300"
      />

      <h2 className="mt-6 text-2xl font-semibold">
        {title}
      </h2>

      <p className="mt-2 text-gray-500">
        {message}
      </p>
    </div>
  );
}
