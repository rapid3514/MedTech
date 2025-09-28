import { useEffect, useState } from "react"
import { api } from "../../Service/api"
import type{ User } from "../../store/auth.store"


const Profile = () => {
    const [user,setUser] = useState<User>({}as User)
    useEffect(() =>{
        const getUser = async () =>{
            try{
                const response = await api.get("auth/me")
                setUser(response.data)
                console.log(response.data,'data');
                
            }catch(err){
                console.log(err);
                
            }
        }
        getUser()
    },[])

  return (
    <div>
        <div >
            <h1>{user.email}</h1>
            <h1>{user.role}</h1>
        </div>
    </div>
  )
}

export default Profile