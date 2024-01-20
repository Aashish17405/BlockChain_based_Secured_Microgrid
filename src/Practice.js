import React,{ useEffect,useState } from "react";

const Practice = () => {
    const [count,setCount]=useState(0);
    const [greet,setGreet]=useState(0);
    useEffect(()=>{
        //the code that we want to run
        console.log("Count is:",count);
        return ()=>{
            console.log('I am being cleaned UP!');
        }
    },[count]);
    return ( 
        <div>
            <button onClick={()=>setGreet(prevGreet=>prevGreet+10)}>hello</button><span>{greet}</span>
            <button onClick={()=>setCount(prevCount=>prevCount-1)}>Decrement</button>
            <button onClick={()=>setCount(prevCount=>prevCount+1)}>Increment</button>
            <h1>{count}</h1>
            
        </div>
     );
}
 
export default Practice;