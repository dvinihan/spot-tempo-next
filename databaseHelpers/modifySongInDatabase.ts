import { Db } from "mongodb";

type SongProperties = {
  [index: string]: any;
  isInPlaylist?: boolean;
  isDisliked?: boolean;
};

export const modifySongInDatabase = async (
  db: Db,
  userId: string,
  songUri: string,
  songProperties: SongProperties
) => {
  try {
    const data = Object.keys(songProperties).reduce(
      (acc, key) => ({
        ...acc,
        [`songs.$[song].${key}`]: songProperties[key],
      }),
      {} as Record<string, boolean>
    );

    await db.collection("saved-songs").updateOne(
      { userId },
      { $set: data },
      {
        arrayFilters: [{ "song.uri": songUri }],
      }
    );
  } catch (error: any) {
    throw Error(
      `error modifying song ${songUri} in database: ${error.message}`
    );
  }
};
