import React from "react"
import "./mainprofile.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import ModeIcon from '@mui/icons-material/Mode';
import CheckBoxIcon from '@mui/icons-material/CheckBox';


const Mainprofile=({setcurrentchat,setcurrentholder,currentholder,setshowmyprofile})=>{
  const [editname,seteditname]=useState(false);
  const [enteredname,setenteredname]=useState(currentholder.username)
  const navigate=useNavigate()
useEffect(()=>{

  //console.log(enteredname)
},[enteredname])

  const changenamehandler=async()=>{
    if(enteredname===currentholder.username){
      return;
    }
    if(enteredname.length>0){
         //console.log(currentholder)
        
      let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/changename/${currentholder._id}`,
      {
        method:"POST",
        headers:{
        'Content-Type':'application/json'},
        body:JSON.stringify({
          name:enteredname
        })

        
        
      })  
      if(data){
        data=await data.json();
        //console.log(data);
        setcurrentholder(data.exisitinguser);
        setenteredname(data.exisitinguser.username)
        setcurrentchat(data.exisitinguser)
        seteditname(false);

      }
        }
  }


const changehandler=(e)=>{
  e.preventDefault()
     setenteredname(e.target.value);
     
}
  const deletehandler=async()=>{
    let local;
         if(localStorage.getItem("chat with favos")){
           local=JSON.parse(localStorage.getItem("chat with favos"));
          //console.log(local._id)

         }
         if(local._id){
         let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/delete/${local._id}`,{
            method:"DELETE",
            headers:{
              'Content-Type': 'application/json',

            }
          })
         data=await data.json();
          //console.log(data)
          if(data.msg==="success"){
            localStorage.removeItem("chat with favos")
            navigate("/Signup")
          }
         }
  }
      return(
        <div className="mainprofilewrapper" id="mainprofilewrapper">
      <div className="mainprofile">

        <div className="arrowwrapper" onClick={()=>{setshowmyprofile(false)}}><IoMdArrowRoundBack style={{ height:"25px",
    width:"25px"}} fill="white"/>
    </div>
    <div className="imagwrapper">
     <img className="imag" src={currentholder.avatarimage?.startsWith("uploads")?`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/${currentholder.avatarimage}`:currentholder.avatarimage}/>
     </div>
     <div className="detailwrappers">
     { !editname && <div className="namewrapper">
         <div className="users">{currentholder.username} </div>
        < ModeIcon onClick={()=>{seteditname(true)}} className="changename" style={{height:"20px",width:"20px",marginLeft:"10px",border:"1px solid limegreen",color:"limegreen",padding:"5px",cursor:"pointer"}}/>

         </div>}
       { editname && <div className="profileinput">
          <input value={enteredname} onChange={(e)=>{changehandler(e)}} className="nameinput" type="text"></input>
          <div className="iconswrapper">
          <CheckIcon onClick={()=>{changenamehandler()}} className="checkbox"/>
          <CloseIcon className="exit" onClick={()=>{seteditname(false)}}/>
          </div>

         </div>}
        <div className="changephotobutt">{currentholder.email} 
</div>
         <button className="changephotobutton" onClick={()=>{navigate("/Avatar")}}>Change DP</button>
         <button className="deleteaccbutton" onClick={deletehandler}>Delete Account</button>
     </div>



      </div></div>)      
}
export default Mainprofile;