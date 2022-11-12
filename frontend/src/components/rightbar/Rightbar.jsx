import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./rightbar.css";

function Rightbar() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user } = useContext(AuthContext);

  const [friends, setFriends] = useState([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/friends/" + user._id);

        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [user._id]);

  return (
    <div>
      <div>
        <img src={PF + "ad.png"} alt="" className="baner"></img>
      </div>
      <div>
        <h5>Your friend</h5>
        <ul className="listFriends">
          {friends.map((friend) =>
            friend.map((friendItem) => (
              <li key={friendItem._id}>
                <Link
                  className="rightbarTitle"
                  to={`/profile/${friendItem.username}`}
                >
                  <img
                    src={
                      friendItem.profilePicture
                        ? PF + friendItem.profilePicture
                        : PF + "noAvatar.png"
                    }
                    alt=""
                    className="friendImg"
                  ></img>
                  <span className="frienFullname">{friendItem.username}</span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Rightbar;
