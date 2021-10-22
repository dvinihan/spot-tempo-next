import { Db } from "mongodb";
import { Song } from "../types/Song";

export const insertUserAndSongs = async (
  db: Db,
  userId: string,
  songs: Song[] = []
) => {
  try {
    await db.collection("saved-songs").insertOne({
      songs,
      userId,
    });
  } catch (error: any) {
    throw Error(`error inserting user & songs into database: ${error.message}`);
  }
};
