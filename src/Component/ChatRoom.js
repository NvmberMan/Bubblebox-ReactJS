import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";
import { hit_sendMessage } from "../Api";

const ChatRoom = forwardRef((props, ref) => {
  let win = sessionStorage;
  const [inputValue, setInputValue] = useState(""); //INPUT VALUE TO SENDMESSAGE
  const [chatData, setChatData] = useState([]); //CHAT DATA ITEM IN THIS ROOM
  const [hasScroll, setHasScroll] = useState(false);
  const [serverData, setServerData] = useState({
    name: "a",
    tagline: "a",
    image: "v",
    unReadedCount: 0,
  }); //DATA SERVER ON THE HEADER

  //HANDLE SEND MESSAGE
  function handleSubmit() {
    //INSERT TO CHATLIST
    setChatData((prevData) => {
      const newData = [
        ...prevData,
        {
          id: 1,
          name: props.webData.user_name,
          yours: true,
          profiledisplay: props.webData.user_image,
          message: inputValue,
        },
      ];
      return newData;
    });

    //INSERT TO DATABASE
    hit_sendMessage(
      win.getItem("token"),
      props.selectedLeftClickServer,
      inputValue
    )
      .then((data) => {
        props.updateSortServerItemToFirstIndex(
          props.selectedLeftClickServer,
          true
        );
      })
      .catch((err) => {
        console.log(err);
      });

    //BROADCAST TO ALL USER
    props.socket.emit("sendMessage", {
      serverRoomId: props.selectedLeftClickServer,
      message: inputValue,
    });

    //INSERT TO GLOBAL WEBDATA
    const newMessage = {
      server_id: props.selectedLeftClickServer,
      message: inputValue,
      user_id: props.webData.user_id,
      user_image: props.webData.user_image,
      user_name: props.webData.user_name,
    };
    props.updateMessageToWebData(newMessage);

    //REMOVE PREVIOUSLY INPUT VALUE
    document.getElementById("input_message").value = "";
    setInputValue("");
  }

  //HANDLE ENTER LISTENER
  function handleKeyDown(event) {
    const trimmedValue = inputValue.trim();
    if (
      event.key === "Enter" &&
      trimmedValue !== "" &&
      props.selectedLeftClickServer
    ) {
      handleSubmit();
      console.log(inputValue);
    }
  }

  //ALL FUNCTION INSIDE THIS METHOD CALLED BY HOME.JS
  useImperativeHandle(ref, () => ({
    //CALLED WHEN USER CLICKED / SELECT SERVER
    loadChat(id) {
      //GET SERVER_DATA SELECTED
      const server_data = props.webData.server_data.filter(
        (d) => d._id === id
      )[0];
      const newChatData = [];

      //SET HEADER ON SELECTED SERVER
      setServerData({
        name: server_data.name,
        tagline: server_data.tag_line,
        image: server_data.image_url,
        unReadedCount: server_data.unReadedCount,
      });

      //SET CHATITEM ON SELECTED SERVER
      server_data.message.forEach((element) => {
        newChatData.push({
          id: element._id,
          name: element.user_name,
          yours: props.webData.user_id === element.user_id ? true : false,
          profiledisplay: element.user_image,
          message: element.message,
        });
      });
      setChatData(newChatData);

      setHasScroll(false);
    },

    //CALLED WHEN SOMEONE CHATING YOU
    newChat(message) {
      //CHECKING IF YOU ARE ON SERVER - CREATE CHAT ITEM
      if (props.selectedLeftClickServer === message.server_id) {
        //SET TO CURRENT LIST
        setChatData((prevData) => {
          const newData = [
            ...prevData,
            {
              id: message.user_id,
              name: message.user_name,
              yours: false,
              profiledisplay: message.user_image,
              message: message.message,
            },
          ];
          return newData;
        });
        //SET TO GLOBAL WEB DATA
        props.updateMessageToWebData(message);
      } //IF NO = SPAWN NOTIFICATION
      else {
        props.spawnMessageNotification(message);
        props.updateMessageToWebData(message);
        props.updateSortServerItemToFirstIndex(message.server_id);
        props.addUnreadedServer(message.server_id);
      }
    },
  }));

  // //CALLED THE FIRST TIME ONCE
  // useEffect(() => {

  // }, [props.Socket]);

  //ELEMENT
  function chatItem(item, index) {
    setTimeout(() => {
      if (index === chatData.length - serverData.unReadedCount && !hasScroll) {
        setHasScroll(true);
        const container = document.getElementById("chat-room"); // Ganti "container" dengan ID div yang Anda inginkan
        const target = document.getElementById("target-scroll"); // Ganti "target" dengan ID div target Anda
        const scrolling  = document.getElementById("chat-scroll"); // Ganti "target" dengan ID div target Anda

        // Gulir ke elemen .target dengan efek halus (smooth)
        // target.scrollIntoView({
        //   top: target.offsetTop,
        //   behavior: 'smooth',
        // });
        container.scrollTop += 320;
      }
    }, 100);

    return (
      <div key={`chat-${index}`} className="div1">
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
      </div>
    );
  }

  return (
    <div className="room-container">
      <div className="top">
        <img src={serverData.image} alt="" className="server-display" />
        <div className="server-data">
          <div className="server-title">{serverData.name}</div>
          <p className="server-member">{serverData.tagline}</p>
        </div>
      </div>
      <div className="chat-room" id="chat-room">
        <div className="chat-scroll" id="chat-scroll">
          {chatData.map((item, index) =>
            index !== chatData.length - serverData.unReadedCount ? (
              chatItem(item, index)
            ) : (
              <div id="target-scroll" key="target">
                <div key={`unreaded-${index}`} className="div2">
                  <div className="unreaded-text">
                    <p>7 new message</p>
                  </div>
                </div>
                {chatItem(item, index)}
              </div>
            )
          )}
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
          id="input_message"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Menangkap event ketika tombol ditekan
        />
        <div className="button-bubble send-button">
          <FontAwesomeIcon className="icon" icon={faPlane} />
        </div>
      </div>

      {/* <div className="container">
        <div className="scrolling">
          <div className="target"></div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
          <div className="item"></div>
        </div>
      </div> */}
    </div>
  );
});

export default ChatRoom;
