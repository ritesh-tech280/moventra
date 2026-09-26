import { CarIcon, SuvIcon, UsersIcon } from "@/icons/page";

const vehicles = [
  { name: "Sedan", detail: "A comfortable choice for city rides and airport transfers.", rate: "₹13/km", icon: CarIcon },
  { name: "Ertiga", detail: "Extra room for families and small groups.", rate: "₹15/km", icon: UsersIcon },
  { name: "SUV", detail: "More space for passengers and luggage.", rate: "₹18/km", icon: SuvIcon },
  { name: "Crysta", detail: "A spacious option for family and business travel.", rate: "Route-based fare", icon: UsersIcon },
  { name: "Traveller", detail: "For larger groups travelling together.", rate: "Route-based fare", icon: UsersIcon },
  { name: "Urbania", detail: "A roomy option for group and outstation trips.", rate: "Route-based fare", icon: UsersIcon },
  { name: "Kia", detail: "A comfortable option for everyday and airport rides.", rate: "Route-based fare", icon: CarIcon },
];

export default function RideOptions() {
  return (
    <section id="ride-options" className="border-b border-slate-200/60 bg-white py-16 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">Choose your vehicle</p>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">A ride for every journey</h2>
          <p className="mt-3 text-slate-600">Pick the vehicle that fits your trip, group and luggage.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map(({ name, detail, rate, icon: Icon }) => (
            <article key={name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md">
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={22} /></div>
              <h3 className="text-lg font-bold text-slate-900">{name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{detail}</p>
              <p className="mt-5 border-t border-slate-100 pt-4 text-sm font-semibold text-blue-800">{rate}</p>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-slate-500">Other vehicle fares depend on the route. Check your trip details before booking.</p>
      </div>
    </section>
  );
}
