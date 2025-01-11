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

export type votedComment = { id: number; type: "upvote" | "downvote" | "none" };

const Comments = () => {
  const [votedComments, setVotedComments] = useState<votedComment[]>(
    JSON.parse(localStorage.getItem("votedComments") || "[]")
  );
  const [comments, setComments] = useState(commentsData.comments);

  useEffect(() => {
    const commentsFromLocalStorage = localStorage.getItem("comments");
    const votedCommentsFromLocalStorage = localStorage.getItem("votedComments");
    if (commentsFromLocalStorage) {
      setComments(JSON.parse(commentsFromLocalStorage));
    } else {
      localStorage.setItem("comments", JSON.stringify(commentsData.comments));
    }

    if (typeof votedCommentsFromLocalStorage === "string") {
      setVotedComments(JSON.parse(votedCommentsFromLocalStorage));
    } else {
      localStorage.setItem("votedComments", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("votedComments", JSON.stringify(votedComments));
  }, [votedComments]);

  const updateVote = (id: number, increment: number) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, score: comment.score + increment };
      }
      if (comment.replies) {
        comment.replies = comment.replies.map((reply) => {
          if (reply.id === id) {
            return { ...reply, score: reply.score + increment };
          }
          return reply;
        });
      }
      return comment;
    });

    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleVote = (id: number, type: "upvote" | "downvote") => {
    const votedComment = votedComments.find(
      (votedComment) => votedComment.id === id
    );
    let increment = 0;
    let newType: "none" | "upvote" | "downvote" = "none";

    if (!votedComment) {
      increment = type === "upvote" ? 1 : -1;
      newType = type;
      setVotedComments([...votedComments, { id, type: newType }]);
    } else if (votedComment.type === type) {
      increment = type === "upvote" ? -1 : 1;
      setVotedComments(
        votedComments.map((votedComment) =>
          votedComment.id === id ? { id, type: "none" } : votedComment
        )
      );
    } else if (votedComment.type === "none") {
      increment = type === "upvote" ? 1 : -1;
      newType = type;
      setVotedComments(
        votedComments.map((votedComment) =>
          votedComment.id === id ? { id, type: newType } : votedComment
        )
      );
    } else {
      increment = type === "upvote" ? 2 : -2;
      newType = type;
      setVotedComments(
        votedComments.map((votedComment) =>
          votedComment.id === id ? { id, type: newType } : votedComment
        )
      );
    }

    updateVote(id, increment);
  };

  const handleUpVote = (id: number) => handleVote(id, "upvote");
  const handleDownVote = (id: number) => handleVote(id, "downvote");

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
          voteState={
            votedComments.find((votedComment) => votedComment.id === comment.id)
              ?.type
          }
          votedComments={votedComments}
          comment={comment}
          isOwner={comment.user.username === commentsData.currentUser.username}
          currentUsername={commentsData.currentUser.username}
        />
      ))}
      {/* Add Comment */}
      <div className="add-comment p-4 bg-white rounded-md flex flex-wrap justify-between gap-4 ">
        {/* Profile Photo */}
        <img
          className="w-10 h-10"
          src={commentsData.currentUser.image.webp}
          alt={commentsData.currentUser.username}
        />
        {/* Comment Input */}
        <textarea
          placeholder="Add a comment..."
          className="w-full resize-none -order-1 flex-grow h-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        {/* Send Button */}
        <button className="bg-primary-moderateBlue text-white px-4 py-2 rounded-md">SEND</button>
      </div>
    </div>
  );
};

export default Comments;
