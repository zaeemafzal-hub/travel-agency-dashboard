import { Header, TripCard } from "components";
import { parseTripData } from "~/lib/utils";
import type { Route } from "./+types/trips";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getAllTrips } from "~/appwrite/trips";
import { useState } from "react";
import { PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8; // ← was 0, should be a real number
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10); // ← radix:10 → 10

  const offset = (page - 1) * limit;
  const { allTrips, total } = await getAllTrips(limit, offset);

  return {
    allTrips: allTrips.map(({ $id, tripDetail, imageUrls }: any) => ({
      id: $id,
      ...parseTripData(tripDetail),
      imageUrls:
        typeof imageUrls === "string"
          ? JSON.parse(imageUrls)
          : (imageUrls ?? []),
    })),
    total,
  };
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
  const trips = (loaderData.allTrips ?? []) as Trip[]; // ← was loaderData.trips, should be loaderData.allTrips
  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className="dashboard wrapper">
      <Header
        title="Trips"
        description="View and edit AI-Generated travel plans"
        ctaText="Create a Trip"
        ctaUrl="/trips/create"
      />
      <section className="flex flex-col gap-5 mt-2.5">
        <h1 className="p-24-semibold text-dark-100">Manage Created Trips</h1>
        <div className="trip-grid">
          {trips.map(
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

        <PagerComponent
          totalRecordsCount={loaderData.total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  );
};

export default Trips;
