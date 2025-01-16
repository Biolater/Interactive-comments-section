import React from "react";

type ReplyFormProps = {
  img: string;
  username: string;
  onReply: (content: string) => void;
};

const ReplyForm: React.FC<ReplyFormProps> = ({ img, username, onReply }) => {
  const [comment, setComment] = React.useState("");
  return (
    <div className="add-comment p-4 bg-white rounded-md">
      {/* Add a  comment form */}
      <div
        // onSubmit={handleAddCommentSubmit}
        className="flex flex-wrap justify-between gap-4"
      >
        {/* Profile Photo */}
        <img className="w-9 h-9" src={img} alt={username} />
        {/* Comment Input */}
        <textarea
          onChange={(e) => setComment(e.currentTarget.value)}
          name="comment"
          placeholder="Add a comment..."
          className="w-full resize-none -order-1 flex-grow h-28 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        {/* Send Button */}
        <button
          onClick={() => onReply(comment)}
          className="bg-primary-moderateBlue text-white px-6 py-2 rounded-md"
        >
          REPLY
        </button>
      </div>
    </div>
  );
};

export default ReplyForm;
