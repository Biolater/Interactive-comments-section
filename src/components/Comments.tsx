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
  const [comments, setComments] = useState<Comment[]>(commentsData.comments);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [replyingCommentId, setReplyingCommentId] = useState<number | null>(
    null
  );

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

  const handleAddComment = (comment: Comment) => {
    setComments((prevComments) => [...prevComments, comment]);
    localStorage.setItem("comments", JSON.stringify([...comments, comment]));
  };

  const handleAddCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const commentValue = e.currentTarget.comment.value;
    if (!commentValue.trim()) return;
    const newComment = {
      id: Date.now(),
      content: commentValue,
      createdAt: "1 minute ago",
      score: 0,
      user: commentsData.currentUser,
    };
    handleAddComment(newComment);
    e.currentTarget.reset();
  };

  const handleDeleteComment = (id: number) => {
    console.log("deleteRequestFor", id);
    setComments((prevComments) => {
      // Check if the comment to delete is a top-level comment
      const handleDeleteCommentRecursive = (comments: Comment[]): Comment[] => {
        return comments.filter((comment) => {
          if(comment.id === id) {
            return false;
          }
          if (comment.replies) {
            comment.replies = handleDeleteCommentRecursive(comment.replies);
          }
          return true;
        })
      }
      const updatedComments = handleDeleteCommentRecursive(prevComments);
      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedComments;
    });

    localStorage.setItem(
      "votedComments",
      JSON.stringify(
        votedComments.filter((votedComment) => votedComment.id !== id)
      )
    );
  };

  const handleUpdate = (id: number, content: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return { ...comment, content };
      }
      if (comment.replies) {
        comment.replies = comment.replies.map((reply) => {
          if (reply.id === id) {
            return { ...reply, content };
          }
          return reply;
        });
      }
      return comment;
    });

    setComments(updatedComments);
    setEditingCommentId(null);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleReplyClick = (id: number) => {
    setReplyingCommentId((prevId) => (prevId === id ? null : id));
  };

  const handleReply = (content: string) => {
    const newReply = {
      id: Date.now(),
      content,
      createdAt: "1 minute ago",
      score: 0,
      user: commentsData.currentUser,
      replyingTo: replyingCommentId
        ? comments.find((c) => c.id === replyingCommentId)?.user.username
        : undefined,
    };

    const updateReplies = (commentList: Comment[]): Comment[] => {
      return commentList.map((comment) => {
        if (comment.id === replyingCommentId) {
          // Add the reply to the correct comment
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }

        if (comment.replies) {
          // Recursively check and update nested replies
          return {
            ...comment,
            replies: updateReplies(comment.replies),
          };
        }

        return comment;
      });
    };

    const updatedComments = updateReplies(comments);
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    setReplyingCommentId(null);
  };

  const handleOnEdit = (id: number) => setEditingCommentId(id);

  const handleUpVote = (id: number) => handleVote(id, "upvote");
  const handleDownVote = (id: number) => handleVote(id, "downvote");

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem
          onDelete={handleDeleteComment}
          key={comment.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
          onUpdate={handleUpdate}
          voteState={
            votedComments.find((votedComment) => votedComment.id === comment.id)
              ?.type
          }
          onEdit={handleOnEdit}
          isBeingEdited={editingCommentId === comment.id}
          votedComments={votedComments}
          editingCommentId={editingCommentId}
          comment={comment}
          isOwner={comment.user.username === commentsData.currentUser.username}
          currentUsername={commentsData.currentUser.username}
          isBeingReplied={comment.id === replyingCommentId}
          onReplyClick={handleReplyClick}
          currentUserImage={commentsData.currentUser.image.webp}
          replyingTo={comment.replyingTo}
          onReply={handleReply}
          replyingCommentId={replyingCommentId || undefined}
        />
      ))}
      {/* Add Comment */}
      <div className="add-comment p-4 bg-white rounded-md">
        {/* Add a  comment form */}
        <form
          onSubmit={handleAddCommentSubmit}
          className="flex flex-wrap justify-between gap-4"
        >
          {/* Profile Photo */}
          <img
            className="w-9 h-9"
            src={commentsData.currentUser.image.webp}
            alt={commentsData.currentUser.username}
          />
          {/* Comment Input */}
          <textarea
            name="comment"
            placeholder="Add a comment..."
            className="w-full resize-none -order-1 flex-grow h-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          {/* Send Button */}
          <button className="bg-primary-moderateBlue text-white px-6 py-2 rounded-md">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comments;
