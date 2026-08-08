export default function LoadingState() {
  return (
    <div className="rounded-2xl border bg-white p-10">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200" />

        <div className="h-32 rounded bg-gray-200" />
      </div>
    </div>
  );
}
