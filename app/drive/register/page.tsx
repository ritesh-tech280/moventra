"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Check,
  ClipboardCheck,
  MapPinned,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const steps = [
  { title: "Your details", subtitle: "Account information", Icon: UserRound },
  { title: "Your address", subtitle: "Contact information", Icon: MapPinned },
  { title: "Your vehicle", subtitle: "Vehicle information", Icon: CarFront },
  { title: "Review", subtitle: "Confirm and finish", Icon: ClipboardCheck },
];

type Values = Record<string, string>;

export default function DriverRegistrationPage() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>({});
  const [message, setMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    const current = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Values;
    const allValues = { ...values, ...current };
    setValues(allValues);

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(`${API}/drivers/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...allValues,
          address: {
            line1: allValues.address,
            city: allValues.city,
            state: allValues.state,
            pincode: allValues.pincode,
          },
          emergencyContact: {
            name: allValues.emergencyName,
            phone: allValues.emergencyPhone,
          },
          vehicle: {
            vehicleType: allValues.vehicleType,
            brand: allValues.brand,
            model: allValues.model,
            manufacturingYear: Number(allValues.manufacturingYear),
            color: allValues.color,
            registrationNumber: allValues.registrationNumber,
            seats: Number(allValues.seats),
            fuelType: allValues.fuelType,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to complete registration.");
      setComplete(true);
      setMessage(
        "Your registration is complete. Our team will review your details and follow up about document verification.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to complete registration.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 -top-36 h-[32rem] w-[32rem] rounded-full bg-blue-300/35 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-cyan-200/45 blur-3xl" />
        <div className="absolute -bottom-48 left-1/3 h-[32rem] w-[32rem] rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl">
        <header className="mx-auto mb-9 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-2 text-xs font-bold tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur">
            <CarFront size={16} aria-hidden="true" /> MOVENTRA DRIVER PARTNER
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Start driving with Moventra
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Complete a few details to get your driver profile ready for review.
          </p>
        </header>

        <nav
          aria-label="Registration progress"
          className="mb-7 rounded-2xl border border-white/70 bg-white/65 px-3 py-5 shadow-lg shadow-blue-900/5 backdrop-blur-xl sm:px-8"
        >
          <ol className="grid grid-cols-4">
            {steps.map(({ title, subtitle, Icon }, index) => {
              const number = index + 1;
              const done = complete || step > number;
              const active = !complete && step === number;
              return (
                <li
                  key={title}
                  className="relative flex flex-col items-center text-center"
                >
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className={`absolute right-1/2 top-5 h-0.5 w-full ${done || active ? "bg-blue-500" : "bg-slate-200"}`}
                    />
                  )}
                  <span
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${done ? "border-blue-600 bg-blue-600 text-white" : active ? "border-blue-600 bg-white text-blue-700 ring-4 ring-blue-100" : "border-slate-200 bg-white text-slate-400"}`}
                  >
                    {done ? (
                      <Check size={18} strokeWidth={3} aria-label="Completed" />
                    ) : (
                      <Icon size={18} aria-hidden="true" />
                    )}
                  </span>
                  <span
                    className={`mt-2 text-xs font-bold sm:text-sm ${active || done ? "text-slate-900" : "text-slate-400"}`}
                  >
                    {title}
                  </span>
                  <span className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                    {subtitle}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>

        <section className="mx-auto max-w-2xl rounded-[1.75rem] border border-white/80 bg-white/85 p-6 shadow-2xl shadow-blue-950/10 backdrop-blur-xl sm:p-10">
          {complete ? (
            <div className="py-8 text-center">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <ShieldCheck size={34} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-slate-900">
                Thanks for registering
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-slate-600">{message}</p>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <p className="text-sm font-bold text-blue-700">
                  STEP {step} OF 4
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  {steps[step - 1].title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {step === 4
                    ? "Check your information before creating your driver account."
                    : "Your information is kept in this form until you finish registration."}
                </p>
              </div>

              {message && (
                <p
                  role="alert"
                  className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800"
                >
                  {message}
                </p>
              )}

              <form className="space-y-5" onSubmit={submit}>
                {step === 1 && (
                  <>
                    <Input
                      name="name"
                      label="Full name"
                      defaultValue={values.name}
                      autoComplete="name"
                      placeholder="Enter Your Name"
                     
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="email"
                        label="Email address"
                        placeholder="you@example.com"
                        type="email"
                        defaultValue={values.email}
                        autoComplete="email"
                      />
                      <Input
                        name="phone"
                        label="Phone number"
                        placeholder="9536993493"
                        type="tel"
                        defaultValue={values.phone}
                        autoComplete="tel"
                      />
                    </div>
                    <Input
                      name="dateOfBirth"
                      label="Date of birth"
                      placeholder="10 12 2004"
                      type="date"
                      defaultValue={values.dateOfBirth}
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="password"
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        defaultValue={values.password}
                        autoComplete="new-password"
                      />
                      <Input
                        name="confirmPassword"
                        label="Confirm password"
                        placeholder="••••••••"
                        type="password"
                        defaultValue={values.confirmPassword}
                        autoComplete="new-password"
                      />
                    </div>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Input
                      name="address"
                      label="Street address"
                      placeholder="House no., street, locality"
                      defaultValue={values.address}
                      autoComplete="street-address"
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="city"
                        label="City"
                        placeholder="Meerut"
                        defaultValue={values.city}
                        autoComplete="address-level2"
                      />
                      <Input
                        name="state"
                        label="State"
                        placeholder="Uttar Pradesh"
                        defaultValue={values.state}
                        autoComplete="address-level1"
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="pincode"
                        label="PIN code"
                        placeholder="6-digit pincode"
                        defaultValue={values.pincode}
                        autoComplete="postal-code"
                      />
                      <Input
                        name="emergencyName"
                        label="Emergency contact name"
                        placeholder="Full Name"
                        defaultValue={values.emergencyName}
                      />
                    </div>
                    <Input
                      name="emergencyPhone"
                      label="Emergency contact phone"
                      placeholder="9536993493"
                      type="tel"
                      defaultValue={values.emergencyPhone}
                    />
                  </>
                )}
                {step === 3 && (
                  <>
                    <label className="block text-sm font-semibold text-slate-700">
                      Vehicle type
                      <select
                        name="vehicleType"
                        required
                        defaultValue={values.vehicleType || ""}
                        className={fieldClass}
                      >
                        <option value="" disabled>
                          Select vehicle type
                        </option>
                        {["Mini", "Sedan", "SUV", "Auto", "Electric"].map(
                          (type) => (
                            <option key={type}>{type}</option>
                          ),
                        )}
                      </select>
                    </label>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="brand"
                        label="Brand"
                        placeholder="Maruti Suzuki"
                        defaultValue={values.brand}
                      />
                      <Input
                        name="model"
                        label="Model"
                        placeholder="Swift Dezire"
                        defaultValue={values.model}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="manufacturingYear"
                        label="Manufacturing year"
                        placeholder="2025"
                        type="number"
                        min="1980"
                        defaultValue={values.manufacturingYear}
                      />
                      <Input
                        name="seats"
                        label="Passenger seats"
                        placeholder="4"
                        type="number"
                        min="1"
                        max="12"
                        defaultValue={values.seats}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Input
                        name="color"
                        label="Color"
                        placeholder="white"
                        defaultValue={values.color}
                      />
                      <Input
                        name="registrationNumber"
                        label="Registration number"
                        placeholder="UP15 1234"
                        defaultValue={values.registrationNumber}
                      />
                    </div>
                    <Input
                      name="fuelType"
                      label="Fuel type"
                      placeholder="Petrol, Diesel, CNG, Electric"
                      defaultValue={values.fuelType}
                    />
                  </>
                )}
                {step === 4 && <Review values={values} />}

                <div className="flex gap-3 pt-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setMessage("");
                        setStep(step - 1);
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <ArrowLeft size={17} /> Back
                    </button>
                  )}
                  <button
                    disabled={busy}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-700 to-indigo-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-700/20 transition hover:from-blue-800 hover:to-indigo-700 disabled:cursor-wait disabled:opacity-60"
                  >
                    {busy
                      ? "Creating your account…"
                      : step === 4
                        ? "Complete registration"
                        : "Continue"}
                    {!busy &&
                      (step === 4 ? (
                        <Check size={18} />
                      ) : (
                        <ArrowRight size={18} />
                      ))}
                  </button>
                </div>
              </form>
            </>
          )}
        </section>
        <p className="mx-auto mt-5 flex max-w-2xl items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={15} className="shrink-0" /> Your account and
          vehicle are saved together only when you complete registration.
        </p>
      </div>
    </main>
  );
}

const fieldClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Input({
  name,
  label,
  placeholder,
  type = "text",
  defaultValue,
  autoComplete,
  min,
  max,
}: {
  name: string;
  label: string;
  placeholder: string ;
  type?: string;
  defaultValue?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        min={min}
        max={max}
        className={fieldClass}
      />
    </label>
  );
}

function Review({ values }: { values: Values }) {
  const groups = [
    {
      title: "Personal details",
      lines: [
        `${values.name}`,
        values.email,
        values.phone,
        `Date of birth: ${values.dateOfBirth}`,
      ],
    },
    {
      title: "Address and emergency contact",
      lines: [
        `${values.address}, ${values.city}, ${values.state} ${values.pincode}`,
        `${values.emergencyName} · ${values.emergencyPhone}`,
      ],
    },
    {
      title: "Vehicle",
      lines: [
        `${values.manufacturingYear} ${values.brand} ${values.model} · ${values.color}`,
        `${values.vehicleType} · ${values.seats} seats · ${values.fuelType}`,
        `Registration: ${values.registrationNumber}`,
      ],
    },
  ];
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <section
          key={group.title}
          className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
        >
          <h3 className="text-sm font-bold text-slate-900">{group.title}</h3>
          <div className="mt-2 space-y-1">
            {group.lines.map((line) => (
              <p key={line} className="break-words text-sm text-slate-600">
                {line}
              </p>
            ))}
          </div>
        </section>
      ))}
      <p className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
        Once you complete registration, your account and vehicle details will be
        saved together. Document verification will be arranged with our
        operations team.
      </p>
    </div>
  );
}
