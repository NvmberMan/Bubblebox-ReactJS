import { React, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import adventure from "../Assets/Img/Application/adventure.png";
import weather from "../Assets/Img/Application/weather.png";
import loadingbar from "../Assets/Img/Application/LoadingGif.gif";
import bunny from "../Assets/Img/Application/bunny-ballon2.png";
import io from "socket.io-client";
import {
  URL,
  hit_createServer,
  hit_discover,
  hit_getServerMember,
  hit_getWebData,
  hit_joinServer,
  hit_leaveServer,
} from "../Api";
import ChatRoom from "../Component/ChatRoom";
import Profil from "../Component/Profil";
import SearchMessageRoom from "../Component/SearchMessageRoom";
import Header from "../Component/Header";
import ServerRoom from "../Component/ServerRoom";
import Notification from "../Component/Notification";

function Home() {
  let win = sessionStorage;
  const [MemberData, SetMemberData] = useState({
    TotalMember: 1,
    Members: [],
  });
  const [webData, setWebData] = useState({
    server_data: [],
  });
  const [socket, setSocket] = useState(null);

  //INPUT FIELD
  const [serverName, setServerName] = useState("");
  const [serverTagLine, setServerTagLine] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [alertError, setAlertError] = useState("");
  const [toaster, setToaster] = useState({});
  const [messageServerNotification, setMessageServerNotification] = useState({
    title: "",
    name: "",
    message: "",
    image: "",
  });

  //ELEMENT
  const [choosenPopupElement, setChoosenPopupElement] = useState();
  const [joinPopupElement, setJoinPopupElement] = useState();
  const [createPopupElement, setCreatePopupElement] = useState();
  const [discoverPopupElement, setDiscoverPopupElement] = useState();
  const [detailPopupElement, setDetailPopupElement] = useState();
  const [serverViewElement, setServerViewElement] = useState();

  //ARRAY DATA
  const [discoverArrayData, setDiscoverArrayData] = useState([]); //ARRAY DATA OF PUBLIC SERVER

  //OBJECT DATA
  const [popupJoinDetail, setPopupJoinDetail] = useState({}); //DATA WHEN CLICK DETAIL FROM DISCOVER SERVERS
  const [selectedRightClickServer, setSelectedRightClickServer] = useState({}); //DATA WHEN 'RIGHT' CLICK TO SERVER ITEM
  const [selectedLeftClickServer, setSelectedLeftClickServer] = useState(""); //DATA WHEN 'LEFT' CLICK TO SERVER ITEM

  //CHILD REFERENCE
  const chatRoomRef = useRef(null); //REFERENCE TO 'ChatRoom.js'

  //CALLED FIRST TIME ONCE
  useEffect(() => {
    //INNITILIZE POPUP ELEMENT TO USESTATE
    setChoosenPopupElement(document.getElementById("choosen"));
    setJoinPopupElement(document.getElementById("join"));
    setCreatePopupElement(document.getElementById("create"));
    setDiscoverPopupElement(document.getElementById("discover"));
    setDetailPopupElement(document.getElementById("detail"));
    setServerViewElement(document.getElementById("server-view"));
    document.getElementById("loading-webdata").classList.remove("hidden");
    if (!win.getItem("token")) {
      window.location = "/login";
    } else {
      const s = SetupSocket();
      setSocket(s);

      //GETTING ALL DATA - LOADING SHOULD BE HERE
      const hit = hit_getWebData(win.getItem("token"));
      hit
        .then((data) => {
          setWebData(data.data);
          SetUnreadedCountToWebData(data);

          data.data.server_data.forEach((element) => {
            s.emit("joinServer", {
              serverRoomId: element._id,
            });
          });

          document.getElementById("loading-webdata").classList.add("hidden");
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // eslint-disable-next-line
  }, [win]);
  //FOR REALTIME
  useEffect(() => {
    if (socket) {
      const handleNewMessage = (message) => {
        chatRoomRef.current.newChat(message);
      };
      // console.log(message);

      socket.on("newMessage", handleNewMessage);

      //MEMPERBAIKI BUG YANG TERPANGGIL TERUS MENERUS
      return () => {
        socket.off("newMessage", handleNewMessage);
      };
    }
  });

  //SETUP SOCKET AND INTERNET
  function SetupSocket() {
    const token = win.getItem("token");
    const newSocket = io(URL, {
      query: {
        token: token,
      },
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
      setTimeout(SetupSocket, 3000);
      setToaster({
        message: "Socket Disconnected!",
        type: "Error",
      });
    });

    newSocket.on("connect", () => {
      setToaster({
        message: "Socket Connected!",
        type: "Success",
      });
    });
    // Mengatur SetToaster menjadi null setelah 5 detik
    setTimeout(() => {
      setToaster({
        message: "",
        type: "null",
      });
    }, 2000);

    return newSocket;
  }

  //SERVER MANAGEMENT
  function CreateServer() {
    hit_createServer(
      win.getItem("token"),
      serverName,
      serverTagLine,
      serverDescription
    )
      .then((data) => {
        // Tambahkan data baru ke dalam currentData
        // webData.server_data.unshift(data.data.data);

        setWebData((prevWebData) => ({
          ...prevWebData,
          server_data: [data.data.data, ...prevWebData.server_data],
        }));

        //BROADCAST TO ALL MEMBER IF I JOIN THAT SERVER
        socket.emit("joinServer", {
          serverRoomId: data.data.data._id,
        });

        //AUTO SELECT SERVER
        setTimeout(() => {
          SelectServer(data.data.data._id);
        }, 100);

        ClosePopup();
      })
      .catch((err) => {
        setAlertError(err.response.data.message);
      });
  }
  function LeaveServer(serverdata) {
    hit_leaveServer(win.getItem("token"), serverdata._id)
      .then((data) => {
        setWebData((prevWebData) => ({
          ...prevWebData,
          server_data: prevWebData.server_data.filter(
            (server) => server._id !== serverdata._id
          ),
        }));

        socket.emit("leaveServer", {
          serverRoomId: serverdata._id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function JoinServer() {
    hit_joinServer(win.getItem("token"), popupJoinDetail._id)
      .then((data) => {
        //PUSHING NEW SERVER TO WEBDATA.SERVER_DATA ARRAY
        setWebData((prevWebData) => ({
          ...prevWebData, //GETTING WEBDATA PREVIOUSLY DATA
          server_data: [data.data.server, ...prevWebData.server_data],
        }));

        //BROADCAST TO ALL MEMBER IF I JOIN THAT SERVER
        socket.emit("joinServer", {
          serverRoomId: data.data.server._id,
        });

        //AUTO SELECT SERVER
        setTimeout(() => {
          SelectServer(data.data.server._id);
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
    ClosePopup();
  }
  function SelectServer(id) {
    //ID = SERVER ID
    MoveServerSelected(id);
    removeUnreadedServer(id);
    setSelectedLeftClickServer(id);
    document.getElementById("room-container").classList.remove("hidden");

    //CALL LOADCHAT FUNCTION IN CHATROOM.JS
    chatRoomRef.current.loadChat(id);
  }
  function MoveServerSelected(id) {
    //ID = SERVER ID
    const bubbleServer = document.getElementById(`server-${id}`);
    const allServer = document.getElementById("server-list").children;
    // CHECK IF ELEMENT IS FOUNDED IN WEBSITE
    if (bubbleServer) {
      //SET ALL SERVER ITEM TO UNSELECTED
      for (let i = 0; i < allServer.length; i++) {
        const childElement = allServer[i];
        childElement.classList.remove("selected");
        childElement.classList.add("unselected");
      }

      //SET ELEMENT SERVER TO SELECTED
      bubbleServer.classList.remove("unselected");
      bubbleServer.classList.add("selected");
    }
  }
  function SetUnreadedCountToWebData(data) {
    //CHECKING UNDREADED MESSAGE FROM SERVER, AND UPDATE TO WEBDATA
    const updatedServerData = data.data.server_data.map((server) => {
      const notReaded = server.message.reduce((count, message) => {
        const hasReaded = message.readed.some(
          (r) => r.user_id === data.data.user_id
        );
        return count + (hasReaded ? 0 : 1);
      }, 0);

      // Gabungkan newData dengan data server yang ada
      return {
        ...server,
        unReadedCount: notReaded,
      };
    });

    setWebData((prevWebData) => ({
      ...prevWebData,
      server_data: updatedServerData,
    }));
  }

  //POPUP MANAGEMENT
  function OpenChoosen() {
    ClosePopup();
    choosenPopupElement.classList.remove("hidden");
  }
  function OpenJoin() {
    ClosePopup();
    joinPopupElement.classList.remove("hidden");
  }
  function OpenDiscover() {
    ClosePopup();
    discoverPopupElement.classList.remove("hidden");

    hit_discover(win.getItem("token")).then((data) => {
      console.log(data.data.data);
      setDiscoverArrayData(data.data.data);
    });
  }
  function OpenDetail(selectedJoin) {
    setPopupJoinDetail(selectedJoin);
    ClosePopup();
    detailPopupElement.classList.remove("hidden");
  }
  function OpenCreate() {
    ClosePopup();
    createPopupElement.classList.remove("hidden");
  }
  function ClosePopup() {
    choosenPopupElement.classList.add("hidden");
    joinPopupElement.classList.add("hidden");
    createPopupElement.classList.add("hidden");
    discoverPopupElement.classList.add("hidden");
    detailPopupElement.classList.add("hidden");
    setAlertError("");
    setServerName("");
    setServerTagLine("");
    setServerDescription("");
  }

  //SERVER VIEW MANAGEMENT
  function HandlerServerView(set) {
    if (set === true) {
      serverViewElement.classList.remove("hidden");

      hit_getServerMember(win.getItem("token"), selectedRightClickServer._id)
        .then((data) => {
          console.log(data.data);
          SetMemberData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      serverViewElement.classList.add("hidden");
    }
  }

  //LISTENER RIGHT CLICK
  function HandleRightServerDetail(event, data) {
    event.preventDefault();
    setSelectedRightClickServer(data);

    let serverDetail = document.getElementById("server-detail");
    let customDetail = document.getElementById("custom-detail");
    serverDetail.classList.remove("hidden");

    const top = event.clientY + "px";
    const left = event.clientX + "px";

    customDetail.style.top = top;
    customDetail.style.left = left;
  }
  window.addEventListener("click", function () {
    let serverDetail = document.getElementById("server-detail");
    serverDetail.classList.add("hidden");
  });

  //CALLED BY CHILD
  function updateMessageToWebData(newMessage) {
    //INSERT MESSAGE TO WEBDATA
    // Lakukan pembaruan state dengan menggunakan setWebData
    setWebData((prevWebData) => {
      // Dapatkan salinan objek state sebelumnya
      const updatedWebData = { ...prevWebData };

      // Dapatkan salinan array server_data
      const serverDataCopy = [...updatedWebData.server_data];

      // Temukan server_data tertentu di mana Anda ingin memasukkan pesan baru
      const serverDataToUpdate = serverDataCopy.find(
        (server) => server._id === newMessage.server_id
      );

      if (serverDataToUpdate) {
        // Temukan array message di server_data tersebut
        const messages = serverDataToUpdate.message;

        // Tambahkan pesan baru ke dalam array message
        messages.push(newMessage);

        // Perbarui server_data dengan data yang telah diubah
        serverDataToUpdate.message = messages;
      }

      // Perbarui state dengan data yang telah diubah
      updatedWebData.server_data = serverDataCopy;
      console.log(serverDataToUpdate);
      return updatedWebData;
    });
  }
  function spawnMessageNotification(message) {
    //SPAWNING MESSAGE NOTIFICATION
    setMessageServerNotification({
      title: message.server_name,
      username: message.user_name,
      message: message.message,
      image: message.server_image,
    });

    setTimeout(() => {
      setMessageServerNotification({
        title: "",
      });
    }, 3500);
  }
  function removeUnreadedServer(id) {
    //REMOVING SERVERITEM UNREADED NOTIF - CALLED F SELECTSERVER()
    const serverElement = document.getElementById(`server-${id}`);
    setTimeout(() => {
      setWebData((prevWebData) => ({
        ...prevWebData,
        server_data: prevWebData.server_data.map((server) => {
          // Jika _id sesuai, tambahkan 1 ke unReadedCount, jika tidak, biarkan tidak berubah
          if (server._id === id) {
            return {
              ...server,
              unReadedCount: 0,
            };
          } else {
            return server;
          }
        }),
      }));
    }, 300);
    serverElement.classList.add("notif-hidden");
  }
  function insertNotificationToWebData(message, unReaded = false) {
    // GETTING MESSAGE FROM BRODCAST AND INSERT TO WEB DATA
    const newMessage = {
      server_id: message.server_id,
      message: message.message,
      user_id: message.user_id,
      user_image: message.user_image,
      user_name: message.user_name,
    };
    setWebData((prevWebData) => {
      const serverIndex = prevWebData.server_data.findIndex(
        (server) => server._id === message.server_id
      );

      if (serverIndex !== -1) {
        // Temukan server dengan _id yang sesuai
        const updatedServerData = JSON.parse(
          JSON.stringify([...prevWebData.server_data])
        );
        const serverToUpdate = updatedServerData[serverIndex];

        // Pastikan messages adalah array yang sudah ada atau inisialisasi jika belum ada
        serverToUpdate.message = serverToUpdate.message || [];

        // Tambahkan pesan baru ke dalam array messages
        serverToUpdate.message.push(newMessage);

        if (unReaded) {
          serverToUpdate.unReadedCount += 1;
        } else {
          serverToUpdate.unReadedCount = 0;
        }

        // Perbarui server_data dengan data yang telah diubah
        updatedServerData[serverIndex] = serverToUpdate;
        // Perbarui state dengan data yang telah diubah
        console.log(serverToUpdate);
        setWebData({
          ...prevWebData,
          server_data: updatedServerData,
        });
      } else {
        // Jika server tidak ditemukan, tidak ada perubahan
        setWebData(prevWebData);
      }
    });

    const serverElement = document.getElementById(
      `server-${message.server_id}`
    );
    serverElement.classList.remove("notif-hidden");
  }

  return (
    <div>
      <div className="container-full home-page">
        <div className="list-container">
          {<Profil webData={webData} />}
          {<SearchMessageRoom />}
          {
            <ServerRoom
              webData={webData}
              HandleRightServerDetail={HandleRightServerDetail}
              SelectServer={SelectServer}
            />
          }
          {<Header OpenChoosen={OpenChoosen} />}
        </div>
        {
          <ChatRoom
            selectedLeftClickServer={selectedLeftClickServer}
            webData={webData}
            ref={chatRoomRef}
            socket={socket}
            updateMessageToWebData={updateMessageToWebData}
            spawnMessageNotification={spawnMessageNotification}
            insertNotificationToWebData={insertNotificationToWebData}
          />
        }
        {
          <Notification
            messageServerNotification={messageServerNotification}
            toaster={toaster}
          />
        }

        {/* --POPUP-- */}
        <div className="popup-container">
          <div className="popup-menu choosen hidden" id="choosen">
            <div className="menu choosen-menu">
              <div className="menu-title">
                <h1>BubbleBox</h1>
                <p>Give your new server personality with name and an icon</p>
              </div>
              <div className="menu-content">
                <div onClick={OpenCreate} className="item">
                  <img src={weather} width={130} height={110} alt="" />
                  <div className="item-content">
                    <h1>Create Server</h1>
                    <p>Create your own server</p>
                  </div>
                </div>
                <div onClick={OpenDiscover} className="item item-2">
                  <img src={adventure} width={100} height={80} alt="" />
                  <div className="item-content">
                    <h1>Discover Server</h1>
                    <p>Create your own server</p>
                  </div>
                </div>
              </div>
              <div className="menu-footer">
                <h1>Have Invite Already?</h1>
                <button onClick={OpenJoin}>Join a Server</button>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon
                  onClick={ClosePopup}
                  className="exit icon"
                  icon={faXmark}
                />
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
          <div className="popup-menu join hidden" id="join">
            <div className="menu join-menu">
              <div className="menu-title">
                <h1>Join Server</h1>
                <p>Dicovery new server</p>
              </div>
              <div className="menu-content join-content">
                <img src={weather} alt="" />
                <div className="input-form">
                  <label htmlFor="">Invitation Code</label>
                  <input placeholder="HSJGLSI" type="text" name="" id="" />
                  <p>
                    Create Own Server?<a href="/">Klik here</a>
                  </p>
                </div>
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenChoosen} className="back">
                  Back
                </div>
                <div className="button">Join</div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon
                  onClick={ClosePopup}
                  className="exit icon"
                  icon={faXmark}
                />
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
          <div className="popup-menu create hidden" id="create">
            <div className="menu join-menu">
              <div className="menu-title">
                <h1>Create New Server</h1>
                <p>Give you an own server</p>
              </div>
              <div className="menu-content create-content">
                <div className="preview-item">
                  <div className="preview-image">
                    <img src="" alt="" />
                    <p>Upload</p>
                    <input type="file" />
                  </div>
                  <div className="data">
                    <div className="name">{}'s Server</div>
                    <div className="tagline">Server Tagline</div>
                  </div>
                </div>

                <div className="input-form">
                  {alertError !== "" ? (
                    <div className="alert-form danger">
                      <p>{alertError}</p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <label htmlFor="servername">Name*</label>
                  <input
                    type="text"
                    id="servername"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="servertagline">Tagline</label>
                  <input
                    type="text"
                    id="servertagline"
                    value={serverTagLine}
                    onChange={(e) => setServerTagLine(e.target.value)}
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="serverdescription">Description</label>
                  <textarea
                    placeholder="Description"
                    type="text"
                    id="serverdescription"
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenChoosen} className="back">
                  Back
                </div>
                <div className="button" onClick={CreateServer}>
                  Create
                </div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon
                  onClick={ClosePopup}
                  className="exit icon"
                  icon={faXmark}
                />
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
          <div className="popup-menu discover hidden" id="discover">
            <div className="menu discover-menu">
              <div className="menu-title">
                <h1>Bubblebox</h1>
                <p>Give your new server personality with name and an icon</p>
              </div>
              <div className="menu-content discover-content">
                {discoverArrayData.map((row, index) => (
                  <div className="list" key={index}>
                    <div
                      onClick={(e) => OpenDetail(row)}
                      className="preview-item "
                    >
                      <div className="preview-image">
                        <img src={row.image_url} alt="" />
                      </div>
                      <div className="data">
                        <div className="name">{row.name}</div>
                        <div className="tagline">{row.tag_line}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenChoosen} className="back">
                  Back
                </div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon
                  onClick={ClosePopup}
                  className="exit icon"
                  icon={faXmark}
                />
                <div className="search">
                  <FontAwesomeIcon className="icon" icon={faSearch} />

                  <input type="text" placeholder="Find Community" />
                </div>
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
          <div className="popup-menu detail hidden" id="detail">
            <div className="menu detail-menu">
              <div className="menu-title">
                <h1>{popupJoinDetail.name}</h1>
                <p>Dicovery new server</p>
              </div>
              <div className="menu-content join-content">
                <img src={popupJoinDetail.image_url} alt="" />
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenDiscover} className="back">
                  Back
                </div>
                <div onClick={JoinServer} className="button">
                  Join
                </div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon
                  onClick={ClosePopup}
                  className="exit icon"
                  icon={faXmark}
                />
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
          <div className="loading-webdata hidden" id="loading-webdata">
            <div className="data">
              <h1>BUBBLEBOX</h1>
            </div>
            <img src={loadingbar} alt="" />
          </div>
          <div className="full-menu server-view hidden" id="server-view">
            <div className="server-detail">
              <img src={selectedRightClickServer.image_url} alt="" />
              <div className="detail">
                <h1>{selectedRightClickServer.name}</h1>
                <h4>{selectedRightClickServer.tag_line}</h4>
                <p>{selectedRightClickServer.description}</p>
              </div>
            </div>
            <div className="server-manager server-member-list">
              <div className="title">
                <h1>MEMBER</h1>
                <div className="line"></div>
              </div>
              <div className="bottom">
                <div className="list">
                  {MemberData.Members.map((row, index) => (
                    <div className="item" key={index}>
                      <img src={row.user.image_url} alt="" />
                      <div className="data">
                        <h2>{row.user.username}</h2>
                        <p>{row.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <FontAwesomeIcon
                onClick={(e) => HandlerServerView(false)}
                className="exit icon"
                icon={faXmark}
              />
            </div>
          </div>

          <div className="custom-right-click" id="custom-detail">
            <div className="server-detail hidden" id="server-detail">
              <div className="item" onClick={(e) => HandlerServerView(true)}>
                <p>{selectedRightClickServer.name}</p>
              </div>
              <div className="line"></div>
              <div className="item">
                <p>Server Detail</p>
              </div>
              <div className="item">
                <p>Notification</p>
              </div>
              <div
                onClick={(e) => LeaveServer(selectedRightClickServer)}
                className="item danger"
              >
                <p>Leave Server</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
