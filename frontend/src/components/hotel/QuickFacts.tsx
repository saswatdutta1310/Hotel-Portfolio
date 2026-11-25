import { Hotel } from "@/lib/types";
import { Clock, IndianRupee, MapPin, BedDouble } from "lucide-react";

interface QuickFactsProps {
  hotel: Hotel;
}

export function QuickFacts({ hotel }: QuickFactsProps) {
  const formattedAddress = `${hotel.address.street}, ${hotel.address.area}, ${hotel.address.city}, ${hotel.address.state} ${hotel.address.pincode}, ${hotel.address.country}`;
  const roomCount = hotel.rooms.length;

  return (
    <section
      aria-label="Hotel quick facts"
      className="rounded-lg border border-border bg-card p-6 shadow-xs"
    >
      <h2 className="text-lg font-semibold tracking-tight text-foreground mb-4">
        Quick Facts
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Location
            </dt>
            <dd className="text-sm text-foreground mt-0.5 break-words">
              {formattedAddress}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Check-in / Check-out
            </dt>
            <dd className="text-sm text-foreground mt-0.5">
              In: {hotel.checkIn}
              <br />
              Out: {hotel.checkOut}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IndianRupee className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Starting Price
            </dt>
            <dd className="text-sm text-foreground mt-0.5">
              {hotel.startingPrice.amount !== null ? (
                <>
                  <span className="font-semibold">
                    {hotel.startingPrice.currency} {hotel.startingPrice.amount}
                  </span>
                  {hotel.startingPrice.note && (
                    <span className="text-xs text-muted-foreground block">
                      {hotel.startingPrice.note}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground">Price on request</span>
              )}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BedDouble className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <dt className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Accommodations
            </dt>
            <dd className="text-sm text-foreground mt-0.5">
              {roomCount} {roomCount === 1 ? "room type" : "room types"}
            </dd>
          </div>
        </div>
      </dl>
    </section>
  );
}
