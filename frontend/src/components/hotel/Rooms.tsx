import Image from "next/image";
import { Bed, Users, Maximize, Sparkles } from "lucide-react";
import { Room } from "@/lib/types";

interface RoomsProps {
  rooms: Room[];
  currency?: string;
}

export function Rooms({ rooms, currency = "INR" }: RoomsProps) {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <section id="rooms" className="scroll-mt-20 py-8">
      <div className="border-b border-border pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Rooms &amp; Suites
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore accommodation choices tailored for comfort, rest, and serene stays.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map((room) => {
          const roomImage =
            room.images && room.images.length > 0
              ? room.images[0]
              : "/hotels/sample-hotel/room-deluxe.svg";

          return (
            <article
              key={room.id}
              className="rounded-lg border border-border bg-card overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-52 sm:h-56 w-full bg-muted overflow-hidden">
                  <Image
                    src={roomImage}
                    alt={`${room.name} view`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {room.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {room.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-muted-foreground border-y border-border py-3">
                    <div className="flex items-center gap-1.5">
                      <Bed className="h-4 w-4 text-foreground shrink-0" />
                      <span>{room.bed}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-foreground shrink-0" />
                      <span>Up to {room.maxGuests} guests</span>
                    </div>
                    {room.sizeSqFt !== null && (
                      <div className="flex items-center gap-1.5">
                        <Maximize className="h-4 w-4 text-foreground shrink-0" />
                        <span>{room.sizeSqFt} sq ft</span>
                      </div>
                    )}
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs uppercase font-medium tracking-wider text-muted-foreground mb-2">
                        Room Features
                      </h4>
                      <ul className="flex flex-wrap gap-1.5">
                        {room.amenities.map((amenity, idx) => (
                          <li
                            key={idx}
                            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                          >
                            <Sparkles className="h-3 w-3 text-muted-foreground" />
                            <span>{amenity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 mt-4">
                <div className="pt-4 border-t border-border flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Rate</span>
                  <span className="text-base font-semibold text-foreground">
                    {room.pricePerNight !== null ? (
                      <>
                        {currency} {room.pricePerNight}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          / night
                        </span>
                      </>
                    ) : (
                      "Contact for price"
                    )}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
