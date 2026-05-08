import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, parseTripData, getFirstWord } from "~/lib/utils"; // ← added getFirstWord
import { Header, TripCard } from "components";
import InfoPill from "components/InfoPill";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) throw new Error("trip id is required");

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: trips.allTrips.map(({ $id, tripDetail, imageUrls }: any) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls:
        typeof imageUrls === "string"
          ? JSON.parse(imageUrls) // ← parse if stored as string
          : (imageUrls ?? []),
    })),
  };
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
  const rawImageUrls = loaderData?.trip?.imageUrls;
  const imageUrls =
    typeof rawImageUrls === "string"
      ? JSON.parse(rawImageUrls)
      : (rawImageUrls ?? []);

  const tripData = parseTripData(loaderData?.trip?.tripDetail);

  const {
    name,
    duration,
    travelStyle,
    interests,
    itinerary,
    budget,
    description,
    bestTimeToVisit,
    country,
    estimatedPrice,
    groupType,
    weatherInfo,
  } = tripData || {};
  if (!tripData) {
    return (
      <main className="wrapper">
        <p className="text-red-500">Trip data could not be loaded.</p>
      </main>
    );
  }

  console.log("raw tripDetail:", loaderData?.trip?.tripDetail);
  console.log("parsed tripData:", tripData);
  const allTrips = (loaderData.allTrips ?? []) as Trip[];

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-700" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time To Visit", items: bestTimeToVisit },
    { title: "Weather", items: weatherInfo },
  ];

  return (
    <main className="travel-detail wrapper">
      <section className="container wrapper-md">
        {/* Fix: use Header component correctly */}
        <Header
          title="Trip Details"
          description="View and edit AI generated plans"
        />

        <header className="flex flex-col gap-6">
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} days`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 5)
                  .map((item: DayPlan) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>

        <section className="gallery">
          {(imageUrls ?? []).map((url: string, i: number) => (
            <img
              src={url}
              key={i}
              className={cn(
                "w-full rounded-xl object-cover",
                i === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]",
              )}
              alt="trip"
            />
          ))}
        </section>

        <section className="flex gap-3 md:gap-5 items-center">
          {/* @ts-ignore */}
          <ChipListComponent>
            {/* @ts-ignore */}
            <ChipsDirective>
              {pillItems.map((pill, i) => (
                // @ts-ignore
                <ChipDirective
                  key={i}
                  text={getFirstWord(pill.text ?? "")}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex gap-1 items-center">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg" // ← fixed dot to slash
                    alt="star"
                    className="size-[18px]"
                  />
                </li>
              ))}
            <li className="ml-1">
              {/* @ts-ignore */}
              <ChipListComponent>
                {/* @ts-ignore */}
                <ChipsDirective>
                  {/* @ts-ignore */}
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>

        <section className="title">
          <article>
            <h3>
              {duration}-day {country} {travelStyle} trip
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>
          <h2>{estimatedPrice}</h2>
        </section>

        <p className="text-sm md:text-lg font-normal text-dark-400">
          {description}
        </p>

        <ul className="itinerary">
          {(itinerary ?? []).map((dayPlan: any, index: number) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {/* Handle both "activity" string and "activities" array */}
                {Array.isArray(dayPlan.activities) ? (
                  dayPlan.activities.map((activity: any, i: number) => (
                    <li key={i}>
                      <span className="flex-shrink-0">{activity.time}</span>
                      <p className="flex-grow">{activity.description}</p>
                    </li>
                  ))
                ) : (
                  <li>
                    <p className="flex-grow">{dayPlan.activity}</p>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>

        {visitTimeAndWeatherInfo.map((section) => (
          <section key={section.title} className="visit">
            <div>
              <h3>{section.title}</h3>
              <ul>
                {(section.items ?? []).map((item: string) => (
                  <li key={item}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        <div className="trip-grid">
          {(allTrips ?? []).map(
            ({ id, name, imageUrls, itinerary, estimatedPrice }: any) => (
              <TripCard
                id={id}
                key={id}
                name={name}
                location={itinerary?.[0]?.location ?? ""}
                imageUrl={imageUrls?.[0]}
                tags={[]}
                price={estimatedPrice}
              />
            ),
          )}
        </div>
      </section>
    </main>
  );
};

export default TripDetail;
