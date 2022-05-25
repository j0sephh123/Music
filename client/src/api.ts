import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000",
});

export const api = {
  music: {
    get() {
      return client.get("/");
    },
    post(fields: any) {
      return client.post("/", { ...fields });
    },
    downVote(youtubeId: string) {
      return client.put(`/downvote/${youtubeId}`);
    },
    upVote(youtubeId: string) {
      return client.put(`/upvote/${youtubeId}`);
    },
  },
};
