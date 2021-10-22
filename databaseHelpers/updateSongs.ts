import { Db } from "mongodb";
import { Song } from "../types/Song";

export const updateSongs = async (
  db: Db,
  userId: string,
  songs: Song[] = []
) => {
  try {
    await db.collection("saved-songs").updateOne(
      { userId },
      {
        $set: {
          songs,
        },
      }
    );
  } catch (error: any) {
    throw Error(`error updating songs in database: ${error.message}`);
  }
};
