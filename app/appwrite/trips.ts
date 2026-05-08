import { Query } from "appwrite";
import { appwriteConfig, database } from "./client";

// ← removed allTrips import from constants, it was causing the bug

export const getAllTrips = async (limit: number, offset: number) => {
  const { documents, total } = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    [Query.limit(limit), Query.offset(offset), Query.orderDesc("createdAt")],
  );

  if (total === 0) {
    console.log("no trips found");
    return { allTrips: [], total: 0 };
  }

  return {
    allTrips: documents,
    total,
  };
};

export const getTripById = async (tripId: string) => {
  const trip = await database.getDocument(
    appwriteConfig.databaseId,
    appwriteConfig.tripCollectionId,
    tripId,
  );

  if (!trip.$id) {
    console.log("trip not found");
    return null;
  }

  return trip;
};
