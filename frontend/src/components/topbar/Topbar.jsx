import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Person, Chat, Notifications, Search } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import "./Topbar.css";

const Topbar = () => {
  const { user } = useContext(AuthContext);
  console.log("user", user);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" className="logo">
          <h3 className="topbarLogo">FoodSocial</h3>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="topbarSearch">
          <Search />
          <input />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <Link to="/" className="topbarLink">
            <span>Homepage</span>
          </Link>
          <Link to="/login" className="topbarLink">
            <span>Logout</span>
          </Link>
        </div>
        <div className="topbarIcon">
          <div className="topbarIconItem">
            <Person className="topbarIcons" />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Chat className="topbarIcons" />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Notifications className="topbarIcons" />
            <span className="topbarIconBadge">2</span>
          </div>
        </div>
        <Link className="userIdentify" to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "noAvatar.png"
            }
            alt=""
            className="topbarImg"
          ></img>
          <span>{user.username}</span>
        </Link>
      </div>
    </div>
  );
};
export default Topbar;
