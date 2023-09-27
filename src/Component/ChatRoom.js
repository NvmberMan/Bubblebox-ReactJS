import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";
import { hit_sendMessage } from "../Api";

const ChatRoom = forwardRef((props, ref) => {
  let win = sessionStorage;
  const [inputValue, setInputValue] = useState(""); //INPUT VALUE TO SENDMESSAGE
  const [chatData, setChatData] = useState([]);   //CHAT DATA ITEM IN THIS ROOM
  const [serverData, setServerData] = useState({
    name: "a",
    tagline: "a",
    image: "v",
  });   //DATA SERVER ON THE HEADER

  //HANDLE SEND MESSAGE
  function handleSubmit() {
    
    //INSERT TO CHATLIST
    setChatData((prevData) => {
      const newData = [
        ...prevData,
        {
          id: 1,
          name: props.WebData.user_name,
          yours: true,
          profiledisplay: props.WebData.user_image,
          message: inputValue,
        },
      ];
      return newData;
    });

    //INSERT TO DATABASE
    hit_sendMessage(win.getItem("token"), props.SelectedServer, inputValue).then((data) => {
      console.log(data)
    }).catch(err => {
      console.log(err)
    })

    //BROADCAST TO ALL USER
    props.Socket.emit("sendMessage", {
      serverRoomId: props.SelectedServer,
      message: inputValue,
    });

    //REMOVE PREVIOUSLY INPUT VALUE
    document.getElementById("input_message").value = "";
    setInputValue("");
  }

  //HANDLE ENTER LISTENER
  function handleKeyDown(event) {
    const trimmedValue = inputValue.trim();
    if (event.key === "Enter" && trimmedValue !== "" && props.SelectedServer) {
      handleSubmit();
    }
  }

  //ALL FUNCTION INSIDE THIS METHOD CALLED BY HOME.JS
  useImperativeHandle(ref, () => ({

    //CALLED WHEN USER CLICKED / SELECT SERVER
    loadChat(id) {

      //GET SERVER_DATA SELECTED
      const server_data = props.WebData.server_data.filter(
        (d) => d._id === id
      )[0];
      const newChatData = [];

      //SET HEADER ON SELECTED SERVER
      setServerData({
        name: server_data.name,
        tagline: server_data.tag_line,
        image: server_data.image_url,
      });

      //SET CHATITEM ON SELECTED SERVER
      server_data.message.forEach((element) => {
        newChatData.push({
          id: element._id,
          name: element.user_name,
          yours: props.WebData.user_id === element.user_id ? true : false,
          profiledisplay: element.user_image,
          message: element.message,
        });
      });
      setChatData(newChatData);


      //CHECK JOINING ROOM OR LEAVING ROOM
      props.Socket.emit("leaveRoom", {
        serverRoomId: props.SelectedServer
      })
      props.Socket.emit("joinRoom", {
        serverRoomId: id
      })
    },
  }));


  //CALLED THE FIRST TIME ONCE
  useEffect(() => {
    //CHECK IF SOCKET ALREADY INITIALLZYE WITH HOME.JS
    if (props.Socket) {

      //CHECK IF CURRENTLY ON THIS SERVER
      //CREATE CHAT ITEM IN THIS CHATROOM
      const handleNewMessage = (message) => {
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
      };

      props.Socket.on("newMessage", handleNewMessage);

      //MEMPERBAIKI BUG YANG TERPANGGIL TERUS MENERUS
      return () => {
        props.Socket.off("newMessage", handleNewMessage);
      };
    }
  }, [props.Socket]);


  return (
    <div className="room-container">
      <div className="top">
        <img src={serverData.image} alt="" className="server-display" />
        <div className="server-data">
          <div className="server-title">{serverData.name}</div>
          <p className="server-member">{serverData.tagline}</p>
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
          id="input_message"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown} // Menangkap event ketika tombol ditekan
        />
        <div className="button-bubble send-button">
          <FontAwesomeIcon className="icon" icon={faPlane} />
        </div>
      </div>
    </div>
  );
});

export default ChatRoom;
