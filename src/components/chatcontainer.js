import React from "react";
import "./chatcontainer.css";
import { Fragment, useState, useEffect, useRef } from "react";
import Picker from "emoji-picker-react";
import Messageswrapper from "./messageswrapper";
import EmojiPicker from "emoji-picker-react";
import { IoEye } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";
import { IoMdArrowRoundBack } from "react-icons/io";

import Profileview from "../drawers/profileview";
import Mainprofile from "../drawers/mainprofile";
import io from "socket.io-client";
import Loader from "./Loader";
var socket;

const Chatcontainer = ({
  setbgimg,
  bgimg,
  changeactive,
  setcurrentchat,
  setcurrentholder,
  setcurrentroomid,
  currentroomid,
  setshowmyprofile,
  currentchat,
  currentholder,
  currentchatmsgs,
  settingmessageshandler,
  showprofile,
  setshowprofile,
  showmyprofile,
}) => {
  const [msg, setmsg] = useState("");
  const [show, setshow] = useState(false);
  const [focused, setfocused] = useState(false);
  const [msgload, setmsgload] = useState(false);
  const focushandler = () => {
    setfocused(true);
  };
  const blurhandler = () => {
    setfocused(false);
  };

  const handleKeyDown = (event) => {
    //console.log("key pressed")
    //console.log(event.key)
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action (form submission)

      sendhandler();

      let target = document.getElementById("typinginput");
      let inputelement = document.getElementById("inputwrapper");
      let inputwrapper = document.getElementById("messagewrapper");
      let messagecontainer = document.getElementById("messages");
      //console.log(messagecontainer);
      target.style.height = `40px`;
      inputelement.style.height = `60px`;
      inputwrapper.style.height = `70px`;
      messagecontainer.style.height = `calc(100dvh - 140px)`;
    }
  };

  const scrollBottom = () => {
    if (window.innerWidth <= 600) {
      let element = document.getElementById("containerwrapper");
      //console.log(element)
      if (element) {
        //console.log(element.scrollHeight);
        element.scrollTop = element.scrollHeight;
      }
    }
  };
  const messagechangehandle = (e) => {
    setmsg(e.target.value);
    //console.log(msg);
    let target = e.target;
    let inputelement = document.getElementById("inputwrapper");
    let inputwrapper = document.getElementById("messagewrapper");
    let messagecontainer = document.getElementById("messages");
    let containerwrapper = document.getElementById("containerwrapper");
    //console.log(containerwrapper)

    //console.log(messagecontainer);
    e.target.style.height = `40px`;
    inputelement.style.height = `60px`;
    inputwrapper.style.height = `70px`;

    messagecontainer.style.height = `calc(100dvh - 140px)`;
    if (target.scrollHeight < 250) {
      e.target.style.height = `${target.scrollHeight - 20}px`;
      inputelement.style.height = `${target.scrollHeight}px`;
      inputwrapper.style.height = `${target.scrollHeight + 10}px`;
      let computedStyle = window.getComputedStyle(containerwrapper);

      let heightValue = computedStyle.getPropertyValue("height");
      heightValue = parseInt(heightValue);
      //console.log(heightValue);
      //console.log(containerwrapper.style.height);
      messagecontainer.style.height = `${
        heightValue - parseInt(inputwrapper.style.height) - 70
      }px`;
    } else {
      e.target.style.height = `250px`;
      inputelement.style.height = `270px`;
      inputwrapper.style.height = `280px`;

      let computedStyle = window.getComputedStyle(containerwrapper);

      let heightValue = computedStyle.getPropertyValue("height");
      heightValue = parseInt(heightValue);
      //console.log(heightValue);

      messagecontainer.style.height = `${
        heightValue - parseInt(inputwrapper.style.height) - 70
      }px`;
      //console.log("less")
    }
    //console.log(target.scrollHeight)
  };

  const changeUI = () => {
    let container = document.getElementById("containerwrapper");
    let contacts = document.getElementById("contactswrapper");
    if (contacts) {
      contacts.style.display = "block";
      container.style.display = "none";
    }
  };
  const hasMounted = useRef(false);

  useEffect(() => {
    // Skip the effect on the first render
    if (hasMounted.current) {
      setmsgload(false);
    } else {
      hasMounted.current = true;
    }
  }, [currentchatmsgs]);

  const sendhandler = async () => {
    //console.log("running..................")

    //console.log(currentholder);
    //console.log("i am about to run");
    //console.log(currentholder._id,currentchat._id)
    //console.log(msg)
    if (msg === "") {
      return;
    }
    setmsgload(true);

    let data = await fetch(
      `${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/addmsg`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentholder._id,
        },
        body: JSON.stringify({
          txt: msg,
          from: currentholder._id,
          to: currentchat._id,
        }),
      }
    );
    if (data) {
      data = await data.json();
      /*     //console.log("current room")
        //console.log(data);
        socket=io("${process.env.REACT_APP_DEPLOYMENT_BACKEND}")

            socket.emit("joinchat",data.id);
            socket.on("connuser",()=>{//console.log("conuser")})

        if(data.id){
          setcurrentroomid(data.id)
        }*/
      //console.log("in send handler ,data is obtained");
      //console.log(data);

      settingmessageshandler(msg);
      setmsg("");

      let element = document.getElementById("typinginput");
      let inputelement = document.getElementById("inputwrapper");
      let inputwrapper = document.getElementById("messagewrapper");
      let messagecontainer = document.getElementById("messages");
      element.style.height = `40px`;
      inputelement.style.height = `60px`;
      inputwrapper.style.height = `70px`;
      messagecontainer.style.height = `calc(100dvh - 140px)`;
    }
    setmsgload(false);
  };
  const profileviewhandler = () => {
    setshowprofile(!showprofile);
  };
  const closeshowhandler = () => {
    //console.log("ruuning")
    setshow(!show);
  };
  useEffect(() => {
    //console.log("currentchat");
    //console.log(currentchat);
    setmsg("");
    setmsgload(false);
  }, [currentchat]);
  const handleemojiclick = (event, emoji) => {
    //console.log(event)
    //console.log(emoji)
    let message = msg;
    message += event.emoji;
    setmsg(message);
  };
  return (
    <div className="containerwrapper" id="containerwrapper">
      {showmyprofile && (
        <Mainprofile
          setcurrentchat={setcurrentchat}
          setcurrentholder={setcurrentholder}
          setshowmyprofile={setshowmyprofile}
          currentholder={currentholder}
        />
      )}
      {!showmyprofile && showprofile && (
        <Profileview
          bgimg={bgimg}
          setbgimg={setbgimg}
          currentholder={currentholder}
          setshowprofile={setshowprofile}
          currentchat={currentchat}
        />
      )}
      {currentchat && !showmyprofile && (
        <Fragment>
          <div className="selecteduserdetails">
            <div className="detailswrapper">
              {window.innerWidth < 600 && (
                <IoMdArrowRoundBack
                  className="backarrow"
                  onClick={() => {
                    changeUI();
                  }}
                />
              )}
              <img
                className="profilepic"
                src={
                  currentchat.avatarimage !== ""
                    ? currentchat.avatarimage
                    : "https://cdn4.iconfinder.com/data/icons/user-people-2/48/6-1024.png"
                }
              />

              <div className="username1">
                {currentchat.username}
                {currentchat === currentholder && (
                  <div className="profiledowntext">message yourself</div>
                )}
              </div>
            </div>
            <div
              className="eyeiconwrapper"
              onClick={() => {
                if (currentchat === currentholder) {
                  setshowmyprofile(!showmyprofile);
                } else {
                  profileviewhandler();
                }
              }}
            >
              <IoEye
                className="eyeicon"
                style={{
                  backgroundColor: "rgb(219, 220, 255)",
                  padding: "5px",
                  height: "25px",
                  width: "35px",
                  borderRadius: "10px",
                  flex: "flex-end",
                }}
              />
            </div>
          </div>
          <Messageswrapper bgimg={bgimg} currentchatmsgs={currentchatmsgs} />
          <div className="messagewrapper" id="messagewrapper">
            {show && (
              <div className="emojiwrapper">
                <EmojiPicker
                  emojiStyle="google"
                  onEmojiClick={handleemojiclick}
                  className="emoji-picker-react"
                />
              </div>
            )}

            <div
              className={focused ? "inputwrapper focus" : "inputwrapper"}
              id="inputwrapper"
            >
              <svg
                className="emoji"
                onClick={closeshowhandler}
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M612.489-535.385q18.665 0 31.55-13.065 12.884-13.066 12.884-31.731t-13.065-31.55q-13.066-12.884-31.731-12.884t-31.55 13.065q-12.885 13.066-12.885 31.731t13.066 31.55q13.066 12.884 31.731 12.884Zm-264.616 0q18.665 0 31.55-13.065 12.885-13.066 12.885-31.731t-13.066-31.55q-13.066-12.884-31.731-12.884t-31.55 13.065q-12.884 13.066-12.884 31.731t13.065 31.55q13.066 12.884 31.731 12.884ZM480-284.615q57.231 0 105.423-31.577 48.193-31.577 72.423-83.808H302.154q24.23 52.231 72.423 83.808Q422.769-284.615 480-284.615ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-480Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
              </svg>

              <textarea
                type="text"
                onFocus={() => {
                  focushandler();
                  scrollBottom();
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
                onBlur={blurhandler}
                id="typinginput"
                value={msg}
                onClick={() => {
                  setshow(false);
                }}
                onChange={(e) => {
                  messagechangehandle(e);
                }}
                className="message"
                placeholder="your message"
              ></textarea>
              {!msgload ? (
                <svg
                  className="sendbutton"
                  onClick={() => {
                    sendhandler();
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  height="28"
                  viewBox="0 -960 960 960"
                  width="28"
                >
                  <path d="M140.001-190.002v-579.996L828.458-480 140.001-190.002ZM200-280l474-200-474-200v147.693L416.921-480 200-427.693V-280Zm0 0v-400 400Z" />
                </svg>
              ) : (
                <div className="loaderbutton">
                  <Loader></Loader>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      )}
      {!currentchat && (
        <div className="videowrapper">
          <video className="video" loop autoPlay muted>
            <source
              src="https://gifsec.com/wp-content/uploads/2022/09/welcome-gif-24.gif"
              type="video/mp4"
            />
          </video>
        </div>
      )}
    </div>
  );
};
export default Chatcontainer;
