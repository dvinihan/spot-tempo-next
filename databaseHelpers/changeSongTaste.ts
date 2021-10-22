import { Db } from "mongodb";

export const changeSongTaste = async (
  db: Db,
  userId: string,
  songUri: string,
  shouldBeDisliked: boolean
) => {
  try {
    await db.collection("saved-songs").updateOne(
      { userId },
      { $set: { "songs.$[song].isDisliked": shouldBeDisliked } },
      {
        // multi: true,
        arrayFilters: [{ "song.uri": songUri }],
      }
    );
  } catch (error: any) {
    throw Error(
      `error setting song in database to isDisliked=${shouldBeDisliked}: ${error.message}`
    );
  }
};
