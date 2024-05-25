import React from "react";
import "./chatcontainer.css"
import { Fragment,useState,useEffect } from "react";
import Picker from 'emoji-picker-react'
import Messageswrapper from "./messageswrapper"
import EmojiPicker from "emoji-picker-react";
import { IoEye } from "react-icons/io5";
import { TiEdit } from "react-icons/ti";

import Profileview from "../drawers/profileview";
import Mainprofile from "../drawers/mainprofile";
import io from "socket.io-client";
var socket;





const Chatcontainer=({setbgimg,bgimg,changeactive,setcurrentchat,setcurrentholder,setcurrentroomid,currentroomid,setshowmyprofile,currentchat,currentholder,currentchatmsgs,settingmessageshandler,showprofile,setshowprofile,showmyprofile})=>{
    const [msg,setmsg]=useState("");
    const [show,setshow]=useState(false);
   const [focused,setfocused]=useState(false);
    const focushandler=()=>{
setfocused(true)
    }
    const blurhandler=()=>{
      setfocused(false);
    }
    const messagechangehandle=(e)=>{
            setmsg(e.target.value);
            console.log(msg)
    }
    const sendhandler=async()=>{
      console.log("running..................")

      console.log(currentholder);
      console.log("i am about to run");
      console.log(currentholder._id,currentchat._id)
      console.log(msg)
      
      let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/addmsg`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
            txt:msg,
            from:currentholder._id,
            to:currentchat._id
      })

    }
      )
      if(data){
        data=await data.json();
   /*     console.log("current room")
        console.log(data);
        socket=io("${process.env.REACT_APP_DEPLOYMENT_BACKEND}")

            socket.emit("joinchat",data.id);
            socket.on("connuser",()=>{console.log("conuser")})

        if(data.id){
          setcurrentroomid(data.id)
        }*/
        console.log("in send handler ,data is obtained");
        console.log(data);
        
        settingmessageshandler(msg);
        setmsg("")
      }
    

      
    }
    const profileviewhandler=()=>{
         setshowprofile(!showprofile)
    }
    const closeshowhandler=()=>{
      console.log("ruuning")
setshow(!show)
    }
    useEffect(()=>{
      console.log("currentchat");
      console.log(currentchat)
    },[currentchat])
    const handleemojiclick=(event,emoji)=>{
      console.log(event)
      console.log(emoji)
      let message=msg;
      message+=event.emoji;
      setmsg(message);

    }
    return (
      
        <div className="containerwrapper">
          {showmyprofile && <Mainprofile setcurrentchat={setcurrentchat} setcurrentholder={setcurrentholder} setshowmyprofile={setshowmyprofile} currentholder={currentholder}/>}
          {(!showmyprofile && showprofile) && <Profileview bgimg={bgimg} setbgimg={setbgimg} currentholder={currentholder} setshowprofile={setshowprofile} currentchat={currentchat}/>}
            {(currentchat && !showmyprofile) &&
            <Fragment>
            <div className="selecteduserdetails">
              <div className="detailswrapper">
            <img  className="profilepic" src={currentchat.avatarimage.startsWith("uploads")?`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/${currentchat.avatarimage}`:currentchat.avatarimage}/>
         
            <div className="username1">{currentchat.username}{currentchat===currentholder &&<div className="profiledowntext">message yourself</div> }</div></div>
            <div className="eyeiconwrapper" onClick={()=>{if(currentchat===currentholder){
            
              setshowmyprofile(!showmyprofile)
            }
            else{
              profileviewhandler()}}}>
            <IoEye  className="eyeicon" style={{backgroundColor:"rgb(219, 220, 255)",padding:"5px",height:"25px",width:"35px",borderRadius:"10px",flex:"flex-end"}}/>
            </div>
            </div>
            <Messageswrapper bgimg={bgimg} currentchatmsgs={currentchatmsgs}/>
              <div className="messagewrapper">
            {show && <div className="emojiwrapper"><EmojiPicker emojiStyle="google" onEmojiClick={handleemojiclick} className="emoji-picker-react"/></div>}

               <div className={focused?"inputwrapper focus":"inputwrapper"} >
              <svg className="emoji"  onClick={closeshowhandler} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M612.489-535.385q18.665 0 31.55-13.065 12.884-13.066 12.884-31.731t-13.065-31.55q-13.066-12.884-31.731-12.884t-31.55 13.065q-12.885 13.066-12.885 31.731t13.066 31.55q13.066 12.884 31.731 12.884Zm-264.616 0q18.665 0 31.55-13.065 12.885-13.066 12.885-31.731t-13.066-31.55q-13.066-12.884-31.731-12.884t-31.55 13.065q-12.884 13.066-12.884 31.731t13.065 31.55q13.066 12.884 31.731 12.884ZM480-284.615q57.231 0 105.423-31.577 48.193-31.577 72.423-83.808H302.154q24.23 52.231 72.423 83.808Q422.769-284.615 480-284.615ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-480Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z"/></svg>

               <input type="text"onFocus={focushandler} onBlur={blurhandler} id="typinginput" value={msg} onClick={()=>{setshow(false)}} onChange={(e)=>{messagechangehandle(e)}}  className="message" placeholder="your message"></input>
               <svg className="sendbutton" onClick={()=>{sendhandler();}} xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28"><path d="M140.001-190.002v-579.996L828.458-480 140.001-190.002ZM200-280l474-200-474-200v147.693L416.921-480 200-427.693V-280Zm0 0v-400 400Z"/></svg>

               </div>
              </div>
              </Fragment>
            }
            {!currentchat && <div className="videowrapper"><video className="video" loop autoPlay muted>
        <source src={process.env.PUBLIC_URL + '/videos/welcomegif.mp4'} type="video/mp4" />
        
      </video></div> }

        </div>
      
    
    )
}
export default Chatcontainer;