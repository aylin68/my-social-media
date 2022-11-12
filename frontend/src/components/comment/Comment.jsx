import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button, TextField, FormControl } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../../context/AuthContext";
import "./comment.css";

const Comment = ({ postId, fetchPost }) => {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, resetField } = useForm();
  const onSubmit = async (data) => {
    const commeuntItem = {
      comment: data.comment,
      profilePicture: user.profilePicture,
      username: user.username,
    };
    if (data) {
      try {
        await axios.put("/posts/comment/" + postId, commeuntItem);
        resetField("comment");
        fetchPost();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formComment">
      <div className="containerComment">
        <FormControl fullWidth sx={{ m: 1 }}>
          <TextField
            className="commentText"
            type="textarea"
            {...register("comment")}
            placeholder="Add your comment"
            id="outlined-size-small"
            label="comment"
            variant="outlined"
            size="small"
          />
        </FormControl>
        <Button
          size="small"
          className="addCommend"
          variant="contained"
          type="submit"
        >
          Add
          <AddIcon />
        </Button>
      </div>
    </form>
  );
};

export default Comment;
