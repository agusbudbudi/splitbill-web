import type { LucideIcon } from "lucide-react";

export interface OverviewPoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CaraPakaiOverviewProps {
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  points: OverviewPoint[];
}

// Section "Apa itu [Fitur]?" — 3 poin overview dengan icon bg-primary solid.
// Server Component (no interaktivitas), dipakai bareng di semua halaman
// "/[fitur]/cara-pakai".
export function CaraPakaiOverview({
  titlePrefix,
  titleHighlight,
  description,
  points,
}: CaraPakaiOverviewProps) {
  return (
    <section id="overview" className="py-16 sm:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {titlePrefix}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              {titleHighlight}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">{description}</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {points.map((point) => (
            <div
              key={point.title}
              className="bg-white rounded-md p-4 sm:p-6 lg:p-8 border border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(71,159,234,0.08)]"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-xl sm:rounded-md flex items-center justify-center p-2 sm:p-2.5 mb-4 sm:mb-6">
                <point.icon className="w-full h-full text-white" strokeWidth={1.75} />
              </div>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-800 mb-1.5 sm:mb-2.5">
                {point.title}
              </h3>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
