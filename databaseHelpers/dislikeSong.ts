import { Db } from "mongodb";

export const dislikeSong = async (db: Db, userId: string, songUri: string) => {
  try {
    await db.collection("saved-songs").updateOne(
      { userId },
      { $set: { "songs.$[song].isDisliked": true } },
      {
        // multi: true,
        arrayFilters: [{ "song.uri": songUri }],
      }
    );
  } catch (error: any) {
    throw Error(`error disliking song in database: ${error.message}`);
  }
};
