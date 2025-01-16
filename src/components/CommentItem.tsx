import { votedComment, type Comment } from "./Comments";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import ReplyIcon from "./icons/ReplyIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";

const CommentItem: React.FC<{
  comment: Comment;
  isOwner?: boolean;
  currentUsername?: string;
  voteState: "upvote" | "downvote" | "none" | undefined;
  votedComments: votedComment[];
  onUpVote: (id: number) => void;
  onDownVote: (id: number) => void;
  replyingTo?: string | undefined;
  isBeingEdited?: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  editingCommentId?: number | null;
  onUpdate: (id: number, content: string) => void;
  isBeingReplied?: boolean;
  onReplyClick: (id: number) => void;
  currentUserImage?: string;
  replyingCommentId?: number;
  onReply: (content: string) => void;
}> = ({
  comment,
  isOwner,
  currentUsername,
  onUpVote,
  onDownVote,
  voteState = "none",
  votedComments,
  replyingTo,
  onDelete,
  isBeingEdited,
  editingCommentId,
  onEdit,
  onUpdate,
  isBeingReplied,
  onReplyClick,
  currentUserImage,
  replyingCommentId,
  onReply,
}) => {
  const [localCommentValue, setLocalCommentValue] = useState(comment.content);

  useEffect(() => {
    if (isBeingEdited) setLocalCommentValue(comment.content);
  }, [isBeingEdited, comment.content]);

  return (
    <div className="flex flex-col gap-4">
      <div className="comment-item bg-neutral-white p-4 rounded flex flex-col gap-3">
        {/* Comment Header */}
        <header className="flex items-center gap-4">
          <img
            src={comment.user.image.webp}
            alt={comment.user.username}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{comment.user.username}</span>
          {isOwner && (
            <span className="text-white px-2 rounded text-sm bg-primary-moderateBlue">
              you
            </span>
          )}
          <span className="text-neutral-grayishBlue">{comment.createdAt}</span>
        </header>
        {/* Comment Body */}
        {isBeingEdited ? (
          <textarea
            value={localCommentValue}
            onChange={(e) => setLocalCommentValue(e.target.value)}
            className="comment-body bg-neutral-veryLightGray p-3 pb-6 rounded-md border border-primary-moderateBlue resize-none outline-none"
          />
        ) : (
          <p className="text-neutral-grayishBlue">
            {replyingTo ? (
              <>
                <span className="text-primary-moderateBlue font-semibold">
                  @{replyingTo}
                </span>{" "}
                {comment.content}
              </>
            ) : (
              comment.content
            )}
          </p>
        )}
        {/* Comment Footer */}
        <footer>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 p-2 rounded-lg bg-neutral-veryLightGray">
              <button
                onClick={() => onUpVote(comment.id)}
                className={`cursor-pointer transition-colors ${
                  voteState === "upvote" && "text-primary-moderateBlue"
                } p-1 text-primary-lightGrayishBlue hover:text-primary-moderateBlue`}
              >
                <PlusIcon />
              </button>
              <span className="text-primary-moderateBlue font-medium">
                {comment.score}
              </span>
              <button
                onClick={() => onDownVote(comment.id)}
                className={`cursor-pointer transition-colors ${
                  voteState === "downvote" && "text-primary-moderateBlue"
                } p-1 text-primary-lightGrayishBlue hover:text-primary-moderateBlue`}
              >
                <MinusIcon />
              </button>
            </div>
            {!isOwner ? (
              // Reply
              <div
                onClick={() => onReplyClick(comment.id)}
                className="flex cursor-pointer transition-colors text-primary-moderateBlue items-center gap-2 hover:text-primary-lightGrayishBlue"
              >
                <ReplyIcon />
                <span className="font-medium">Reply</span>
              </div>
            ) : isBeingEdited ? (
              // Update Button
              <button
                onClick={() => {
                  onUpdate(comment.id, localCommentValue);
                }}
                className="bg-primary-moderateBlue text-white px-6 py-2 rounded-md"
              >
                UPDATE
              </button>
            ) : (
              // Edit/Delete
              <div className="flex items-center gap-4">
                <div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex cursor-pointer transition-colors text-primary-softRed items-center gap-2 hover:text-primary-lightGrayishBlue">
                        <DeleteIcon />
                        <span className="font-medium">Delete</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-md sm:p-6">
                      <AlertDialogHeader className="text-start">
                        <AlertDialogTitle className="text-neutral-darkBlue">
                          Delete Comment
                        </AlertDialogTitle>
                        <AlertDialogDescription className="sm:max-w-72">
                          Are you sure you want to delete this comment? This
                          will remove the comment and can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2.5 sm:gap-3 text-white">
                        <AlertDialogCancel className="!mt-0 h-11 flex-grow hover:text-white bg-neutral-grayishBlue hover:bg-neutral-grayishBlue/70 uppercase">
                          no, cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(comment.id)}
                          className="flex-grow h-11 bg-primary-softRed hover:bg-primary-softRed/75 uppercase"
                        >
                          yes, delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <div
                  onClick={() => onEdit(comment.id)}
                  className="flex cursor-pointer transition-colors text-primary-moderateBlue items-center gap-2 hover:text-primary-lightGrayishBlue"
                >
                  <EditIcon />
                  <span className="font-medium">Edit</span>
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>
      {/* Reply Form */}
      {isBeingReplied && (
        <ReplyForm
          img={currentUserImage || ""}
          username={currentUsername || ""}
          onReply={onReply}
        />
      )}
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col gap-4 ps-4 border-s border-neutral-lightGrayishBlue">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              isOwner={reply.user.username === currentUsername}
              currentUsername={currentUsername}
              voteState={
                votedComments.find(
                  (votedComment) => votedComment.id === reply.id
                )?.type
              }
              onEdit={onEdit} 
              isBeingEdited={reply.id === editingCommentId}
              votedComments={votedComments}
              replyingTo={reply.replyingTo}
              onDelete={onDelete}
              onUpVote={onUpVote}
              onDownVote={onDownVote}
              isBeingReplied={reply.id === replyingCommentId}
              onReplyClick={onReplyClick}
              onUpdate={onUpdate}
              currentUserImage={currentUserImage}
              editingCommentId={editingCommentId}
              onReply={onReply}
              replyingCommentId={replyingCommentId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
