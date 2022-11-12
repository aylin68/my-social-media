import React, { useContext, useEffect, useState } from "react";
import Share from "../share/Share";
import Post from "../post/Post";
import axios from "axios";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";

function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPost();
  }, [username, user._id]);
  const fetchPost = async () => {
    const res = username
      ? await axios.get("/posts/profile/" + username)
      : await axios.get("/posts/timeline/" + user._id);
    setPosts(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      })
    );
  };

  return (
    <div className="container">
      {user.username === username || !username ? (
        <Share fetchPost={fetchPost} />
      ) : null}

      {posts.map((post) => (
        <Post key={post._id} post={post} fetchPost={fetchPost} />
      ))}
    </div>
  );
}

export default Feed;
