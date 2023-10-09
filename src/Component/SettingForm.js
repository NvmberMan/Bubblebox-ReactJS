import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  faLaptop,
  faPencil,
  faUser,
  faQuestion,
  faMessage,
  faBell,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiURL, hit_updateUserProfil } from "../Api";

const SettingForm = forwardRef((props, ref) => {
  let win = sessionStorage;
  const [accountData, setAccountData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    user_image: "",
  });
  const [profilImage, setProfilImage] = useState("");
  const usernameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);

  const [generalElement, setGeneralElement] = useState();
  const [accountElement, setAccountElement] = useState();

  const [generalButton, setGeneralButton] = useState();
  const [accountButton, setAccountButton] = useState();

  useEffect(() => {
    setAccountData({
      user_name: props.webData.user_name,
      user_email: props.webData.user_email,
      user_phone: props.webData.user_phone,
      user_image: null,
    });
    setProfilImage(apiURL + "/user/profil/" + props.webData.user_image);

    setGeneralElement(document.getElementById("admin-general"));
    setAccountElement(document.getElementById("admin-account"));

    setGeneralButton(document.getElementById("general-button"));
    setAccountButton(document.getElementById("account-button"));
  }, [
    props.webData.user_email,
    props.webData.user_image,
    props.webData.user_name,
    props.webData.user_phone,
  ]);

  const settingForm = document.getElementById("setting-form");

  //FOR OPENTING THIS FORM - CALLED FROM HOME.JS
  function openSettingForm() {
    settingForm.classList.remove("hidden");
  }
  function closeSettingForm() {
    settingForm.classList.add("hidden");
  }

  //SELECTING SIDEBAR ITEM
  function selectGeneral() {
    unSelectAll();
    generalElement.classList.remove("hidden");
    generalButton.classList.add("selected");
  }
  function selectAccount() {
    unSelectAll();
    accountElement.classList.remove("hidden");
    accountButton.classList.add("selected");
  }

  //UNSELECT ALL SIDEBAR ITEMS
  function unSelectAll() {
    generalElement.classList.add("hidden");
    accountElement.classList.add("hidden");

    generalButton.classList.remove("selected");
    accountButton.classList.remove("selected");
  }

  //CHANGE ALERT CLASS FOR UNSAVE NOTIFICATION
  function openSavingAlert() {
    document.getElementById("unsave-notification").classList.remove("hidden");
  }
  function closeSavingAlert() {
    document.getElementById("unsave-notification").classList.add("hidden");
  }

  //RESET ALL INPUT FIELD TO DEFAULT OR WEBDATA
  function resetSaving() {
    closeSavingAlert();
    setAccountData({
      user_name: props.webData.user_name,
      user_email: props.webData.user_email,
      user_phone: props.webData.user_phone,
      user_image: null,
    });
    setProfilImage(apiURL + "/user/profil/" + props.webData.user_image);
  }

  //APPLY UPDATING DATA TO DATABASE
  function applyProfil() {
    hit_updateUserProfil(
      win.getItem("token"),
      accountData.user_name,
      accountData.user_phone,
      accountData.user_email,
      accountData.user_image
    )
      .then((data) => {
        closeSavingAlert();
        props.updateUserProfil(
          data.data.username,
          data.data.phone_number,
          data.data.email,
          data.data.image_url
        );
        
      })
      .catch((err) => {
        alert(err);
      });


    console.log(accountData);

  }

  //CALLED FROM INPUT FIELD WHEN VALUE IS CHANGED
  function onChangeUsername(event) {
    event.preventDefault();
    setAccountData({
      ...accountData,
      user_name: event.target.value,
    });
    setTimeout(() => {
      if (usernameInputRef.current) {
        usernameInputRef.current.focus();
      }
    }, 50);

    openSavingAlert();
  }
  function onChangePhoneNumber(event) {
    event.preventDefault();
    setAccountData({
      ...accountData,
      user_phone: event.target.value,
    });
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    }, 50);

    openSavingAlert();
  }
  function onChangeEmail(event) {
    event.preventDefault();
    setAccountData({
      ...accountData,
      user_email: event.target.value,
    });
    setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    }, 50);

    openSavingAlert();
  }

  //CHANGE USER PROFIL IMAGE MANAGER
  function clickUserInputImage() {
    const inputFile = document.getElementById("input-user-image");
    inputFile.click();
  }
  function selectUserInputImage(e) {
    e.preventDefault();
    const inputFile = document.getElementById("input-user-image");
    const selectedFile = inputFile.files[0];

    if (selectedFile) {
      const allowedImageTypes = ["image/jpeg", "image/png", "image/gif"]; // Tipe MIME gambar yang diizinkan

      if (allowedImageTypes.includes(selectedFile.type)) {
        // Tipe MIME sesuai dengan yang diizinkan
        const imageUrl = URL.createObjectURL(selectedFile);
        setAccountData({
          ...accountData,
          user_image: selectedFile
        });
        setProfilImage(imageUrl);
        openSavingAlert();
      } else {
        // Tipe MIME tidak sesuai dengan yang diizinkan
        console.log("File yang diunggah bukan gambar.");
        // Tampilkan pesan kesalahan kepada pengguna atau lakukan tindakan yang sesuai.
      }
    }
  }

  //ALL FUNCTION INSIDE THIS METHOD CALLED BY HOME.JS
  useImperativeHandle(ref, () => ({
    openSetting() {
      openSettingForm();
    },
  }));

  return (
    <div className="admin-form" id="setting-form">
      <div className="admin-nav">
        <div className="backbutton" onClick={closeSettingForm}>
          <FontAwesomeIcon className="icon" icon={faArrowLeft} />
          Back
        </div>
        <p className="selected" onClick={selectGeneral} id="general-button">
          <FontAwesomeIcon className="icon" icon={faLaptop} />
          General
        </p>
        <p onClick={selectAccount} id="account-button">
          <FontAwesomeIcon className="icon" icon={faUser} />
          Account
        </p>
        <p>
          <FontAwesomeIcon className="icon" icon={faMessage} />
          Chats
        </p>
        <p>
          <FontAwesomeIcon className="icon" icon={faBell} />
          Notifications
        </p>
        <p>
          <FontAwesomeIcon className="icon" icon={faPencil} />
          Personalization
        </p>
        <p>
          <FontAwesomeIcon className="icon" icon={faQuestion} />
          Helps
        </p>
      </div>
      <div className="forms">
        <div className="admin-page admin-general" id="admin-general">
          <div className="title">
            <h1>General</h1>
          </div>
          <div className="input-form">
            <label htmlFor="">Language</label>
            <select name="" id="">
              <option value="">English</option>
              <option value="">Indonesia</option>
            </select>
          </div>
        </div>
        <div className="admin-page admin-account hidden" id="admin-account">
          <div className="title">
            <h1>Account</h1>
          </div>

          <h3>User Profil</h3>
          <div className="form-row admin-profile">
            <div className="input-form">
              <div className="user-display" onClick={clickUserInputImage}>
                <img
                  className="user-image"
                  id="user-image"
                  src={profilImage}
                  alt=""
                />

                <div className="user-display-hover">
                  <FontAwesomeIcon className="icon" icon={faPencil} />
                </div>
                <input
                  type="file"
                  onChange={(e) => selectUserInputImage(e)}
                  className="input-user-image"
                  id="input-user-image"
                />
              </div>
            </div>
            <div>
              <div className="form-row ">
                <div className="input-form ">
                  <label htmlFor="">Username</label>
                  <input
                    type="text"
                    onChange={(e) => onChangeUsername(e)}
                    key={accountData.user_name}
                    ref={usernameInputRef}
                    value={accountData.user_name}
                  />
                </div>
                <div className="input-form">
                  <label htmlFor="">Phone Number</label>
                  <input
                    type="text"
                    onChange={(e) => onChangePhoneNumber(e)}
                    key={accountData.user_name}
                    ref={phoneInputRef}
                    value={accountData.user_phone}
                  />
                </div>
              </div>
              <div className="input-form">
                <label htmlFor="">Email</label>
                <input
                  type="email"
                  onChange={(e) => onChangeEmail(e)}
                  key={accountData.user_name}
                  ref={emailInputRef}
                  value={accountData.user_email}
                />
              </div>
            </div>
          </div>

          <div className="form-line"></div>
          <div className="input-form">
            <label htmlFor="">Password And Authentication</label>
            <button>Change Password</button>
          </div>
        </div>

        <div className="unsave-notification hidden" id="unsave-notification">
          <p onClick={resetSaving}>Reset</p>
          <button type="button" onClick={applyProfil}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
});

export default SettingForm;
