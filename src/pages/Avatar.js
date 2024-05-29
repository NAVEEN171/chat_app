import React from 'react'
import { Fragment } from 'react'
import { useState,useEffect,useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import "./avatar.css"
import {v4} from "uuid";
import {storage } from "../firebase"

import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
    deleteObject
  } from "firebase/storage";
const avengers=[
       {
        image:"https://images.hdqwalls.com/wallpapers/spiderman-2002-q0.jpg"
       },{
        image:"https://www.tomsguide.fr/content/uploads/sites/2/2020/05/mjolnir.jpg"
       },{
        image:"https://e0.pxfuel.com/wallpapers/468/165/desktop-wallpaper-iron-man-snap-iron-man-endgame.jpg"
       },{
        image:"https://tse2.mm.bing.net/th?id=OIP.a9MlY9tJi8HfavzmsD_F4gAAAA&pid=Api&P=0&h=180"
       },{
        image:"https://avatars.mds.yandex.net/i?id=a888ef14679aad1efabbd454c63de8805eee541b-9225598-images-thumbs&n=13"
       },{
        image:"https://images2.alphacoders.com/984/984402.jpg"
       },{
        image:"https://lumiere-a.akamaihd.net/v1/images/au_marvel_blackwidow_payoff_hero_m_477e378c.jpeg?region=0,0,750,668"
       },{
        image:"https://qph.cf2.quoracdn.net/main-qimg-91e23d9ce0a0bca3e565e1e4fc5eb617-pjlq"
       },{
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTorpF9mKMLlG4t_B4UPLZxJB9u2CybXz847AT-mZVu7aPBFe8nTH89WNr5ZcwwkHtNc1Y&usqp=CAU"
       },{
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF3uUTRPtHgpK7dyyPCYniu4kt3lPooDy_wQ&usqp=CAU"
       }
]
const Avatar = () => {
  const navigate=useNavigate()
  const fileref=useRef(null)
  const  [prevdiv,setprevdiv]=useState();
  const [previewurl,setpreviewurl]=useState("")
  const [selected,setselected]=useState("")
  const [file,setfile]=useState(null);
  const [currenthold,setcurrenthold]=useState(null);
  useEffect(()=>{
    if(file!==null){
      if(selected!==""){
    prevdiv.classList.remove("selected")
    setselected("")
  }
    const fileReader=new FileReader();
    fileReader.onload=()=>{
      setpreviewurl(fileReader.result)
    }
    fileReader.readAsDataURL(file);
   } 
  },[file])
  
  const filehandler= (e)=>{
      console.log(e.target.files[0])

      if(e.target.files[0]){
         
        setfile(e.target.files[0]);
      

      }
     
  }


  const changeprofilephoto=(e)=>{
   console.log(fileref.current.value)
    console.log(prevdiv)
    if(prevdiv && prevdiv.classList.contains("selected")){
      prevdiv.classList.remove("selected")
    }
    if(fileref.current.value!==null){
      fileref.current.value=null;
      if(previewurl){
        setpreviewurl("");

      }
    }
    setfile(null);
    console.log(e.target)
    e.target.classList.add("selected")
   let change=e.target.style.backgroundImage.match(/url\("([^"]+)"\)/)[1]; 
   setpreviewurl(change);
   console.log(change) 
   setselected(`${change}`);
   setfile(null);
  setprevdiv(e.target)
    
  }
  useEffect(()=>{
       if(localStorage.getItem("chat with favos")){
        setcurrenthold(JSON.parse(localStorage.getItem("chat with favos")));
       }
  },[])
  

  const submithandle=async(event)=>{
    event.preventDefault();
     if(selected!==""){
      const user=await JSON.parse(localStorage.getItem("chat with favos"));

      console.log(user)
      let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/Setavatar/${user.insertedId || user._id}`,
      {

        method:"POST",
        headers:{
          'Content-Type':'application/json',
          'x-user-id':currenthold._id

        },
        body:JSON.stringify({
          image:selected,
        })
      })
      data=await data.json();
      let local=JSON.parse(localStorage.getItem("chat with favos"));
      
      local.setavatar=data.setavatar;
      local.avatarimage=data.avatarimage;
      
      localStorage.setItem("chat with favos",JSON.stringify(local))
      console.log(data)
      navigate("/");
     }
     else if(fileref.current.value!==null){
      const user=await JSON.parse(localStorage.getItem("chat with favos"));
      const imageRef=ref(storage,`newuploads/${file.name }`)
 let data2=await uploadBytes(imageRef,file);
 let url;
 if(data2){
    url=await getDownloadURL(data2.ref)
    console.log(url)
 }
      
      
      try{
        let data;
        if(url){
        data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/Setavatar/${user.insertedId || user._id}`,
      {
        method:'POST'
       ,
       headers:{
        'Content-Type':'application/json',
        'x-user-id':currenthold._id

    }
,
      body:JSON.stringify({
        image:url,
      })}
      
       
       )
      }
       if(data){
       data=await data.json();
       console.log(data.details)
       let local=JSON.parse(localStorage.getItem("chat with favos"));
       console.log(local)
       local.setavatar=data.setavatar;
       local.avatarimage=data.avatarimage;
       console.log(local)
       localStorage.setItem("chat with favos",JSON.stringify(local))
       navigate("/")
      }
  
       
     }
    catch(err){
      console.log(err)
    }}
     
    
    
      console.log(selected) 
    console.log(file);
  

  }
 
  return (
    <Fragment>
    <div className='avatarselection'>
     Select Avatar
      </div>
      <div className='avatarwrapper'>
      <div className='avatars'>
        {
          avengers.map((avenn,index)=>(<div key={index} id={index} onClick={(e)=>{changeprofilephoto(e)}} className='aven' 
          style={{backgroundImage:`url(${avenn.image})`}}></div>))
        }
      </div>
      </div>
      <div className='bottom-wrapper'>
        <div className="choosefile">
      
      <input type="file" className='choose' onChange={(e)=>{filehandler(e)}} ref={fileref} placeholder="upload"/>
      
      <button onClick={(e)=>{submithandle(e)}} className='setprofile'>Set Profile Photo</button>
      </div>
     <div className='imagewrapper'><div className='imagepreview'>Photo preview :</div><img className="avenn"  src={previewurl?`${previewurl}`:"https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"}/></div>
    </div>
      </Fragment>
  )
}

export default Avatar;
