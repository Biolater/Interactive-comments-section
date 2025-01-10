import { useEffect, useState } from "react";
import commentsData from "../data.json";
import CommentItem from "./CommentItem";

export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  replies?: Comment[];
};

const Comments = () => {
  const [comments, setComments] = useState(commentsData.comments);

  useEffect(() => {
    setComments(commentsData.comments);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isOwner={comment.user.username === commentsData.currentUser.username}
          currentUsername={commentsData.currentUser.username}
        />
      ))}
    </div>
  );
};

export default Comments;
