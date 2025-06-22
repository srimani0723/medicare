import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const NotFound = () => {
    
     const jwtToken = Cookies.get("jwt_token")
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null

    const navigate = useNavigate()
    const backToHome = () => {
        navigate(user.role && jwtToken ? `/${user.role}/${user.id}` :'/')
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <img src="https://img.freepik.com/premium-vector/page-found-concept-illustration_86161-98.jpg?w=900" alt="not-found"
                className="w-full max-w-[600px]" />
            <h1 className="text-2xl text-blue-600 font-semibold">Page Not Found</h1>
            <button className=" bg-sky-500 py-2 px-3 text-white font-semibold rounded my-4 cursor-pointer hover:bg-sky-600" onClick={backToHome}>Back to {user.role && jwtToken ? user.role:"Home"}</button>
        </div>
    )
}
export default NotFound
