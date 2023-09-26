import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";

function ChatRoom() {
  const chatData = [
    {
      id: 1,
      name: "Rangga",
      yours: true,
      profiledisplay:
        "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/01/2023/07/06/games2-370008716.jpg",
      message: "Hello, how are you?",
    },
    {
      id: 2,
      name: "Affan",
      yours: false,
      profiledisplay:
        "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/28064854/12.-Tips-Merawat-Anak-Kucing-Munchkin.jpg",
      message: "I'm good, thanks!",
    },
    {
      id: 3,
      name: "Rangga",
      yours: true,
      profiledisplay:
        "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/01/2023/07/06/games2-370008716.jpg",
      message: "That's great to hear!",
    },
    {
      id: 4,
      name: "Affan",
      yours: false,
      profiledisplay:
        "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/28064854/12.-Tips-Merawat-Anak-Kucing-Munchkin.jpg",
      message: "Yes, it is!",
    },
    {
      id: 5,
      name: "Rangga",
      yours: true,
      profiledisplay:
        "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/01/2023/07/06/games2-370008716.jpg",
      message: "What have you been up to lately?",
    },
    {
      id: 6,
      name: "Affan",
      yours: false,
      profiledisplay:
        "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/28064854/12.-Tips-Merawat-Anak-Kucing-Munchkin.jpg",
      message: "I've been working on some projects.",
    },
    {
      id: 7,
      name: "Rangga",
      yours: true,
      profiledisplay:
        "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/01/2023/07/06/games2-370008716.jpg",
      message: "That sounds interesting!",
    },
  ];
  return (
    <div className="room-container">
      <div className="top">
        <img src="" alt="" className="server-display" />
        <div className="server-data">
          <div className="server-title">Uwoww</div>
          <p className="server-member">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
          </p>
        </div>
      </div>
      <div className="chat-room">
        <div className="chat-scroll">
          {chatData.map((item, index) => (
            <div
              key={`chat-${index}`}
              id={`chat-${index}`}
              className={`chat-item ${item.yours ? "yours" : ""}`}
            >
              <div className="bubble">
                <img src={item.profiledisplay} alt="" />
                <div className="form">
                  <div className="name">{item.name}</div>
                  <div className="message">{item.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bottom">
        <div className="button-bubble more-button">
          <FontAwesomeIcon className="icon" icon={faPlus} />
        </div>
        <input
          className="input-message"
          placeholder="Send Message"
          type="text"
        />
        <div className="button-bubble send-button">
          <FontAwesomeIcon className="icon" icon={faPlane} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
