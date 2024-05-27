import React, { useEffect } from "react";
import "./contact.css"
import Main from "./Main";
import { useState } from "react";




const Contacts=({changeactive,change,setmsgsent,msgsent,setcontacts,currenthold,contacts,changechat,setcurrentchat,currentchat,setshowmyprofile,showmyprofile})=>{
    const [prevtouched,setprevtouched]=useState();
    const [presentcontacts,setpresentcontacts]=useState([]);
    const [presentstatus,setpresentstatus]=useState([])
    
const scrolldownhandler=()=>{
  let element=document.getElementById("messagecontainer");
  console.log(element)
  if(element){
    console.log(element.scrollHeight)
    
    element.scrollTop=element.scrollHeight;
  }
}
useEffect(()=>{
if(currentchat!==null){
  console.log("selectedchat")
console.log(currentchat)
scrolldownhandler();
}
},[currentchat])

    useEffect(() => {
        const getMessages = async () => {
          let local;
          let cons;
          let promises = [];
      
          if (contacts.length > 0) {
            if (localStorage.getItem("chat with favos")) {
              local = JSON.parse(localStorage.getItem("chat with favos"));
            }
            cons = [...contacts];
            console.log("i think msg recieved")
            console.log(cons);
      
            if (local && contacts.length > 0) {
              promises = cons.map(async (user) => {
                try {
                  console.log("fecthing users data")
                  const data = await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/search`, {
                    method: "POST",
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      userid: local._id,
                      selectedid: user._id,
                    })
                  });
      
                  if (data.ok) {
                    const result = await data.json();
                    console.log("data is", result);
      
                    if (result.msg === "success") {
                      user.lastmessage = result.lastmessage;
                      user.unseenmessages=result.unseenmessages;
                    } else {
                      user.lastmessage = null;
                    }
                  } else {
                    user.lastmessage = null;
                  }
                } catch (error) {
                  console.error("Error fetching messages:", error);
                  user.lastmessage = null;
                }
              });
            }
          }
      
          await Promise.all(promises);
          setpresentcontacts([...cons]);
          scrolldownhandler()
          
        };
      
        if (contacts.length > 0) {
          getMessages();
        }
      }, [contacts, msgsent,change]);
      useEffect(()=>{
      console.log("present contacts are")
        console.log(presentcontacts);
      }
      ,[presentcontacts]
    )
      useEffect(()=>{
        let users=[]
        let promises=[]
        let contactinfo=[...contacts]
        console.log("i am running")
        const activestatus=async()=>{
  
          if(contacts.length===0){
            return;
          }
         promises=contactinfo.map(async(user)=>{
            console.log("ids")
            console.log(user._id)
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/getuser/${user._id}`);
            data=await data.json();
            console.log("currents")
            if(data){
              user.isactive=data.user.isactive;
            }
            console.log(data);
          })
  
          await Promise.all(promises);
        
            
              setpresentstatus([...contactinfo]);
            
         
        }
        if(contacts.length>0){
        activestatus();
        }
  
       
      },[contacts,changeactive])
     
      
    useEffect(()=>{
    if(presentstatus.length>0 && presentstatus.length===contacts.length){
        console.log("present cons");
        console.log(presentstatus)
        
    }
    },[presentstatus])
  
   
    const selecthandler=(uid)=>{
        
    if(prevtouched){
        prevtouched.classList.remove("touched")
    }
    let current=document.getElementById(uid);
     let current2=current.querySelector(".currentholdwrapper");
    
     if(current2){
          current2.classList.add("touched");
          setprevtouched(current2);
     }
    }
   
    return(
        <div className="contacts-wrapper">
            <Main/>
            <div className="center" id="center">
            <div className="currentholdwrapper" onClick={()=>{
                setcurrentchat(currenthold)
            let element=document.querySelector(".touched");
            if(element){
                element.classList.remove("touched")
            }
                }}>
                  <div className="img-wrapper">
                <img className="imagee" src={currenthold.avatarimage?.startsWith("uploads")?`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/${currenthold.avatarimage}`:currenthold.avatarimage}/>
                </div>
                <div className="textwrapper">
                <div className="username">{currenthold.username}</div>
                <div>your profile</div>
                </div>
               
                </div>
                </div>
               <div className="usertext">users</div> 
               <div className="allusers">
                {contacts && contacts.map((user,index)=>{
                    let dateObject=null;
                    let hours=null;
                    let minutes=null;
                    let formattedTime=null;
                    
                    if(presentcontacts.length>0 && presentcontacts[index]?.lastmessage?.timestamps){
            dateObject = new Date(presentcontacts[index].lastmessage.timestamps);
          hours = dateObject.getUTCHours();
         minutes = dateObject.getUTCMinutes();
         formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
                    }

                    return(
                    <div className="center" onClick={()=>{selecthandler(user._id);changechat(user)}} key={user._id} id={user._id}>
                    <div className="currentholdwrapper">
                      <div className="img-wrapper">
                        <img className="imagee" src={user.avatarimage.startsWith("uploads")?`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/${user.avatarimage}`:user.avatarimage}/>
                        <div className={presentstatus.length>0 && presentstatus[index]?.isactive===true?"active":"inactive"}></div>
                        </div>
                        <div className="textwrapper">
                            <div className="userwrapper">
                        <div className="username">{user.username}</div>
                        <div className="timestamps">{formattedTime?formattedTime:""}</div>
                        
                        </div>
                        <div className="lastmsg">
                          <div className="first">{presentcontacts.length>0?presentcontacts[index]?.lastmessage?.txt ||"say hello👋" :"say hello👋"}</div>
                          {presentcontacts.length>0 && (presentcontacts[index]?.unseenmessages)>0?<div className="last">{presentcontacts[index]?.unseenmessages}</div>:null}
                          </div>
                        </div>
                        </div>
                        </div>
                )})}

               </div>
        
        </div>
    )
}

export default Contacts;