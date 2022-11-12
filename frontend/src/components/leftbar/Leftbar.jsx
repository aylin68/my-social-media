import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CommentIcon from "@mui/icons-material/Comment";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import "./leftbar.css";
import axios from "axios";

function Leftbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users/all");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  const listItem = [
    {
      icon: <RssFeedIcon />,
      title: "Feed",
    },
    {
      icon: <CommentIcon />,
      title: "Chat",
    },
    {
      icon: <PlayCircleIcon />,
      title: "Videos",
    },
    {
      icon: <EventIcon />,
      title: "Events",
    },
    {
      icon: <SchoolIcon />,
      title: "Course",
    },
    {
      icon: <WorkIcon />,
      title: "Jobs",
    },
  ];
  return (
    <div className="leftbarList">
      <div className="leftbarTop">
        {listItem.map((item, index) => (
          <div className="leftbarItems" key={index}>
            <span className="leftbarIcons">{item.icon}</span>
            <span className="leftbarTitle">{item.title}</span>
          </div>
        ))}
      </div>
      <div className="leftbarBottom">
        <h5>Recommend users</h5>
        <ul className="leftbarUser">
          {users.map((user) => (
            <li key={user._id}>
              <Link className="leftbarTitle" to={`/profile/${user.username}`}>
                <img
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "noAvatar.png"
                  }
                  alt=""
                  className="leftbarUserImg"
                ></img>
                <span className="leftbarUserFullname">{user.username}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Leftbar;
