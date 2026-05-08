import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import {
  animate,
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { Header } from "components";
import type { Route } from "./+types/all-users";
import { comboBoxItems, interests, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import React, { useState } from "react";

import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const loader = async () => {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,latlng,maps",
  );

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error("Unexpected API response:", data);
    return [];
  }
  return data.map((country: any) => ({
    name: country.name.common,
    flag: country.flags?.png,
    coordinates: country.latlng,
    openstreetMap: country.maps?.openstreetMap,
    value: country.name.common,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = (loaderData as Country[]) ?? [];
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.duration ||
      !formData.groupType ||
      !formData.interest ||
      !formData.budget
    ) {
      setError("Please provide values for all the Trips");
      setLoading(false);
      return;
    }
    if (formData.duration < 1 || formData.duration > 10) {
      setError("Duration must be between 1 and 10");
      setLoading(false);
      return;
    }
    const user = await account.get();
    if (!user.$id) {
      console.log("user not authenticated");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/create-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });

      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else console.log("failed to log user");
    } catch (e) {
      console.log("error generating trip", e);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = async (
    key: keyof TripFormData,
    value: string | number,
  ) => {
    setFormData({ ...formData, [key]: value });
  };
  const countryData = countries.map((country: any) => ({
    name: country.name,
    value: country.value,
    flag: country.flag,
  }));
  const mapData = [
    {
      country: formData.country,
      color: "#Ea382E",
      coordinates:
        countries.find((c: Country) => c.name === formData.country)
          ?.coordinates || [],
    },
  ];
  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Create a Trip Of your Like"
        description="We give you experience like you never get"
      />

      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" action="" onSubmit={handleSubmit}>
          <div className="">
            <label htmlFor="country">country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "name", value: "value" }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              itemTemplate={(props: any) => (
                <div className="flex items-center gap-2">
                  <img
                    src={props.flag}
                    alt={props.name}
                    className="ml-1.5 w-4 h-4 object-cover rounded-full"
                  />
                  <span>{props.name}</span>
                </div>
              )}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              placeholder="Enter a number of days "
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                className="combo-box"
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key as keyof TripFormData, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      })),
                  );
                }}
              />
            </div>
          ))}

          <div>
            <label htmlFor="maps">selectyour country from the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  shapeData={world_map}
                  dataSource={mapData}
                  shapePropertyPath="name"
                  shapeDataPath="country"
                  shapeSettings={{ colorValuePath: "color", fill: "#e5e5e5" }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 h-px w-full"></div>
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class !h-12 !w-full"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                alt=""
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white ">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};

export default CreateTrip;
