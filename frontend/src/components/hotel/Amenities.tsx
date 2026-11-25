import React from "react";
import {
  Wifi,
  Utensils,
  Car,
  Clock,
  Zap,
  Flame,
  Dog,
  Trees,
  Waves,
  Sparkles,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AmenitiesProps {
  amenities: string[];
}

interface AmenityCategory {
  title: string;
  items: Array<{ name: string; icon: React.ComponentType<{ className?: string }> }>;
}

function getIconForAmenity(name: string): React.ComponentType<{ className?: string }> {
  const lower = name.toLowerCase();
  if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("meal") || lower.includes("food") || lower.includes("breakfast")) return Utensils;
  if (lower.includes("parking") || lower.includes("valet") || lower.includes("car")) return Car;
  if (lower.includes("front desk") || lower.includes("24-hour") || lower.includes("concierge")) return Clock;
  if (lower.includes("power") || lower.includes("backup") || lower.includes("generator")) return Zap;
  if (lower.includes("bonfire") || lower.includes("fire") || lower.includes("heating") || lower.includes("heated")) return Flame;
  if (lower.includes("pet") || lower.includes("dog")) return Dog;
  if (lower.includes("garden") || lower.includes("lawn") || lower.includes("forest") || lower.includes("tree")) return Trees;
  if (lower.includes("river") || lower.includes("water") || lower.includes("beach")) return Waves;
  if (lower.includes("heater") || lower.includes("warm")) return Thermometer;
  if (lower.includes("housekeeping") || lower.includes("clean") || lower.includes("laundry")) return Sparkles;
  if (lower.includes("security") || lower.includes("safe")) return ShieldCheck;
  return CheckCircle2;
}

function categorizeAmenities(amenities: string[]): AmenityCategory[] {
  const categories: Record<string, Array<{ name: string; icon: React.ComponentType<{ className?: string }> }>> = {
    "Popular Amenities": [],
    "Property & Comfort": [],
    "Dining & Dining Experiences": [],
    "Services & Outdoor": [],
  };

  amenities.forEach((item) => {
    const lower = item.toLowerCase();
    const icon = getIconForAmenity(item);

    if (lower.includes("wi-fi") || lower.includes("wifi") || lower.includes("parking") || lower.includes("front desk")) {
      categories["Popular Amenities"].push({ name: item, icon });
    } else if (lower.includes("dining") || lower.includes("restaurant") || lower.includes("meal") || lower.includes("food")) {
      categories["Dining & Dining Experiences"].push({ name: item, icon });
    } else if (lower.includes("heater") || lower.includes("power") || lower.includes("hot water") || lower.includes("comfort")) {
      categories["Property & Comfort"].push({ name: item, icon });
    } else {
      categories["Services & Outdoor"].push({ name: item, icon });
    }
  });

  return Object.entries(categories)
    .filter(([, items]) => items.length > 0)
    .map(([title, items]) => ({ title, items }));
}

export function Amenities({ amenities }: AmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  const grouped = categorizeAmenities(amenities);

  return (
    <section id="amenities" className="scroll-mt-20 py-8 border-t border-border">
      <div className="pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Property Amenities
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Designed to ensure your stay is comfortable, secure, and hassle-free.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {grouped.map((group) => (
          <div
            key={group.title}
            className="rounded-lg border border-border bg-card p-5 shadow-xs"
          >
            <h3 className="text-sm font-semibold tracking-wide text-foreground uppercase text-xs mb-4">
              {group.title}
            </h3>
            <ul className="space-y-3">
              {group.items.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-foreground shrink-0">
                      <IconComponent className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-foreground">{item.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
