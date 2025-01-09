import { useEffect, useState } from "react";
import commentsData from "../data.json";
import CommentItem from "./CommentItem";

export type Comment = (typeof commentsData.comments)[0];

const Comments = () => {
  const [comments, setComments] = useState(commentsData.comments);
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};

export default Comments;
