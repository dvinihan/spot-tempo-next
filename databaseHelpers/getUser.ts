import { Db } from "mongodb";

export const getDoesUserExist = async (db: Db, userId: string) => {
  try {
    const userDocCount = await db
      .collection("saved-songs")
      .find({ userId })
      .count();
    return userDocCount > 0;
  } catch (error: any) {
    throw Error(`error looking for user in database: ${error.message}`);
  }
};
