import React from "react";
import { type Comment } from "./Comments";
import PlusIcon from "./icons/PlusIcon";
import MinusIcon from "./icons/MinusIcon";
import ReplyIcon from "./icons/ReplyIcon";

const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => {
  return (
    <div className="comment-item bg-neutral-white p-4 rounded flex flex-col gap-3">
      {/* Comment Header */}
      <header className="flex items-center gap-4">
        <img
          src={comment.user.image.webp}
          alt={comment.user.username}
          className="w-8 h-8 rounded-full"
        />
        <span className="font-medium">{comment.user.username}</span>
        <span className="text-neutral-grayishBlue">{comment.createdAt}</span>
      </header>
      {/* Comment Body */}
      <p className="text-neutral-grayishBlue">{comment.content}</p>
      {/* Comment Footer */}
      <footer>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 p-2 rounded-lg bg-neutral-veryLightGray">
            <button className="cursor-pointer transition-colors p-1 text-primary-lightGrayishBlue hover:text-primary-moderateBlue">
              <PlusIcon />
            </button>
            <span className="text-primary-moderateBlue font-medium">
              {comment.score}
            </span>
            <button className="cursor-pointer transition-colors p-1 text-primary-lightGrayishBlue hover:text-primary-moderateBlue">
              <MinusIcon />
            </button>
          </div>
          <div className="flex cursor-pointer transition-colors text-primary-moderateBlue items-center gap-2 hover:text-primary-lightGrayishBlue">
            <ReplyIcon />
            <span className="font-medium">Reply</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CommentItem;
