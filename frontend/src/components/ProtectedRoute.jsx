import {Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'
import { useState, useEffect } from 'react'


function ProtectedRoute({children}){
    const [isAuthroized, setIsAuthorized] = useState(null)
    
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const refreshToken = async() => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if(res.status == 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            }else{
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async() => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if(!token){
            setIsAuthorized(false)
            return 
        }
        const decoded  = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now ){
            await refreshToken()
        }
        else{
            setIsAuthorized(true)
        }

    }

    if(isAuthroized == null){
        return <div>Loading......</div>
    }

    return isAuthroized ? children :<Navigate to={"/login"} />
}

export default ProtectedRoute