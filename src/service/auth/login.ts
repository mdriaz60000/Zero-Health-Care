/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

export const loginUser = async ( _currentState :any, formData :any) : Promise<any> =>{
    try{
const loginData ={
    email : formData.get("email"),
    password : formData.get("password")
}
 const response = await fetch("http://localhost:5000/api/v1/auth/login",{
    method: "Post",
    body: JSON.stringify(loginData),
    headers:{
        "Content-Type" : "application/json"
    }
 }).then(response => response.json())

 return response

    }catch(error){
 console.log(error)
    }
}