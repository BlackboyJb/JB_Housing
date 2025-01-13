"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import MarkMessagesAsRead from "@/app/actions/MarkMessagesAsRead";
import deleteMessage from "@/app/actions/DeleteMessage";
import { useGlobalContext } from "@/context/GlobalContext";

const MessageCard = ({ message }) => {
  const [isRead, setIsRead] = useState(message.read);
  const [isDeleted, setDeleted] = useState(false);
  const { setIsUnread } = useGlobalContext();

  const handleReadClick = async () => {
    const read = await MarkMessagesAsRead(message._id);
    setIsRead(read);
    setIsUnread((prevCount) => (read ? prevCount - 1 : prevCount + 1));
    toast.success(`Marked as ${read ? "Read" : "New"}`);
  };

  const handleDeleteClick = async () => {
    await deleteMessage(message._id);
    setDeleted(true);
    setIsRead((prevCount) => (isRead ? prevCount : prevCount + 1));
    toast.success("Message Deleted");
  };

  if (isDeleted) {
    return <p>Deleted Message</p>;
  }
  return (
    <div className="relative bg-light p-4 rounded-md shadow-md border-gray-2-200">
      {!isRead && (
        <div className="absolute top-2 right-2 bg-stone-500 text-white px-2 py-1 rounded-md">
          New
        </div>
      )}
      <h2 className="text-xl mb-4">
        <span className="font-bold">Property Inquiry: </span>
        {message.property.name}
      </h2>
      <p className=" text-ml mb-4">
        {" "}
        <span className="font-bold">Message: </span>
        {message.body}
      </p>

      <ul className="mt-4">
        <li>
          <strong>Reply Email:</strong>{" "}
          <a href={`mailto:${message.email}`} className="text-blue-400">
            {message.email}
          </a>
        </li>
        <li>
          <strong>Reply Phone:</strong>{" "}
          <a href={`tel:${message.phone}`} className="text-blue-400">
            {message.phone}
          </a>
        </li>
        <li>
          <strong>Received:</strong>{" "}
          {new Date(message.createdAt).toLocaleString()}
        </li>
      </ul>
      <button
        onClick={handleReadClick}
        className="mt-4 mr-3 bg-cyan-200 text-white py-1 px-3 rounded-md"
      >
        {isRead ? "Mark as New" : "Mark as Read"}
      </button>
      <button
        onClick={handleDeleteClick}
        className="mt-4 mr-3 bg-red-600 text-white py-1 px-3 rounded-md"
      >
        Delete Messages
      </button>
    </div>
  );
};

export default MessageCard;
