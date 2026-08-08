export default function LoadingJobs() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-56 animate-pulse rounded-2xl bg-gray-200"
        />
      ))}
    </div>
  );
}
