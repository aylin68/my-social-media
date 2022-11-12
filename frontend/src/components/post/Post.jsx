import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Comment from "../comment/Comment";
import axios from "axios";
import { format } from "timeago.js";
import { AuthContext } from "../../context/AuthContext";
import ListComment from "../listComment/ListComment";
import {
  IconButton,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import "./post.css";

const Post = ({ post, fetchPost }) => {
  const { user: currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const [user, setUser] = useState({});
  const [like, setLike] = useState(post.likes.length);
  const [isLike, setIsLike] = useState(false);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    setIsLike(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  //console.log(user);
  const likeHandel = async () => {
    try {
      await axios.put("/posts/" + post._id + "/like", {
        userId: currentUser._id,
      });
    } catch (err) {
      console.log(err);
    }
    setIsLike(!isLike);
    setLike(!isLike ? like + 1 : like - 1);
  };
  const handleDelete = async () => {
    try {
      await axios.delete("/posts/" + post._id, {
        data: { userId: currentUser._id },
      });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
    setOpen(false);
  };
  const handelShowComment = () => {
    setShowComment(!showComment);
  };

  return (
    <div className="postContainer">
      <div className="postTop">
        <div className="postTitle">
          <Link className="postTitle" to={`/profile/${user.username}`}>
            {user.profilePicture ? (
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
                className="postOwnerImg"
              ></img>
            ) : (
              <AccountCircleIcon className="postOwnerImg" />
            )}
            <span className="postOwner">{user.username}</span>
          </Link>
          <span className="postTimeCreate">{format(post.createdAt)}</span>
        </div>
        <span>
          <Stack direction="row" spacing={2}>
            <div>
              <IconButton
                ref={anchorRef}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
              >
                <MoreVertIcon />
              </IconButton>
              <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                style={{ zIndex: 999 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom-start"
                          ? "left top"
                          : "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                          autoFocusItem={open}
                          id="composition-menu"
                          aria-labelledby="composition-button"
                          onKeyDown={handleListKeyDown}
                        >
                          <MenuItem onClick={handleClose}>
                            <EditIcon />
                            Edit
                          </MenuItem>
                          <MenuItem onClick={handleDelete}>
                            <DeleteIcon />
                            Delete
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <LocalOfferIcon />
                            Tag
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </Stack>
        </span>
      </div>

      <div className="postImg">
        <img src={PF + post.img} alt=""></img>
      </div>
      <div className="postText">{post.desc}</div>
      <div className="postReaction">
        <span className="postLike" onClick={likeHandel}>
          <FavoriteIcon className="postLikeIcon" />
          {like} People like it
        </span>
        <span className="postComment" onClick={handelShowComment}>
          {post.comments.length} Comment
        </span>
      </div>
      {showComment ? (
        <>
          <Comment postId={post._id} fetchPost={fetchPost} />
          <ListComment comments={post.comments} />
        </>
      ) : null}
    </div>
  );
};

export default Post;
