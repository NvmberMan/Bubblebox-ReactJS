import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";
import { apiURL, hit_readMessage, hit_sendMessage } from "../Api";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";

const ChatRoom = forwardRef((props, ref) => {
  let win = sessionStorage;
  const [inputValue, setInputValue] = useState(""); //INPUT VALUE TO SENDMESSAGE
  const [chatData, setChatData] = useState([]); //CHAT DATA ITEM IN THIS ROOM
  const [hasScroll, setHasScroll] = useState(false);
  const [serverData, setServerData] = useState({
    id: "",
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

      })
      .catch((err) => {
        console.log(err);
      });

    //BROADCAST TO ALL USER
    props.socket.emit("sendMessage", {
      serverRoomId: props.selectedLeftClickServer,
      message: inputValue,
      username: props.webData.user_name
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

    setServerData((prevData) => ({
      ...prevData,
      unReadedCount: 0,
    }));
    

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
        id: server_data._id,
        name: server_data.name,
        tagline: server_data.tag_line,
        image: server_data.image_url,
        unReadedCount: server_data.unReadedCount,
      });

      //SET CHATITEM ON SELECTED SERVER
      server_data.message.forEach((element) => {
        newChatData.push({
          id: element._id,
          user_id: element.user_id,
          name: element.user_name,
          yours: props.webData.user_id === element.user_id ? true : false,
          profiledisplay: element.user_image,
          profiledisplay_key : 0,
          message: element.message,
        });
      });
      setChatData(newChatData);

      //IF HAVE UNREADED = HIT API TO READED
      hit_readMessage(win.getItem("token"), id)
        .then((data) => {
          // console.log(data)
        })
        .catch((err) => {
          console.log(err);
        });

      //IF DOESNT HAVE UNREADED = SCOLL DOWN
      setHasScroll(false);
      if (server_data.unReadedCount < 1) {
        const scrollableDiv = document.getElementById("chat-room");
        scrollableDiv.scrollTo({
          top: 0,
        });
      }
    },

    //CALLED WHEN SOMEONE CHATING YOU
    newChat(message) {

      // const previewProfilDisplayKey = chatData.find((c) => c.user_id === message.user_id);

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
              // profiledisplay_key: previewProfilDisplayKey.profiledisplay_key,
              message: message.message,
            },
          ];
          return newData;
        });
        //SET TO GLOBAL WEB DATA
        props.insertNotificationToWebData(message);
        setServerData((prevData) => ({
          ...prevData,
          unReadedCount: 0,
        }));

        //SET READED TO DATABASE
        hit_readMessage(win.getItem("token"), message.server_id);


      } //IF NO = SPAWN NOTIFICATION
      else {
        props.spawnMessageNotification(message);
        props.insertNotificationToWebData(message, true);
      }
    },

    updateOwnChat(newData){
      const updatedChatData = chatData.map(chat => {
        if (chat.yours) {
          return { ...chat, name: newData.username };
        } else {
          return chat; // Kembalikan objek aslinya jika kondisi if tidak terpenuhi
        }
      });
      
      setChatData(updatedChatData);
      
      
      // console.log(serverData);
    },

    updateOtherChat(newData){

      const updatedChatData = chatData.map(chat => {
        if (chat.user_id === newData.newData._id) {
          return { ...chat, name: newData.newData.username, profiledisplay_key: (chat.profiledisplay_key + 1) };
        } else {
          return chat; // Kembalikan objek aslinya jika kondisi if tidak terpenuhi
        }
      });
      console.log(updatedChatData)
      setChatData(updatedChatData);
    }
  }));

  //ELEMENT
  function chatItem(item, index) {
    //AUTO SCROLLING TO DOWN AND TARGET UNREADED
    setTimeout(() => {
      if (serverData.unReadedCount > 0) {
        if (
          index === chatData.length - serverData.unReadedCount &&
          !hasScroll
        ) {
          const scrollableDiv = document.getElementById("chat-room");
          let sizeAllChat = 0;
          for (let i = 0; i < serverData.unReadedCount; i++) {
            const chatSize = document.getElementById(`chat-${index}`);
            sizeAllChat -= chatSize.clientHeight;
          }

          // Melakukan auto scrolling ke atas dengan efek halus (smooth)
          scrollableDiv.scrollTo({
            top: sizeAllChat + 500,
            behavior: "smooth",
          });
          setHasScroll(true);
        }
      }
    }, 100);

    return (
      <div key={`chat-${index}`} className="div1" id={`chat-${index}`}>
        <div
          key={`chat-${index}`}
          id={`chat-${index}`}
          className={`chat-item ${item.yours ? "yours" : ""}`}
        >
          <div className="bubble">
            <img src={apiURL + "/user/profil/" +  item.profiledisplay + `?v=${!item.yours ? (item.profiledisplay_key) :  (props.webData.user_image_key)}`} alt="" />
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
    <div className="room-content">
      <div className="room-container hidden" id="room-container">
        <div className="top">
          <img src={serverData.image} alt="" className="server-display" />
          <div className="server-data">
            <div className="server-title">{serverData.name}</div>
            <p className="server-member">{serverData.tagline}</p>
          </div>
        </div>
        <div className="chat-room" id="chat-room">
          <div className="chat-scroll" id="chat-scroll">
            {/* <h1 id="tess">TESSSS</h1> */}
            {chatData.map((item, index) =>
              index !== chatData.length - serverData.unReadedCount ? (
                chatItem(item, index)
              ) : (
                <div className="target-scroll" id="target-scroll" key="target">
                  <div key={`unreaded-${index}`} className="div2">
                    <div className="unreaded-text">
                      <p>{serverData.unReadedCount} new message</p>
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
      </div>
      <div className="start-scene">
        <img src={bunny} alt="" />
        <div className="data">
          <h1>Welcome Back!</h1>
          <p>We’re so excited to see you again!</p>
        </div>
      </div>
    </div>
  );
});

export default ChatRoom;
