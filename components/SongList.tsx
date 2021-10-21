import SongResult from "../components/SongResult";
import { Song } from "../types/Song";
import { ListType } from "../constants";
import { getAuthCookies } from "../util/cookies";
import { useQuery } from "react-query";
import { getSongList } from "../mutationFunctions/songs";

type Props = {
  listType: ListType;
};

const SongList = ({ listType }: Props) => {
  const { accessTokenCookie } = getAuthCookies();

  const songListQuery = useQuery(
    [`getSongList`],
    () => getSongList({ accessTokenCookie, listType }),
    { enabled: false }
  );

  if (!songListQuery.data) {
    return null;
  }

  return songListQuery.data.map((song: Song) => (
    <SongResult key={song.id} song={song} />
  ));
};

export default SongList;
