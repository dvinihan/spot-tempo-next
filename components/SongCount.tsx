import { CircularProgress, Typography } from "@mui/material";
import { ListType } from "../constants";
import { useSongCountQuery } from "../hooks/useSongCountQuery";

type Props = {
  listType: ListType;
};

const SongCount = ({ listType }: Props) => {
  const { isLoading, data } = useSongCountQuery(listType);

  if (isLoading || data?.count === undefined) {
    return <CircularProgress />;
  }

  return (
    <Typography align="center" sx={{ fontWeight: 500 }}>
      Total {listType.toLowerCase()} songs: {data?.count}
    </Typography>
  );
};

export default SongCount;
