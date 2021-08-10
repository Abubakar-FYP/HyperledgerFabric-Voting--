import React from 'react';

const Signin =()=>{
    return (
       <div>
       <div class = "card">
           <h1>Sign in </h1>
           <label for="phone">Enter your phone number:</label>
            <input type="tel" id="phone" name="phone" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
           />
           <button class ="btn waves-effect waves-light"> 
           Verify</button>
       </div>
       </div>
    )
}

export default Signin 