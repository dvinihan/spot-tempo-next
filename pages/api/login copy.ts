import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const login = async (req: NextApiRequest, res: NextApiResponse<{}>) => {
  const myRandomState = Math.random() * 23856;

  const { data } = await axios.get("https://accounts.spotify.com/authorize", {
    params: {
      client_id: process.env.CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.REDIRECT_URI,
      state: myRandomState,
      scope: [
        "playlist-read-private",
        "playlist-modify-private",
        "playlist-modify-public",
        "user-library-read",
      ].join(" "),
    },
  });

  console.log(data);
  res.redirect(data).send({});
};

export default login;
