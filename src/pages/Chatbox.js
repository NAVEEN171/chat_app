import React from "react";
import "./avatar.css";
import Chatcontainer from "../components/chatcontainer";
import { useEffect,useState } from "react";
import { set } from "mongoose";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";


import Contacts from "../components/Contacts";
var socket;

const Chatbox=()=>{
    
    const [currentholder,setcurrentholder]=useState({});
    const [connsocket,setconnsocket]=useState(false);
    const [datacontent,setdatacontent]=useState([])
    const [showmyprofile,setshowmyprofile]=useState(false);
    const [onmsg,setonmsg]=useState(false);
    const [currentmsgid,setcurrentmsgid]=useState("");
    const [change,setchange]=useState(false);

    const [currentchat,setcurrentchat]=useState(null);
    const [msgss,setmsgss]=useState([]);
    const [currentroomid,setcurrentroomid]=useState(null);
    const [msgsent,setmsgsent]=useState(false);
    const [sendd,setsendd]=useState(null);
    const [contacts,setcontacts]=useState([]);
    const [showprofile,setshowprofile]=useState(false);
    const [joinedroom,setjoinedroom]=useState("");
    const [loaded,setloaded]=useState(false);
    const [changeactive,setchangeactive]=useState(false);
    const [bgimg,setbgimg]=useState("");
    const [date,setdate]=useState(new Date());
    const [futuretime,setfuturetime]=useState(null);
    console.log(date);

      const navigate=useNavigate()



      useEffect(()=>{

    let future_time=new Date(date.getTime()+ 2* 60000);

        console.log(future_time);
        console.log(future_time>date)
        setfuturetime(future_time)
      }
    ,[]);
   

        //search name of the chat and join room id using socket
    const searchname=async()=>{
        console.log(currentchat._id);
        console.log(currentholder._id);
if(joinedroom===currentchat._id+currentholder._id || joinedroom===currentholder._id+currentchat._id){
    return;
}
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/search`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    userid:currentholder._id,
                    selectedid:currentchat._id,
                })
            })
            if(data){
                data=await data.json();
                console.log("data is")
                socket.emit("join chat",data.id);
               socket.on("joinedchat",(room)=>{
                console.log(`room joined is ${room}`)
                if(room){
                    setjoinedroom(room);
                }
               })
                console.log(data)
            }
        
    }
    const changechathandler=async(chat)=>{
        console.log(chat)
                    setcurrentchat(chat)
                    setsendd(null);
            
/*
        if(currentchat!==chat){
        let data=await fetch("${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/search",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                userid:currentholder._id,
                selectedid:chat._id,
            })
        })
        if(data){
            data=await data.json();
            console.log("data is")
            console.log(data)
        }
    }*/
    }
   
    const settingmessageshandler=(newmsg)=>{
        console.log("in setting messageshandler")

        if(newmsg.length>0){
            console.log("i will fecth the data")            
                setmsgsent(!msgsent);
                console.log("in setting messageshandler")
                console.log("changed msgsent state and sendd state")
          if(sendd===null){
            setsendd(true);
          }
          else{
              setsendd(!sendd);
          }
            
        }

            
    }
   

    //if current chat changes or message sent, this will run --> fetches the msgs from DB and if message sent it 
    //will run the socket funcction "new message"
    useEffect(()=>{
        const runmsg=async()=>{
        if(currentchat!==null ){
            console.log("running msgs")
            console.log(currentchat._id);
            console.log(currentholder._id);
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/messages/getmessages`,{
                method:"POST",
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    
                      from:currentholder._id,
                      to:currentchat._id
                })
          
              }
                )
                console.log(data)
                if(data){
                data= await data.json()
                console.log(data)
                if(data.showmsgs===null){
                    setmsgss([]);
                    setbgimg("")
                    return;
                }
                let obj=Object.values(data.showmsgs);
                console.log(obj)
                let arr=[...obj]
                console.log("arr")
                console.log(arr)
               
                
                if(arr.length!==0){
                    setmsgss(arr);
                    if(sendd!==null){

                   
            
                let lastelement=data.messages[data.messages.length-1]
                console.log(lastelement)
                lastelement.send=false;
                
                socket.emit("new message",data);
                console.log("emitted new msg!!!")
                }
                    
                    
                    
                   
                    searchname()
                }
                console.log(data);
                if(data){
                console.log(data.backgroundimage);
                setbgimg(data.backgroundimage)
                }
            }
        }}
        runmsg()
        
    },[currentchat,msgsent])
    useEffect(()=>{
        if(sendd!==null && msgss.length!==0){   
           const running=async()=>{ 
           if(datacontent.length>0){
                let data=[...datacontent];
                console.log(data)
                }
       console.log("running")
                
           }
            running()

               }
       },[sendd])


   useEffect(()=>{
    if(connsocket ){
     
           
        socket.on("connuser",async(uid)=>{
            console.log(uid);
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/status/${uid}`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                  },
                  body:JSON.stringify(
                    {type:"online"}
                  )

            })
            if(data){
                data=await data.json();
                console.log(data);
                console.log("i am loki")

                setchangeactive(!changeactive);

            }
        })
        socket.on("disconn",async(useridentification)=>{
            console.log(useridentification);
            let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/status/${useridentification}`,{
                            method:"POST",
                            headers:{
                                'Content-Type':'application/json'
                              },
                              body:JSON.stringify(
                                {type:"offline"}
                              )
            
                        })
                        if(data){
                            data=await data.json();
                            console.log(data);
                            console.log("i am loki")

                setchangeactive(!changeactive);
                            
                        }
            
                        })
                    
       
        socket.on("message recieved",(message)=>{
            
           
            
            if(message.status===true && message.lastelement.uid!==currentmsgid ){
                
                console.log(`message recieved is ${message}`)
                console.log(message)
                console.log("running//");
                console.log(message.lastelement.uid)
                console.log(currentmsgid)
            setcurrentmsgid(message.lastelement.uid)
                
                
               setmsgss([...msgss,message.lastelement]);
               
               setchange(!change);
               
               

                
            }
        })
        return () => {
            socket.off('message received');
          };
 } })
 

    useEffect(()=>{
        const run=async()=>{
            
              
        if(localStorage.getItem("chat with favos")){
            const data=await JSON.parse(localStorage.getItem("chat with favos"))
            console.log("query")
        console.log(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/getuser/${data.insertedId?data.insertedId : data._id}`)
            let using=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/getuser/${data.insertedId?data.insertedId : data._id}`)
        
            using=await using.json();
            console.log(using);
            console.log(using.user);
            setcurrentholder(using.user);
            console.log("main")
            console.log(using.user._id)
            socket=io(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}`,{
                reconnection:false,
            })
            //user connecting to socket
            socket.on('connect', () => {
                console.log('Connected to server');
                setconnsocket(true)
              });
              socket.emit("setup",using.user);
            
            const data2=await JSON.parse(localStorage.getItem("chat with favos"))
            console.log(data2);
        
           let allusers=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/getallusers/${data.insertedId || data._id}`)
            
            allusers=await allusers.json();
            console.log(allusers);
            console.log(allusers.users);
            setcontacts(allusers.users)
            
        }

        else{
          navigate("/Login")
        }
    }
        run();
    },[])
    
    
    
   
   
         return(
<div className="chatbox">
    <Contacts  changeactive={changeactive} change={change}msgsent={msgsent} setmsgsent={setmsgsent} setcontacts={setcontacts} currenthold={currentholder} setcurrentchat={setcurrentchat} currentchat={currentchat} showmyprofile={showmyprofile} setshowmyprofile={setshowmyprofile} contacts={contacts} changechat={changechathandler}/>
    <Chatcontainer setbgimg={setbgimg} bgimg={bgimg} setcurrentchat={setcurrentchat} setcurrentholder={setcurrentholder} changechathandler={changechathandler} setcurrentroomid={setcurrentroomid} showprofile={showprofile} setshowmyprofile={setshowmyprofile} showmyprofile={showmyprofile} setshowprofile={setshowprofile} currentchatmsgs={msgss} settingmessageshandler={settingmessageshandler} currentchat={currentchat} currentholder={currentholder}/>
</div>
         )
}
export default Chatbox;