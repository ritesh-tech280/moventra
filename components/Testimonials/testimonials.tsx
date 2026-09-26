import Image from "next/image";
import { StarIcon } from "@/icons/page";

const testimonials = [
  {
    name: "Aarav Mehta", city: "New Delhi", vehicle: "Sedan",
    image: "https://images.unsplash.com/photo-1626776547707-53c65f13b1d7?auto=format&fit=crop&w=160&h=160&q=80",
    quote: "The fare was clear before I booked, and the airport ride was comfortable. It made an early flight much easier.",
  },
  {
    name: "Ananya Iyer", city: "Bengaluru", vehicle: "Ertiga",
    image: "https://images.unsplash.com/photo-1626193082710-a16206f819f2?auto=format&fit=crop&w=160&h=160&q=80",
    quote: "We had room for the whole family and our bags. Booking the ride was straightforward.",
  },
  {
    name: "Rohan Kapoor", city: "Mumbai", vehicle: "SUV",
    image: "https://images.unsplash.com/photo-1699860777054-13e8d1d6245a?auto=format&fit=crop&w=160&h=160&q=80",
    quote: "A convenient way to plan an outstation trip. I could see the route and estimate before confirming.",
  },
  {
    name: "Priya Sharma", city: "Jaipur", vehicle: "Crysta",
    image: "https://images.unsplash.com/photo-1725033489648-a819750348eb?auto=format&fit=crop&w=160&h=160&q=80",
    quote: "The vehicle was spacious and the ride felt relaxed. I would use Moventra again for family travel.",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-slate-200/60 bg-slate-50 py-16 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">Rider experiences</p>
          <h2 className="text-3xl font-black tracking-tight text-[#0F172A] sm:text-4xl">Journeys across India</h2>
          <p className="mt-3 text-slate-600">A few words from riders in the cities we serve.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article key={item.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, index) => <StarIcon key={index} size={15} className="fill-amber-400" />)}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-slate-700">“{item.quote}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <Image src={item.image} alt={`${item.name}, rider in ${item.city}`} width={44} height={44} className="size-11 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.city} · {item.vehicle}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
