import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import Feed from "../../components/feed/Feed";
import { Button } from "@mui/material";
//import BasicModal from "../../components/Modal";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./profile.css";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [user, setUser] = useState({});
  const [relationship, setRelationship] = useState(false);
  const username = useParams().username;
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    setRelationship(currentUser.followings.includes(user._id));
  }, [currentUser.followings, user._id]);

  useEffect(() => {
    fetchUser();
  }, [username]);
  const fetchUser = async () => {
    const res = await axios.get(`/users?username=${username}`);
    setUser(res.data);
  };
  const handelFollow = async () => {
    try {
      axios.put("/users/" + user._id + "/follow", { userId: currentUser._id });
      setRelationship(!relationship);
    } catch (err) {
      console.log(err);
    }
  };
  const handelUnfollow = async () => {
    try {
      axios.put("/users/" + user._id + "/unfollow", {
        userId: currentUser._id,
      });
      setRelationship(!relationship);
    } catch (err) {
      console.log(err);
    }
  };
  const [fileAvatarImg, setFileAvatarImg] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const showPicture = (e) => {
    if (e.target.files[0]) {
      setFileAvatarImg(e.target.files);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const onSubmit = async (data) => {
    const formDataPictur = new FormData();
    const fileName = Date.now() + fileAvatarImg[0].name;
    formDataPictur.append("name", fileName);
    formDataPictur.append("file", fileAvatarImg[0]);
    const userData = {
      userId: currentUser._id,
      profilePicture: fileName,
    };

    // console.log("formData", formData);

    try {
      await axios.post("/upload", formDataPictur);
      await axios.put("/users/" + user._id, userData);

      setOpen(false);
      fetchUser();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Topbar />
      <div className="profileContainer">
        <div className="leftbar">
          <Leftbar />
        </div>
        <div className="profileRightside">
          <div className="profileImgContainer">
            <div className="coverImg">
              <img
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "noCover.png"
                }
                alt=""
              ></img>
              {currentUser.username === username ? (
                <div className="thumbnailCoverImg">
                  <span>Edit cover picture</span>
                </div>
              ) : null}
            </div>

            <div className="avatarImg">
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
              ></img>
              {currentUser.username === username ? (
                <div className="thumbnailAvatarImg" onClick={handleOpen}>
                  <span>Edit picture</span>
                </div>
              ) : null}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <label htmlFor="fileavatar" className="changeAvatorItem">
                        <PhotoLibraryIcon />
                        Change Photo
                        <input
                          style={{ display: "none" }}
                          type="file"
                          id="fileavatar"
                          name="fileavatar"
                          {...register("fileavatar")}
                          accept=".png, .jpeg, .jpg"
                          onChange={showPicture}
                        />
                      </label>
                      <div className="shareImgContainer">
                        <img src={imgData} alt="" />
                      </div>
                      {imgData ? (
                        <button className="changeButton" type="submit">
                          Change
                        </button>
                      ) : null}
                    </form>
                  </div>
                </Box>
              </Modal>
            </div>
            <div className="fullname">{user.username}</div>
          </div>
          <div className="profileRightsideContainer">
            <div className="feedBox">
              <Feed username={user.username} />
            </div>
            <div className="userInformation">
              {currentUser.username === username ? null : (
                <div className="buttonConainer">
                  {relationship ? (
                    <Button
                      className="unfollowBtn"
                      variant="contained"
                      type="button"
                      onClick={handelUnfollow}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      className="followBtn"
                      variant="contained"
                      type="button"
                      onClick={handelFollow}
                    >
                      Follow
                    </Button>
                  )}
                </div>
              )}

              <span className="userInformationTitle">User Information</span>
              <ul>
                <li className="userInformationList">
                  City: <span>{user.city}</span>
                </li>
                <li className="userInformationList">
                  Form: <span>{user.from}</span>
                </li>
                <li className="userInformationList">
                  Relationship:
                  <span>{user.relationship ? "In relation" : "Single"}</span>
                </li>
              </ul>
              <div className="userInformationFriends">
                <span className="userInformationTitle">User Friends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
