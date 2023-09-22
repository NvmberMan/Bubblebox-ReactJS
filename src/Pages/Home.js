import {React, useEffect, useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane as faPlane } from "@fortawesome/free-solid-svg-icons";
import adventure from "../Assets/Img/Application/adventure.png";
import weather from "../Assets/Img/Application/weather.png";

function Home() {
  let [choosen, setChoosen] = useState();
  let [join, setJoin] = useState();
  let [create, setCreate] = useState();
  let [discover, setDiscover] = useState();
  let [detail, setDetail] = useState();
  // let imgDummy =
  //   "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/10/28064854/12.-Tips-Merawat-Anak-Kucing-Munchkin.jpg";
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

  function OpenChoosen(){
    ClosePopup();
    choosen.classList.remove("hidden");
  }
  function OpenJoin(){
    ClosePopup();
    join.classList.remove("hidden");
  }
  function OpenDiscover(){
    ClosePopup();
    discover.classList.remove("hidden");
  }
  function OpenDetail(){
    ClosePopup();
    detail.classList.remove("hidden");
  }
  function OpenCreate(){
    ClosePopup();
    create.classList.remove("hidden");
  }

  
  function ClosePopup(){
    choosen.classList.add("hidden");
    join.classList.add("hidden");
    create.classList.add("hidden");
    discover.classList.add("hidden");
    detail.classList.add("hidden");
  }

  useEffect(() => {
     setChoosen(document.getElementById("choosen"));
     setJoin(document.getElementById("choosen"));
     setCreate(document.getElementById("choosen"));
     setDiscover(document.getElementById("choosen"));
     setDetail(document.getElementById("choosen"));
  }, []);

  return (
    <div>
      <div className="container-full home-page">
        <div className="list-container">
          <div className="profil-bar">
            <img className="profil-display" alt="" />
            <div className="profil-data">
              <p className="username">NumberMan</p>
              <p className="description">Do not disturb</p>
            </div>
            <FontAwesomeIcon className="icon" icon={faEllipsisV} />
          </div>
          <div className="search-bar">
            <FontAwesomeIcon className="icon" icon={faSearch} />
            <input type="text" placeholder="Find a conversation" />
            <FontAwesomeIcon className="icon" icon={faFilter} />
          </div>
          <div className="room-bar">
            <div className="server-list">
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
              <div className="server-item selected">
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
              </div>
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
                <div key={`chat-${index}`} id={`chat-${index}`} className={`chat-item ${item.yours ? "yours" : ""}`}>
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
                <FontAwesomeIcon onClick={ClosePopup} className="exit icon" icon={faXmark} />
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
                <div onClick={OpenChoosen} className="back">Back</div>
                <div className="button">Join</div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon onClick={ClosePopup} className="exit icon" icon={faXmark} />
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
                    <div className="name">Rangga's Server</div>
                    <div className="tagline">Server Tagline</div>
                  </div>
                </div>
                <div className="input-form">
                  <label htmlFor="">Name*</label>
                  <input placeholder="HSJGLSI" type="text" name="" id="" />
                </div>
                <div className="input-form">
                  <label htmlFor="">Tagline</label>
                  <input
                    placeholder="Server Tagline"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="">Description</label>
                  <textarea
                    placeholder="Description"
                    type="text"
                    name=""
                    id=""
                  />
                </div>
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenChoosen} className="back">Back</div>
                <div className="button">Create</div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon onClick={ClosePopup} className="exit icon" icon={faXmark} />
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
                <div className="list">
                  <div onClick={OpenDetail} className="preview-item " >
                    <div className="preview-image">
                      <img src="" alt="" />
                    </div>
                    <div className="data">
                      <div className="name">Rangga's Server Top</div>
                      <div className="tagline">Server Tagline</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenChoosen} className="back">Back</div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon onClick={ClosePopup} className="exit icon" icon={faXmark} />
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
                <h1>Uwoww's Server</h1>
                <p>Dicovery new server</p>
              </div>
              <div className="menu-content join-content">
                <img src="" alt="" />
              </div>
              <div className="menu-footer double-button">
                <div onClick={OpenDiscover} className="back">Back</div>
                <div onClick={ClosePopup} className="button">Join</div>
              </div>
              <div className="menu-absolute">
                <FontAwesomeIcon onClick={ClosePopup} className="exit icon" icon={faXmark} />
              </div>
            </div>
            <div onClick={ClosePopup} className="closepopup"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
