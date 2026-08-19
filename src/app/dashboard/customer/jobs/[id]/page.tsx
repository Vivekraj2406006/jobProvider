"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Check, IndianRupee, MapPin, Navigation, ShieldCheck, UserRound, Wrench, XCircle } from "lucide-react";

interface Job {
  id: string;
  description: string;
  budget: number;
  status: string;
  createdAt: string;
  latitude: number | null;
  longitude: number | null;
  state: string | null;
  city: string | null;
  area: string | null;
  pincode: string | null;
  service?: { name: string; price: number };
  worker?: { rating?: number; experience?: number; user?: { name: string; email: string } };
}

const steps = [
  ["OPEN", "Job requested", "Your service request was created."],
  ["PENDING_ACCEPTANCE", "Finding a worker", "We are matching you with a skilled worker."],
  ["ACCEPTED", "Worker assigned", "Your worker accepted the request."],
  ["ON_THE_WAY", "On the way", "Your worker is heading to you."],
  ["ARRIVED", "Worker arrived", "Your worker has reached the address."],
  ["IN_PROGRESS", "In progress", "The service is currently underway."],
  ["COMPLETED", "Completed", "This job has been completed."],
] as const;

function statusLabel(status: string) {
  return status.replaceAll("_", " ").toLowerCase().replace(/(^| )\w/g, (letter) => letter.toUpperCase());
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/jobs/${jobId}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (data.success) setJob(data.job);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    void Promise.resolve().then(fetchJob);
    const interval = setInterval(fetchJob, 5000);
    return () => clearInterval(interval);
  }, [fetchJob]);

  if (loading) return <div className="min-h-screen bg-[#f8f5f0] p-6"><div className="mx-auto max-w-5xl animate-pulse rounded-3xl bg-white p-8"><div className="h-8 w-1/3 rounded bg-gray-100" /><div className="mt-8 h-48 rounded-2xl bg-gray-100" /></div></div>;
  if (!job) return <div className="flex min-h-[70vh] items-center justify-center bg-[#f8f5f0]"><div className="rounded-3xl bg-white p-10 text-center shadow-sm"><XCircle className="mx-auto text-gray-300" size={38} /><h1 className="mt-4 text-xl font-bold text-[#1b2a4a]">Job not found</h1><button onClick={() => router.push("/dashboard/customer/jobs")} className="mt-5 font-semibold text-[#c87528]">Back to jobs</button></div></div>;

  const currentStep = steps.findIndex(([key]) => key === job.status);
  const cancelled = job.status === "CANCELLED" || job.status === "REJECTED";
  const address = [job.area, job.city, job.state, job.pincode].filter(Boolean).join(", ");
  const created = new Date(job.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="min-h-screen bg-[#f8f5f0] px-4 py-6 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => router.push("/dashboard/customer/jobs")} className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#1b2a4a]"><ArrowLeft size={17} /> Back to my jobs</button>
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-gray-400">Booking {job.id.slice(-8).toUpperCase()}</p><h1 className="mt-2 font-[Fraunces] text-4xl font-semibold tracking-tight text-[#1b2a4a] sm:text-5xl">{job.service?.name ?? "Service booking"}</h1></div><span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${cancelled ? "border-red-200 bg-red-50 text-red-700" : job.status === "COMPLETED" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#f2d1b2] bg-[#fff0e3] text-[#b45a1f]"}`}><span className="h-2 w-2 rounded-full bg-current" />{statusLabel(job.status)}</span></header>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-8"><h2 className="text-lg font-bold text-[#1b2a4a]">Job progress</h2>{cancelled ? <div className="mt-6 rounded-2xl bg-red-50 p-5 text-sm text-red-700">This booking was {statusLabel(job.status).toLowerCase()}. Please create a new booking if you still need this service.</div> : <ol className="mt-7 space-y-6">{steps.map(([key, label, description], index) => { const done = index < currentStep; const active = index === currentStep; return <li key={key} className="relative flex gap-4"><div className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${done ? "border-emerald-500 bg-emerald-500 text-white" : active ? "border-[#c87528] bg-[#fff0e3] text-[#c87528]" : "border-gray-200 bg-white text-gray-300"}`}>{done ? <Check size={14} strokeWidth={3} /> : <span className={`${active ? "h-2.5 w-2.5" : "h-2 w-2"} rounded-full bg-current`} />}</div>{index < steps.length - 1 && <span className={`absolute left-3.5 top-7 h-8 w-0.5 ${done ? "bg-emerald-400" : "bg-gray-200"}`} />}<div className="-mt-0.5"><p className={`font-semibold ${active ? "text-[#1b2a4a]" : done ? "text-gray-700" : "text-gray-400"}`}>{label}{active && <span className="ml-2 rounded-full bg-[#fff0e3] px-2 py-1 text-[10px] font-bold uppercase text-[#b45a1f]">Current</span>}</p><p className="mt-1 text-sm text-gray-400">{description}</p></div></li>; })}</ol>}</section>
            <section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm sm:p-8"><h2 className="text-lg font-bold text-[#1b2a4a]">Service details</h2><div className="mt-5 space-y-4"><InfoRow icon={<Wrench size={17} />} label="Service request" value={job.description || "No description added."} /><InfoRow icon={<Calendar size={17} />} label="Booked on" value={created} /><InfoRow icon={<MapPin size={17} />} label="Service address" value={address || "Address not available"} /></div></section>
          </div>
          <aside className="space-y-5"><section className="rounded-3xl bg-[#1b2a4a] p-6 text-white shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">Estimated total</p><div className="mt-3 flex items-center gap-1 font-[Fraunces] text-4xl font-semibold"><IndianRupee size={26} />{job.budget}</div><p className="mt-2 text-xs text-white/55">Final amount may be updated after inspection.</p></section><section className="rounded-3xl border border-[#eadfce] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-[#1b2a4a]">Assigned worker</h2>{job.worker?.user ? <div className="mt-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0e3] font-[Fraunces] text-xl font-semibold text-[#c87528]">{job.worker.user.name.charAt(0)}</div><div><div className="flex items-center gap-1.5 font-semibold text-[#1b2a4a]">{job.worker.user.name}<ShieldCheck size={15} className="text-emerald-500" /></div><p className="mt-1 text-xs text-gray-400">{job.worker.rating ? `${job.worker.rating} rating` : "Verified service professional"}{job.worker.experience ? ` · ${job.worker.experience} years experience` : ""}</p></div></div> : <div className="mt-5 rounded-2xl bg-[#fff7ef] p-4 text-sm text-gray-500">We are finding the best available worker for your request.</div>}</section>{address && <section className="overflow-hidden rounded-3xl border border-[#eadfce] bg-white shadow-sm"><div className="flex h-36 items-center justify-center bg-[#1b2a4a] text-white"><Navigation size={28} className="text-[#f39b55]" /><span className="sr-only">Service location</span></div><div className="p-5"><p className="flex items-start gap-2 text-sm text-gray-600"><MapPin size={16} className="mt-0.5 shrink-0 text-[#c87528]" />{address}</p>{job.latitude !== null && job.longitude !== null && <a href={`https://www.google.com/maps/search/?api=1&query=${job.latitude},${job.longitude}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#c87528]">Open in Maps <Navigation size={14} /></a>}</div></section>}<button onClick={() => router.push("/dashboard/customer/jobs")} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold text-[#1b2a4a] transition hover:bg-[#fff7ef]"><UserRound size={16} /> View all bookings</button></aside>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0"><span className="mt-0.5 text-[#c87528]">{icon}</span><div><p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p><p className="mt-1 text-sm leading-6 text-gray-600">{value}</p></div></div>; }
