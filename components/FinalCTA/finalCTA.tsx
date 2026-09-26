import Link from "next/link";
import { ArrowRightIcon } from "@/icons/page";

export default function FinalCTA() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-700 to-blue-900 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Plan your next ride</h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">Choose a route, compare vehicle options and see your fare estimate in rupees.</p>
          <Link href="#book" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-800 transition hover:bg-blue-50">
            Get a fare estimate <ArrowRightIcon size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
