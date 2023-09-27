import { React, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import adventure from "../Assets/Img/Application/adventure.png";
import weather from "../Assets/Img/Application/weather.png";
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
  const [userData, setUserData] = useState({
    user_name: "",
    server_data: [
      {
        image_url: "",
      },
    ],
  });
  const [MemberData, SetMemberData] = useState({
    TotalMember: 1,
    Members: [],
  });
  const [WebData, SetWebData] = useState({
    'server_data' : []
  });
  const [Socket, setSocket] = useState(null);
  const [ServerName, SetServerName] = useState("");
  const [ServerTagLine, SetServerTagLine] = useState("");
  const [ServerDescription, SetServerDescription] = useState("");
  const [AlertError, SetAlertError] = useState("");
  const [Toaster, SetToaster] = useState({});
  const [choosen, setChoosen] = useState();
  const [join, setJoin] = useState();
  const [create, setCreate] = useState();
  const [discover, setDiscover] = useState();
  const [detail, setDetail] = useState();
  const [ServerView, SetServerView] = useState();
  const [DiscoverData, setDiscoverData] = useState([]);
  const [JoinData, setJoinData] = useState({});
  const [SelectedServerDetail, SetSelectedServerDetail] = useState({});
  const [SelectedServer, setSelectedServer] = useState("");
  const chatRoomRef = useRef(null);

  //CALLED FIRST TIME ONCE
  useEffect(() => {
    //INNITILIZE POPUP ELEMENT TO USESTATE
    setChoosen(document.getElementById("choosen"));
    setJoin(document.getElementById("join"));
    setCreate(document.getElementById("create"));
    setDiscover(document.getElementById("discover"));
    setDetail(document.getElementById("detail"));
    SetServerView(document.getElementById("server-view"));

    if (!win.getItem("token")) {
      window.location = "/login";
    } else {
      SetupSocket();


      //GETTING ALL DATA - LOADING SHOULD BE HERE
      const hit = hit_getWebData(win.getItem("token"));
      hit
        .then((data) => {
          setUserData(data.data);
          SetWebData(data.data)
        })
        .catch((err) => {
          console.log(err);
        });
        
    }
    // eslint-disable-next-line
  }, [win]);

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
      SetToaster({
        message: "Socket Disconnected!",
        type: "Error",
      });
    });

    newSocket.on("connect", () => {
      SetToaster({
        message: "Socket Connected!",
        type: "Success",
      });
    });
    // Mengatur SetToaster menjadi null setelah 5 detik
    setTimeout(() => {
      SetToaster({
        message: "",
        type: "null",
      });
    }, 2000);

    setSocket(newSocket);
  }

  //SERVER MANAGEMENT
  function CreateServer() {
    hit_createServer(
      win.getItem("token"),
      ServerName,
      ServerTagLine,
      ServerDescription
    )
      .then((data) => {
        
        // Tambahkan data baru ke dalam currentData
        WebData.server_data.push(data.data.data);
        ClosePopup();
        console.log(data);
      })
      .catch((err) => {
        SetAlertError(err.response.data.message);
      });
  }
  function LeaveServer(serverdata) {
    hit_leaveServer(win.getItem("token"), serverdata._id)
      .then((data) => {


        SetWebData((prevWebData) => ({
          ...prevWebData,
          server_data: prevWebData.server_data.filter((server) => server._id !== serverdata._id)
        }));

      })
      .catch((err) => {
        console.log(err);
      });
  }
  function JoinServer() {
    hit_joinServer(win.getItem("token"), JoinData._id)
      .then((data) => {
        //PUSHING NEW SERVER TO WEBDATA.SERVER_DATA ARRAY
        SetWebData((prevWebData) => ({
          ...prevWebData, //GETTING WEBDATA PREVIOUSLY DATA
          server_data: [...prevWebData.server_data, data.data.server] 
        }));

      })
      .catch((err) => {
        console.log(err);
      });
    ClosePopup();
  }
  function SelectServer(id) {
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
  
    setSelectedServer(id);

    //CALL LOADCHAT FUNCTION IN CHATROOM.JS
    chatRoomRef.current.loadChat(id);
  }

  //POPUP MANAGEMENT
  function OpenChoosen() {
    ClosePopup();
    choosen.classList.remove("hidden");
  }
  function OpenJoin() {
    ClosePopup();
    join.classList.remove("hidden");
  }
  function OpenDiscover() {
    ClosePopup();
    discover.classList.remove("hidden");

    hit_discover(win.getItem("token")).then((data) => {
      console.log(data.data.data);
      setDiscoverData(data.data.data);
    });
  }
  function OpenDetail(selectedJoin) {
    setJoinData(selectedJoin);
    ClosePopup();
    detail.classList.remove("hidden");
  }
  function OpenCreate() {
    ClosePopup();
    create.classList.remove("hidden");
  }
  function ClosePopup() {
    choosen.classList.add("hidden");
    join.classList.add("hidden");
    create.classList.add("hidden");
    discover.classList.add("hidden");
    detail.classList.add("hidden");
    SetAlertError("");
    SetServerName("");
    SetServerTagLine("");
    SetServerDescription("");
  }

  //SERVER VIEW MANAGEMENT
  function HandlerServerView(set) {
    if (set === true) {
      ServerView.classList.remove("hidden");

      hit_getServerMember(win.getItem("token"), SelectedServerDetail._id)
        .then((data) => {
          console.log(data.data);
          SetMemberData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      ServerView.classList.add("hidden");
    }
  }

  //LISTENER RIGHT CLICK
  function HandleRightServerDetail(event, data) {
    event.preventDefault();
    SetSelectedServerDetail(data);

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

  return (
    <div>
      <div className="container-full home-page">
        <div className="list-container">
          {<Profil userData={userData} />}
          {<SearchMessageRoom />}
          {
            <ServerRoom
              WebData={WebData}
              HandleRightServerDetail={HandleRightServerDetail}
              SelectServer={SelectServer}
            />
          }
          {<Header OpenChoosen={OpenChoosen} />}
        </div>
        {<ChatRoom SelectedServer={SelectedServer} WebData={WebData} ref={chatRoomRef} Socket={Socket} />}
        {<Notification Toaster={Toaster} />}

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
                    <div className="name">{userData.user_name}'s Server</div>
                    <div className="tagline">Server Tagline</div>
                  </div>
                </div>

                <div className="input-form">
                  {AlertError !== "" ? (
                    <div className="alert-form danger">
                      <p>{AlertError}</p>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <label htmlFor="servername">Name*</label>
                  <input
                    type="text"
                    id="servername"
                    value={ServerName}
                    onChange={(e) => SetServerName(e.target.value)}
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="servertagline">Tagline</label>
                  <input
                    type="text"
                    id="servertagline"
                    value={ServerTagLine}
                    onChange={(e) => SetServerTagLine(e.target.value)}
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="serverdescription">Description</label>
                  <textarea
                    placeholder="Description"
                    type="text"
                    id="serverdescription"
                    value={ServerDescription}
                    onChange={(e) => SetServerDescription(e.target.value)}
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
                {DiscoverData.map((row, index) => (
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
                <h1>{JoinData.name}</h1>
                <p>Dicovery new server</p>
              </div>
              <div className="menu-content join-content">
                <img src={JoinData.image_url} alt="" />
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

          <div className="full-menu server-view hidden" id="server-view">
            <div className="server-detail">
              <img src={SelectedServerDetail.image_url} alt="" />
              <div className="detail">
                <h1>{SelectedServerDetail.name}</h1>
                <h4>{SelectedServerDetail.tag_line}</h4>
                <p>{SelectedServerDetail.description}</p>
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
                <p>{SelectedServerDetail.name}</p>
              </div>
              <div className="line"></div>
              <div className="item">
                <p>Server Detail</p>
              </div>
              <div className="item">
                <p>Notification</p>
              </div>
              <div
                onClick={(e) => LeaveServer(SelectedServerDetail)}
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
