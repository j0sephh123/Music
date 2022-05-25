import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./api";
import { useForm } from "react-hook-form";
import LoveIcon from "./icons/Love";
import ArrowIcon from "./icons/Arrow";

type Music = {
  title: string;
  youtubeId: string;
  score?: number;
};

function App() {
  const [music, setMusic] = useState<Music[]>([]);
  const {
    register,
    getValues,
    resetField,
    trigger,

    formState: { errors, isDirty },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    api.music.get().then(({ data }) => setMusic(data));
  }, []);

  const submit = async () => {
    const areFieldsValid = await trigger();
    if (!areFieldsValid) {
      return;
    }

    const musicValues = getValues() as Music;

    resetField("title");
    resetField("youtubeId");

    try {
      await api.music.post(musicValues);

      setMusic((prev) => [musicValues, ...prev]);
    } catch (e: any) {
      console.log(e.response.data);
    }
  };

  const isDisabled = () => {
    if (Object.keys(errors).length === 0) {
      if (!isDirty) {
        return true;
      }

      return false;
    }

    return true;
  };

  const validateYoutubeIdLength = (v: any) => v.length === 11;
  const validateTitleLength = (v: any) => v.length > 4;

  const onVote = ({ youtubeId, score }: any) => {
    setMusic((prev) =>
      prev.map((musicItem) => {
        if (musicItem.youtubeId === youtubeId) {
          musicItem.score = score;
        }
        return musicItem;
      })
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <label>Youtube ID</label>
        <input
          {...register("youtubeId", {
            validate: {
              matchYoutubeId: (v) =>
                validateYoutubeIdLength(v) ||
                "Youtube ID must be 11 characters",
            },
          })}
        />
        {errors.youtubeId && (
          <p className="error__validation">{errors.youtubeId.message}</p>
        )}
        <label>Title</label>
        <input
          {...register("title", {
            validate: {
              matchTitle: (v) =>
                validateTitleLength(v) || "Title must be at least 5 characters",
            },
          })}
        />
        {errors.title && (
          <p className="error__validation">{errors.title.message}</p>
        )}
        <button disabled={isDisabled()} onClick={submit}>
          Submit
        </button>
        <div className="music__wrapper">
          {music.map(({ youtubeId, title, score = 0 }) => (
            <div className="music__item" key={youtubeId}>
              <a target="_blank" href={`https://youtu.be/${youtubeId}`}>
                {title}
              </a>
              <ArrowIcon
                onClick={() =>
                  api.music
                    .downVote(youtubeId)
                    .then(({ data: { score } }) => onVote({ youtubeId, score }))
                }
                isDown
                className="music__item--arrowDown"
              />
              <span className="music__item--upvotes">{score}</span>
              <ArrowIcon
                onClick={() =>
                  api.music
                    .upVote(youtubeId)
                    .then(({ data: { score } }) => onVote({ youtubeId, score }))
                }
                className="music__item--arrowUp"
              />
              <LoveIcon />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
