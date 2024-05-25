import React from 'react'
import {motion} from "framer-motion" ;

const Framer = () => {
  return (

    <motion.div
    style={{display:"flex",alignItems:"center",justifyContent:"center",marginTop:"25%"}}
  initial={{ scale: 0 }}
  animate={{ rotate: 180, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20
  }}
>
    <div className='bot' style={{backgroundColor:"hotpink",width:"50px",height:"50px",borderRadius:"50%"}}></div>
</motion.div>
  )
}

export default Framer;
