import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import LabelIcon from "@mui/icons-material/Label";
import PlaceIcon from "@mui/icons-material/Place";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import "./share.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

const Share = ({ fetchPost }) => {
  const { user } = useContext(AuthContext);
  const [fileImg, setFileImg] = useState(null);
  const [imgData, setImgData] = useState(null);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const newData = {
      userId: user._id,
      desc: data.desc,
    };
    const formData = new FormData();
    if (fileImg) {
      const fileName = Date.now() + fileImg[0].name;
      formData.append("name", fileName);
      formData.append("file", fileImg[0]);
      newData.img = fileName;
      try {
        await axios.post("/upload", formData);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      axios.post("/posts", newData);
      setImgData(null);
      fetchPost();

      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const showPicture = (e) => {
    if (e.target.files[0]) {
      setFileImg(e.target.files);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="feedContainer">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="feedHeader">
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "noAvatar.png"
            }
            alt=""
            className="feedImg"
          ></img>
          <input
            className="feadText"
            type="textarea"
            {...register("desc")}
            placeholder="What food do you want to share?"
          />
        </div>

        <div className="shareImgContainer">
          <img src={imgData} alt="" />
        </div>

        <div className="feedFooter">
          <div className="feedItems">
            <label htmlFor="file" className="feedItem">
              <PhotoLibraryIcon className="feedPhotoIcon" />
              Photo or video
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name="file"
                {...register("file")}
                accept=".png, .jpeg, .jpg"
                onChange={showPicture}
              />
            </label>
            <span className="feedItem">
              <LabelIcon className="feedTagIcon" />
              Tag
            </span>
            <span className="feedItem">
              <PlaceIcon className="feedLocationIcon" />
              Location
            </span>
            <span className="feedItem">
              <EmojiEmotionsIcon className="feedFeelingIcon" />
              Feeling
            </span>
          </div>
          <button className="shareButton">Share</button>
        </div>
      </form>
    </div>
  );
};

export default Share;
