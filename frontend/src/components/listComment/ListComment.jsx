import React from "react";
import { Link } from "react-router-dom";

const ListComment = ({ comments }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="commentContainer">
      <ul className="leftbarUser">
        {comments.map((comment) => (
          <li key={comment._id}>
            <Link className="leftbarTitle" to={`profile/${comment.username}`}>
              <img
                src={
                  comment.profilePicture
                    ? PF + comment.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
                className="leftbarUserImg"
              ></img>
              <span className="leftbarUserFullname">{comment.comment}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ListComment;
