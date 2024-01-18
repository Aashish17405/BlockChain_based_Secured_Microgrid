import React,{ useState } from "react";

const Practice = () => {
    const [user,setUser]=useState('USER');
    return ( 
        <div>
            <button onClick={()=>setUser("UESR")}>User</button>
            <button onClick={()=>setUser("Badminton")}>Badminton</button>
            <button onClick={()=>setUser("play")}>Play</button>
            <h1>{user}</h1>
        </div>
     );
}
 
export default Practice;