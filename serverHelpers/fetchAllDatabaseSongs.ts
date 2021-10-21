import { Db } from "mongodb";
import { Song } from "../types/Song";

export const fetchAllDatabaseSongs = async (
  db: Db,
  userId: string
): Promise<Song[]> => {
  const document = await db.collection("saved-songs").findOne({ userId });
  return document?.songs ?? [];
};
