import { React, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";
import adventure from "../Assets/Img/Application/adventure.png";
import weather from "../Assets/Img/Application/weather.png";
import {
  hit_createServer,
  hit_discover,
  hit_getAllServer,
  hit_getServerMember,
  hit_joinServer,
  hit_leaveServer,
  hit_logout,
} from "../Api";

function Home() {
  let win = sessionStorage;
  let [userData, setUserData] = useState({
    user_name: "",
    server_data: [
      {
        image_url: "",
      },
    ],
  });

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

  useEffect(() => {
    setChoosen(document.getElementById("choosen"));
    setJoin(document.getElementById("join"));
    setCreate(document.getElementById("create"));
    setDiscover(document.getElementById("discover"));
    setDetail(document.getElementById("detail"));
    SetServerView(document.getElementById("server-view"));

    if (!win.getItem("token")) {
      window.location = "/login";
    } else {
      const hit = hit_getAllServer(win.getItem("token"));

      hit
        .then((data) => {
          // console.log(data.data);
          setUserData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [win]);

  //-----------------------------------------------------------Create Server
  const [ServerName, SetServerName] = useState("");
  const [ServerTagLine, SetServerTagLine] = useState("");
  const [ServerDescription, SetServerDescription] = useState("");
  function CreateServer() {
    hit_createServer(
      win.getItem("token"),
      ServerName,
      ServerTagLine,
      ServerDescription
    )
      .then((data) => {
        //salind sever data
        const currentData = [...userData.server_data];

        // Tambahkan data baru ke dalam currentData
        currentData.push(data.data.data);

        // Update state dengan data yang sudah diperbarui
        setUserData((prevUserData) => ({
          ...prevUserData, // Pertahankan properti user_name yang tidak berubah
          server_data: currentData, // Perbarui properti server_data
        }));
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
        //salind sever data
        const currentData = [...userData.server_data];
        console.log(currentData);
        console.log(data.data);
        const newData = currentData.filter(
          (item) => item._id !== serverdata._id
        );

        setUserData((prevUserData) => ({
          ...prevUserData, // Pertahankan properti user_name yang tidak berubah
          server_data: newData, // Perbarui properti server_data
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //--------------------------------------------------------------LOGOUT
  function logoutHandler() {
    hit_logout(win.getItem("token"))
      .then(() => {
        win.removeItem("token");
        window.location = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function JoinServer() {
    hit_joinServer(win.getItem("token"), JoinData._id)
      .then((data) => {
        console.log(data);
        //salind sever data
        const currentData = [...userData.server_data];

        // Tambahkan data baru ke dalam currentData
        currentData.push(data.data.server);

        // Update state dengan data yang sudah diperbarui
        setUserData((prevUserData) => ({
          ...prevUserData, // Pertahankan properti user_name yang tidak berubah
          server_data: currentData, // Perbarui properti server_data
        }));
      })
      .catch((err) => {
        console.log(err);
      });
    ClosePopup();
  }

  // ------------------------------------------------------------INI POPUP
  const [AlertError, SetAlertError] = useState("");
  const [choosen, setChoosen] = useState();
  const [join, setJoin] = useState();
  const [create, setCreate] = useState();
  const [discover, setDiscover] = useState();
  const [detail, setDetail] = useState();
  const [ServerView, SetServerView] = useState();
  const [DiscoverData, setDiscoverData] = useState([]);
  const [JoinData, setJoinData] = useState({});
  const [MemberData, SetMemberData] = useState({
    TotalMember: 1,
    Members: [],
  });
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

  const [SelectedServerDetail, SetSelectedServerDetail] = useState({});
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

  //when click outside rightclick area
  window.addEventListener("click", function () {
    let serverDetail = document.getElementById("server-detail");
    serverDetail.classList.add("hidden");
  });
  return (
    <div>
      <div className="container-full home-page">
        <div className="list-container">
          <div className="profil-bar">
            <img
              className="profil-display"
              src={userData.user_image}
              alt="server"
            />
            <div className="profil-data">
              <p className="username">{userData.user_name}</p>
              <p className="description">Do not disturb</p>
            </div>
            <FontAwesomeIcon
              onClick={logoutHandler}
              className="icon"
              icon={faEllipsisV}
            />
          </div>
          <div className="search-bar">
            <FontAwesomeIcon className="icon" icon={faSearch} />
            <input type="text" placeholder="Find a conversation" />
            <FontAwesomeIcon className="icon" icon={faFilter} />
          </div>
          <div className="room-bar">
            <div className="server-list">
              {userData.server_data.map((row, index) => (
                <div
                  className="server-item unselected"
                  onContextMenu={(e) => HandleRightServerDetail(e, row)}
                  key={index}
                >
                  <div className="bubble">
                    <img
                      src={row.image_url}
                      alt=""
                      className="server-display"
                    />
                    <div className="server-data">
                      <h1>{row.name}</h1>
                      <p>{row.description}</p>
                    </div>
                  </div>
                  <div className="selected-area"></div>
                </div>
              ))}

              {/* <div className="server-item selected">
                <div className="bubble">
                  <img src="" alt="" className="server-display" />
                  <div className="server-data">
                    <h1>Uwwow</h1>
                    <p>There is no message yet</p>
                  </div>
                </div>
                <div className="selected-area"></div>
              </div>
              <div className="server-item unselected">
                <div className="bubble">
                  <img src="" alt="" className="server-display" />
                  <div className="server-data">
                    <h1>Uwwow</h1>
                    <p>There is no message yet</p>
                  </div>
                </div>
                <div className="selected-area"></div>
              </div>
              <div className="server-item unselected">
                <div className="bubble">
                  <img src="" alt="" className="server-display" />
                  <div className="server-data">
                    <h1>Uwwow</h1>
                    <p>There is no message yet</p>
                  </div>
                </div>
                <div className="selected-area"></div>
              </div> */}
            </div>
          </div>
          <div className="top-bar">
            <div className="server-name">BUBBLEBOX</div>
            <div className="server-description">Lorem ipsum dolor sit</div>
          </div>
          {/* --------absolute--------- */}
          <div className="server-top">
            <div className="earth"></div>
            <div onClick={OpenChoosen} className="discover"></div>
          </div>
        </div>
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
