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
  // const [votedComments, setVotedComments] = useState<
  //   Set<{ id: number; type: "upvote" | "downvote" }>
  // >(new Set()); // Store voted comment IDs
  const [comments, setComments] = useState(commentsData.comments);

  useEffect(() => {
    const commentsFromLocalStorage = localStorage.getItem("comments");
    const votedCommentsFromLocalStorage = localStorage.getItem("votedComments");

    if (commentsFromLocalStorage && votedCommentsFromLocalStorage) {
      setComments(JSON.parse(commentsFromLocalStorage));
      // setVotedComments(JSON.parse(votedCommentsFromLocalStorage));
    } else {
      localStorage.setItem("comments", JSON.stringify(commentsData.comments));
      localStorage.setItem("votedComments", "")
    }
  }, []);

  const updateVote = (id: number, increment: number) => {
    // const votedComment = Array.from(votedComments).find(
    //   (vote) => vote.id === id
    // );

    // if (votedComment && votedComment.type === "upvote") {
    // } else {
    // }

    // Loop through all comments and find the one with the matching id
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        // If the comment is found, update the score
        return { ...comment, score: comment.score + increment };
      }

      // If this comment has replies, check those
      if (comment.replies) {
        comment.replies = comment.replies.map((reply) => {
          if (reply.id === id) {
            // If the reply is found, update the score
            return { ...reply, score: reply.score + increment };
          }
          return reply;
        });
      }

      // votedComments.add(id);

      return comment;
    });

    // Update the state and save the new comments to localStorage
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleUpVote = (id: number) => updateVote(id, 1); // +1 to score
  const handleDownVote = (id: number) => updateVote(id, -1); // -1 to score
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
          comment={comment}
          isOwner={comment.user.username === commentsData.currentUser.username}
          currentUsername={commentsData.currentUser.username}
        />
      ))}
    </div>
  );
};

export default Comments;
