/* eslint-disable @typescript-eslint/no-explicit-any */


"use server"

import { loginUser } from "./login"

export const registerPatients = async ( _currentState :any, formData :any) : Promise<any> => {
 try{
    const registerData ={
        password : formData.get("password"),
        patient : {
            name : formData.get("name"),
            email : formData.get("email"),
            address : formData.get("address")
        }
     }

   const newFormData= new FormData()
   newFormData.append("data", JSON.stringify(registerData))
   
   const response = await fetch("http://localhost:5000/api/v1/user/create-patient", {
    method : "POST",
    body : newFormData
   })

   const result = await response.json()

   if(result.success)
   await loginUser(_currentState, formData)
  
   return result


 }catch(error){
console.log(error)
 }

}