import Cookies from "js-cookie"
import { Navigate, Route } from "react-router-dom"

const ProtectedRoute = (props) => {
    
    const jwtToken = Cookies.get("jwt_token")
    
    const user = Cookies.get("user")?JSON.parse(Cookies.get("user")):null
    
    if (!jwtToken || !user) 
        return <Navigate to={"/login"} />
    
    if (props.allowedRole === user.role)
        return props.element;

    return <Navigate to="/not-found"/>
}

export default ProtectedRoute