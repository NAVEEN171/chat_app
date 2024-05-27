import React from "react";
import "./messagewrapper.css"
import EmojiPicker from 'emoji-picker-react'
import {Fragment} from "react";
import Mainprofile from "../drawers/mainprofile";

const Messageswrapper=({bgimg,currentchatmsgs})=>{
    console.log(bgimg)
        return(
            <Fragment>
            <div  className="messages" id="messages" style={{backgroundImage:`url(${bgimg})`}}>
            <div  id="messagecontainer"  className="messageswrapper">
                {(currentchatmsgs.length>0) && currentchatmsgs.map((current,index)=>{
                      const dateObject = new Date(current.timestamps);
                      const hours = dateObject.getUTCHours();
                      const minutes = dateObject.getUTCMinutes();
                      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                          return(
            <div id={(index===0)?"first":""}key={current.uid}className={"mss"}><div className={current.send===true?"sender msgs":"reciever msgs"}><div className="txt">{current.txt}</div>
                    <div className="time">{formattedTime}</div></div></div>);
             })}

                </div></div>
               
            
            </Fragment>
        )  
}
export default Messageswrapper;