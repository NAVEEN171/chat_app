import React from "react";
import "../App.css";
import {Link,useNavigate } from "react-router-dom";
import { useState,useEffect} from "react";
 const Signup=()=>{
      const navigate=useNavigate();
      const [values,setvalues]=useState({username:"",
      email:"",
      password:"",
      confirmpassword:""

            
      })
      useEffect(()=>{
            if(values.password!=="" && values.password===values.confirmpassword ){
                  seterrors({...errors,"confirmpassword_error":""})  
                  
            }
      },[values.confirmpassword])
      const [errors,seterrors]=useState({username_error:"",
      email_error:"",
      password_error:"",
      confirmpassword_error:""})
      const submithandler=async (e)=>{
            e.preventDefault();
            if(values.username==="" || values.password==="" ||values.email==="" ||values.confirmpassword==="" ){
                  seterrors({...errors,"confirmpassword_error":"some inputs are empty"});
                     return;
            }
            else if(values.password!==values.confirmpassword){
                  seterrors({...errors,"confirmpassword_error":"both passwords are not matching"})
                               return;
                         }
           for(let key in errors){
               if(errors[key]!=="") return;
           }
           try{
            console.log("2 time")
           let data=await fetch(`${process.env.REACT_APP_DEPLOYMENT_BACKEND}/Signup`,
          { method:'POST',
          headers:{
            'Content-Type':'application/json'},

            body:JSON.stringify({
                  username:values.username,
                  email:values.email,
                  password:values.password,
                  setavatar:false,
                  avatarimage:"",
            })
          }
       
           ) ; 
           data=await data.json();
           console.log(data)
           if(data && data.status===200){
            localStorage.setItem(
                  "chat with favos",JSON.stringify(data.user)
            );
            navigate("/")

           }
           else if(data.status===400){
           
            seterrors({...errors,"confirmpassword_error":data.msg});
           }

      }
           catch(err){
            console.log(err)
           }
     
    

           
           
           console.log(values)
      }
      const changehandler=(event)=>{
            if(values.username!=="" && values.password!=="" &&values.email!=="" && values.confirmpassword!=="" ){
                  seterrors({...errors,"confirmpassword_error":""});
                    
            }
          
            if(event.target.name==="username" && event.target.value.trim().length<0){
                  seterrors({...errors,"username_error":"username is empty"})
            }
            else if(event.target.name==="username" && event.target.value.trim().length>0){
                  seterrors({...errors,"username_error":""})
            }
            if(event.target.name==="email" && !event.target.value.includes("@")){
                  seterrors({...errors,"email_error":"provide valid email"})
            }
            else if(event.target.name==="email" && event.target.value.includes("@")){
                  seterrors({...errors,"email_error":""})
            }
            if(event.target.name==="password" && event.target.value.trim().length<8){
                  seterrors({...errors,"password_error":"minimum length of password is 8"})
            }
            if(event.target.name==="password" && event.target.value.trim().length>=8){

                  seterrors({...errors,"password_error":""})
            }
           
            
           setvalues({...values,[event.target.name]:event.target.value})
          
                  
           
      }
          
   
       return(
        <div className="form-wrapper">
        <form className="form-use" onSubmit={(e)=>{submithandler(e)}}>
         <div className="text"><p>Sign Up</p> <span className="underline"></span></div>
        
       
          <input type="text" className="user" name="username" placeholder="Username" onChange={(e)=>{changehandler(e)}}></input>
        {errors.username_error!==""? <span className="error">{errors.username_error}</span>:""}
      
         
          <input type="text" className="email" name="email" placeholder="email" onChange={(e)=>{changehandler(e)}}></input>
          {errors.email_error!==""? <span className="error">{errors.email_error}</span>:""}
         
          <input type="password" className="password"name="password" placeholder="password" onChange={(e)=>{changehandler(e)}}></input>
          {errors.password_error!==""? <span className="error">{errors.password_error}</span>:""}
         
          <input type="password" name="confirmpassword" className="cpassword" placeholder="confirm password" onChange={(e)=>{changehandler(e)}}></input>
          {errors.confirmpassword_error!==""? <span className="error">{errors.confirmpassword_error}</span>:""}
    <button type="submit" className="submitbutt">Signup</button>  

    <div className="control-login">
         already have an account? <Link className="changeprocess" to="/Login"> Login</Link>
      </div>   
         
        </form>
      </div>
      
       )
 }
export default Signup;