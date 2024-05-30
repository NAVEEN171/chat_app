import React, { useEffect } from "react";
import "./contact.css"
import Main from "./Main";
import { useState } from "react";




const Contacts=({scrolldown,changeactive,setchangeactive,change,setmsgsent,msgsent,setcontacts,currenthold,contacts,changechat,setcurrentchat,currentchat,setshowmyprofile,showmyprofile})=>{
    const [prevtouched,setprevtouched]=useState(null);
    const [presentcontacts,setpresentcontacts]=useState([]);
    const [originalcontacts,setoriginalcontacts]=useState([]);
    const [presentstatus,setpresentstatus]=useState([]);
    const [search,setsearch]=useState("");
    const [take,settake]=useState(0);
    
const scrolldownhandler=()=>{
  let element=document.getElementById("messagecontainer");
  console.log(element)
  if(element){
    console.log(element.scrollHeight)
    
    
    element.scrollTop=element.scrollHeight;
  }
}

useEffect(()=>{
       if(search!=="" && contacts.length>0){
        console.log("search is ",search)
             let cons=[...contacts]
           
             
             let filteredarray=cons.filter((contact)=>contact.username.toLowerCase().includes(search.toLowerCase()));
             if(filteredarray.length>0){
              console.log("Filtered contacts:", filteredarray); // Log the filtered contacts

              setcontacts(filteredarray);
             }
             else{
              setcontacts([]);
             }
       }
        else if(search!=="" && contacts.length===0){
             let cons=[...originalcontacts]
           
             
             let filteredarray=cons.filter((contact)=>contact.username.toLowerCase().includes(search.toLowerCase()));
             if(filteredarray.length>0){
              console.log("Filtered contacts:", filteredarray); // Log the filtered contacts

              setcontacts(filteredarray);
             }
        }
       else{
        setcontacts(originalcontacts)
       }
},[search])
useEffect(()=>{
if(scrolldown!==null){
  setTimeout(()=>{scrolldownhandler()},100);
}

},[scrolldown])
useEffect(()=>{
  if(contacts.length>0 && take===0){
    setoriginalcontacts(contacts);
    console.log("original contacts");
    console.log(originalcontacts);
    settake(1);
  }
},[contacts]
)
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
                      'Content-Type': 'application/json',
                      'x-user-id':currenthold._id

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
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/getuser/${user._id}`,  {method:"GET",
            headers:{
                'Content-Type':'application/json',
                'x-user-id':currenthold._id
       
            }
        });
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
  
   const clearmessages=(index)=>{
    if(window.innerWidth<=600){
    let container=document.getElementById("containerwrapper");
    let contactswrapper=document.getElementById("contactswrapper");
    if(container){
      contactswrapper.style.display="none";
      container.style.display="block";

    }
  }
          
         if(presentcontacts.length>0 && presentcontacts[index].unseenmessages>0){
          console.log("concs are")
          let concs=[...presentcontacts];
          console.log(concs)
          concs[index].unseenmessages=0;
          console.log("after");
          console.log(concs)
          setpresentcontacts(concs);
          setchangeactive(!changeactive)
         }
   }
    const selecthandler=(index)=>{
        
    setprevtouched(index)
    }
   
    return(
        <div className="contacts-wrapper" id="contactswrapper">
            <Main/>
            <div className="center" id="center">
            <div className="currentholdwrapper" onClick={()=>{
                setcurrentchat(currenthold)
                if(window.innerWidth<=600){  
                  let container=document.getElementById("containerwrapper");
        let contactswrapper=document.getElementById("contactswrapper");
        if(container){
          contactswrapper.style.display="none";
          container.style.display="block";
    
        }
      }
            let element=document.querySelector(".touched");
            if(element){
                element.classList.remove("touched")
            }
                }}>
                  <div className="img-wrapper">
                <img className="imagee" src={currenthold.avatarimage?currenthold.avatarimage:"https://cdn4.iconfinder.com/data/icons/user-people-2/48/6-1024.png"}/>
                </div>
                <div className="textwrapper">
                <div className="username">{currenthold.username}</div>
                <div>your profile</div>
                </div>
               
                </div>
                </div>
               <div className="usertext">users</div> 
               <div className="changeinput">
               <input className="inputname" value={search} onChange={(e)=>{setsearch(e.target.value)}}  placeholder="search..."></input>
               </div>
           { (contacts.length>0 ) &&   <div className="allusers">
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
                    <div className="center" onClick={()=>{selecthandler(user._id);changechat(user);clearmessages(index)}} key={user._id} id={user._id}>
                    <div className={user._id===prevtouched?"currentholdwrapper touched":"currentholdwrapper"}>
                      <div className="img-wrapper">
                        <img className="imagee" src={user.avatarimage?user.avatarimage:"https://cdn4.iconfinder.com/data/icons/user-people-2/48/6-1024.png"}/>
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

               </div>}
               {(contacts.length===0 && search!=="") && 
               <div className="allusersalt">
              <div>no results found</div> 
              </div>
               }
        
        </div>
    )
}

export default Contacts;
