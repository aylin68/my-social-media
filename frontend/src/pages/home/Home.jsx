import React from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Topbar from "../../components/topbar/Topbar";
import "./Home.css";

const Home = () => {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <div className="leftbar">
          <Leftbar />
        </div>
        <div className="feed">
          <Feed />
        </div>
        <div className="rightbar">
          <Rightbar />
        </div>
      </div>
    </>
  );
};
export default Home;
