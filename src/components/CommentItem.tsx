import { votedComment, type Comment } from "./Comments";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import ReplyIcon from "./icons/ReplyIcon";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";

const CommentItem: React.FC<{
  comment: Comment;
  isOwner?: boolean;
  currentUsername?: string;
  voteState: "upvote" | "downvote" | "none" | undefined;
  votedComments: votedComment[];
  onUpVote: (id: number) => void;
  onDownVote: (id: number) => void;
  replyingTo?: string | undefined;
  onDelete: (id: number) => void;
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
}) => {
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
                onClick={() => alert("reply")}
                className="flex cursor-pointer transition-colors text-primary-moderateBlue items-center gap-2 hover:text-primary-lightGrayishBlue"
              >
                <ReplyIcon />
                <span className="font-medium">Reply</span>
              </div>
            ) : (
              // Delete/Edit
              <div className="flex items-center gap-4">
                <div
                  onClick={() => onDelete(comment.id)}
                  className="flex cursor-pointer transition-colors text-primary-softRed items-center gap-2 hover:text-primary-lightGrayishBlue"
                >
                  <DeleteIcon />
                  <span className="font-medium">Delete</span>
                </div>
                <div
                  onClick={() => alert("reply")}
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
              votedComments={votedComments}
              replyingTo={reply.replyingTo}
              onDelete={() => onDelete(reply.id)}
              onUpVote={() => onUpVote(reply.id)}
              onDownVote={() => onDownVote(reply.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
