import React, { useState,useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../App.css";
const Login=()=>{
  const navigate=useNavigate();
  const [options,setoptions]=useState({
      email:"",
      password:""
  });
  useEffect(()=>{
    if(localStorage.getItem("chat with favos")){
          navigate("/Avatar");
    }
  },[])
  const [error,seterror]=useState("")
    const changehandler2=(event)=>{
      seterror("")
        setoptions({...options,[event.target.name]:event.target.value});
    };
    const submithandler2=async(e)=>{
      e.preventDefault()
      if(options.email==="" && options.password===""){
        seterror("email and password is empty");
        console.log("in func");
       
      }
      else if(options.email===""){
        seterror("email is empty");
        
      }
      else if(options.password===""){
        seterror("password is empty");
        
      }
      else{
        try{
           let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/Login`,{
          method:"POST" , headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              email:options.email,
              password:options.password
            })
           })
         
            data= await data.json();
            console.log(data);
           
           if(data && data.status===400){
              seterror(data.msg)
           }
           if(data && data.status===200){
                   seterror("")
                   console.log("data.user")
                   console.log(data.user)
                   localStorage.setItem("chat with favos",JSON.stringify(data.user));
                   navigate("/");
           }
           
      }
      catch(err){
        console.log(err)
      }
    }}
    return(
    <div className="form-wrapper">
    <form className="form-use" onSubmit={(e)=>{submithandler2(e)}}>
     <div className="text"><p>Login</p> <span className="underline"></span></div>
    
     
     
     
     
     
      <input type="text" name="email" className="email" placeholder="email"onChange={(e)=>{changehandler2(e)}}></input>
     
     
      <input type="password" name="password" onChange={(e)=>{changehandler2(e)}} className="password" placeholder="password"></input>
    {error? <div className="error">{error}</div>:""}
     
     
<button type="submit" className="submitbutt">Login</button>  
<div className="control-login">
     don't have an account? <Link className="changeprocess" to="/Signup"> Signup</Link>
  </div>   
     
    </form>
  </div>);
}
export default Login;