"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

export default function CustomerSettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");

  const [name, setName] = useState("Vivek Raj");
  const [email, setEmail] = useState("vivek@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");



  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    workerUpdates: true,
    promotions: false,
    emailNotifications: true,
  });



  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");

  const showSavedMessage = () => {
    setMessage("Changes saved successfully");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPassword) {
      setMessage("Please fill in all password fields");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      setMessage("New passwords do not match");
      return;
    }

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setMessage("Password updated successfully");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const navigation = [
    {
      id: "profile",
      label: "Profile",
      description: "Personal information",
      icon: User,
    },
    {
      id: "address",
      label: "Address",
      description: "Service location",
      icon: MapPin,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Alerts and updates",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      description: "Password and account",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f7f5] px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#146356] text-white shadow-sm sm:h-12 sm:w-12">
              <Settings size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#10201b] sm:text-2xl lg:text-3xl">
                Settings
              </h1>

              <p className="mt-1 max-w-xl text-xs leading-5 text-[#5c6d66] sm:text-sm">
                Manage your profile, address, notifications and account
                security.
              </p>
            </div>
          </div>
        </div>

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="fixed right-4 top-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-[#cce5dc] bg-white px-4 py-3 text-sm font-medium text-[#146356] shadow-lg sm:right-6 sm:top-6">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e7f5ef]">
              <Check size={16} />
            </div>

            <span>{message}</span>

            <button
              onClick={() => setMessage("")}
              className="ml-2 rounded-lg p-1 text-[#789087] hover:bg-[#f1f5f3]"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* MAIN GRID */}
        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-6">
          {/* SIDEBAR */}
          <aside className="h-fit rounded-2xl border border-[#dfe8e3] bg-white p-2 shadow-sm lg:sticky lg:top-6">
            <div className="flex gap-1 overflow-x-auto lg:block lg:space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex min-w-fit items-center gap-3 rounded-xl px-3 py-3 text-left transition lg:w-full ${
                      active
                        ? "bg-[#eaf4f0] text-[#146356]"
                        : "text-[#5c6d66] hover:bg-[#f5f8f6]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-[#d8ece5] text-[#146356]"
                          : "bg-[#f1f5f3] text-[#71817b]"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="hidden min-w-0 lg:block">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-0.5 text-xs text-[#81908a]">
                        {item.description}
                      </p>
                    </div>

                    <span className="lg:hidden text-sm font-semibold">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CONTENT */}
          <main className="min-w-0">
            {/* PROFILE */}
            {activeSection === "profile" && (
              <section className="space-y-5">
                <div className="rounded-2xl border border-[#dfe8e3] bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#10201b]">
                      Personal information
                    </h2>

                    <p className="mt-1 text-sm text-[#71817b]">
                      Update the information associated with your customer
                      account.
                    </p>
                  </div>

                  {/* PROFILE PHOTO */}
                  <div className="mb-7 flex flex-col gap-4 border-b border-[#edf1ef] pb-6 sm:flex-row sm:items-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#146356] text-2xl font-bold text-white shadow-sm">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#10201b]">
                        Profile picture
                      </h3>

                      <p className="mt-1 text-xs text-[#71817b]">
                        Your profile picture helps workers identify you.
                      </p>

                      <button className="mt-3 rounded-lg border border-[#cfdcd6] px-3 py-2 text-xs font-semibold text-[#146356] transition hover:bg-[#f3f8f5]">
                        Change photo
                      </button>
                    </div>
                  </div>

                  {/* FORM */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#24352f]">
                        Full name
                      </label>

                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9a93]"
                        />

                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-[#d8e2dd] bg-white py-3 pl-10 pr-3 text-sm text-[#10201b] outline-none transition placeholder:text-[#9aa8a2] focus:border-[#1e8f7a] focus:ring-4 focus:ring-[#1e8f7a]/10"
                          placeholder="Enter your name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#24352f]">
                        Phone number
                      </label>

                      <div className="relative">
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9a93]"
                        />

                        <input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-xl border border-[#d8e2dd] bg-white py-3 pl-10 pr-3 text-sm text-[#10201b] outline-none transition focus:border-[#1e8f7a] focus:ring-4 focus:ring-[#1e8f7a]/10"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-[#24352f]">
                        Email address
                      </label>

                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9a93]"
                        />

                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          className="w-full rounded-xl border border-[#d8e2dd] bg-white py-3 pl-10 pr-3 text-sm text-[#10201b] outline-none transition focus:border-[#1e8f7a] focus:ring-4 focus:ring-[#1e8f7a]/10"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={showSavedMessage}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f5146] sm:w-auto"
                    >
                      <Save size={17} />
                      Save changes
                    </button>
                  </div>
                </div>

                {/* ACCOUNT STATUS */}
                <div className="rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-base font-bold text-[#10201b]">
                    Account status
                  </h2>

                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-[#f0f8f4] p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8eee5]">
                      <Check size={18} className="text-[#146356]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#10201b]">
                        Customer account active
                      </p>

                      <p className="mt-0.5 text-xs text-[#63756d]">
                        Your account is active and ready to book services.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ADDRESS */}
            {activeSection === "address" && (
              <section className="rounded-2xl border border-[#dfe8e3] bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#10201b]">
                    Saved addresses
                  </h2>

                  <p className="mt-1 text-sm text-[#71817b]">
                    Manage the addresses you use for your service bookings.
                  </p>
                </div>

                <div className="rounded-xl bg-[#f4f8f6] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dff0e9]">
                      <MapPin size={20} className="text-[#146356]" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-[#10201b]">
                        Manage your service addresses
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#71817b]">
                        Save multiple addresses such as Home, Work, or other
                        locations. You can choose a default address for faster
                        bookings.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    href="/customer/addresses"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5146] sm:w-auto"
                  >
                    <MapPin size={17} />
                    Manage addresses
                  </Link>
                </div>
              </section>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <section className="rounded-2xl border border-[#dfe8e3] bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#10201b]">
                    Notifications
                  </h2>

                  <p className="mt-1 text-sm text-[#71817b]">
                    Choose which updates you want to receive.
                  </p>
                </div>

                <div className="divide-y divide-[#edf1ef]">
                  <ToggleRow
                    title="Booking updates"
                    description="Receive updates when your booking is created, assigned or completed."
                    enabled={notifications.bookingUpdates}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        bookingUpdates: !notifications.bookingUpdates,
                      })
                    }
                  />

                  <ToggleRow
                    title="Worker updates"
                    description="Get notified when your worker accepts or reaches your location."
                    enabled={notifications.workerUpdates}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        workerUpdates: !notifications.workerUpdates,
                      })
                    }
                  />

                  <ToggleRow
                    title="Promotions and offers"
                    description="Receive occasional offers and promotional updates."
                    enabled={notifications.promotions}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        promotions: !notifications.promotions,
                      })
                    }
                  />

                  <ToggleRow
                    title="Email notifications"
                    description="Receive important account and booking updates by email."
                    enabled={notifications.emailNotifications}
                    onChange={() =>
                      setNotifications({
                        ...notifications,
                        emailNotifications: !notifications.emailNotifications,
                      })
                    }
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={showSavedMessage}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5146] sm:w-auto"
                  >
                    <Save size={17} />
                    Save preferences
                  </button>
                </div>
              </section>
            )}

            {/* SECURITY */}
            {activeSection === "security" && (
              <section className="space-y-5">
                <div className="rounded-2xl border border-[#dfe8e3] bg-white p-4 shadow-sm sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#10201b]">
                      Change password
                    </h2>

                    <p className="mt-1 text-sm text-[#71817b]">
                      Keep your account secure by using a strong password.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <PasswordInput
                      label="Current password"
                      value={passwords.current}
                      onChange={(value) =>
                        setPasswords({
                          ...passwords,
                          current: value,
                        })
                      }
                      visible={showCurrentPassword}
                      onToggle={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    />

                    <PasswordInput
                      label="New password"
                      value={passwords.newPassword}
                      onChange={(value) =>
                        setPasswords({
                          ...passwords,
                          newPassword: value,
                        })
                      }
                      visible={showNewPassword}
                      onToggle={() => setShowNewPassword(!showNewPassword)}
                    />

                    <PasswordInput
                      label="Confirm new password"
                      value={passwords.confirm}
                      onChange={(value) =>
                        setPasswords({
                          ...passwords,
                          confirm: value,
                        })
                      }
                      visible={showConfirmPassword}
                      onToggle={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    />
                  </div>

                  <div className="mt-6 rounded-xl bg-[#f4f8f6] p-4">
                    <div className="flex gap-3">
                      <Lock
                        size={18}
                        className="mt-0.5 shrink-0 text-[#146356]"
                      />

                      <div>
                        <p className="text-sm font-semibold text-[#10201b]">
                          Password security
                        </p>

                        <ul className="mt-2 space-y-1 text-xs text-[#71817b]">
                          <li>• Use at least 8 characters.</li>
                          <li>• Include numbers and special characters.</li>
                          <li>• Avoid using easily guessed information.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handlePasswordChange}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#146356] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f5146] sm:w-auto"
                    >
                      <KeyRound size={17} />
                      Update password
                    </button>
                  </div>
                </div>

                {/* SECURITY STATUS */}
                <div className="rounded-2xl border border-[#dfe8e3] bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f5ef] text-[#146356]">
                      <ShieldCheck size={20} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#10201b]">
                        Account security
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-[#71817b]">
                        Your account is protected with password authentication.
                        Never share your password with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- */
/* TOGGLE COMPONENT */
/* ----------------------------- */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#10201b]">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#71817b]">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#146356]" : "bg-[#cbd6d1]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ----------------------------- */
/* PASSWORD INPUT */
/* ----------------------------- */

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#24352f]">
        {label}
      </label>

      <div className="relative">
        <KeyRound
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a9a93]"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[#d8e2dd] bg-white py-3 pl-10 pr-11 text-sm text-[#10201b] outline-none transition focus:border-[#1e8f7a] focus:ring-4 focus:ring-[#1e8f7a]/10"
          placeholder="Enter password"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81908a] hover:text-[#146356]"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
