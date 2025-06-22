import { useState } from "react";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: async () => {
            const body = {
                username,
                password
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, body)
            return response.data
        },
        onSuccess: (data) => {
            setSuccess(true)
            Cookies.set("jwt_token", data.jwtToken, { expires: 30 })
            Cookies.set("user", JSON.stringify(data.body), { expires: 30 })
            setTimeout(() => {
                navigate(`/${data.body.role}/${data.body.id}`)
            },3000)
        },
        onError: (err) => {
            setError(err.response.data.error)
        }
    })

    const jwtToken = Cookies.get("jwt_token")
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
    
    if(jwtToken && user.role) return <Navigate to={`/${user.role}/${user.id}`}/>

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        mutation.mutate();
    };

    return (
        <section className="flex items-center justify-center h-[100vh]">
            <div className="hidden md:block w-[50%] max-w-[500px]">
                <img src="https://img.freepik.com/free-vector/sign-page-abstract-concept-illustration_335657-3875.jpg?semt=ais_hybrid&w=740" alt="login" className="w-full" />
            </div>

            <form onSubmit={handleSubmit} className="shadow-lg/10 p-8 rounded-lg flex flex-col items-center justify-center border border-gray-200">
                <h1 className="text-2xl font-bold text-sky-400">Login</h1>
                <div className="my-3 w-full">
                    <label htmlFor="username" className="font-semibold text-sm">Username</label><br />
                    <input
                        id="username"
                        type="text"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your Username"
                    />
                </div>

                <div className="w-full">
                    <label htmlFor="password" className="font-semibold text-sm">Password</label><br />

                    <div className="relative  flex items-center justify-between">
                        <input
                            id="password"
                            type={!showPass ? "password" : "text"}
                            className="rounded outline-none p-2 text-md border border-gray-300 focus:border-sky-300 font-semibold w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                        <button className="absolute pr-2 cursor-pointer right-0" type="button" onClick={() => setShowPass(prev => !prev)}>
                            {!showPass ? <MdVisibility className="text-xl" /> : <MdVisibilityOff className="text-xl" />}
                        </button>
                    </div>
                </div>

                {success?<p className="bg-green-200 w-full rounded text-center flex items-center justify-center mt-2 border border-green-500 text-green-800 p-2">Success <IoMdCheckmarkCircleOutline className="ml-1"/></p>:<button type="submit" className="p-2 bg-sky-400 text-white font-semibold rounded mt-3 w-full hover:bg-sky-500 cursor-pointer hover:shadow-md">Login</button>
                                }

                {error === "" ? null : <p className="text-red-600 font-medium text-sm">*{error}</p>}

                <p className="mt-2  font-semibold">Did'nt have an Account, <Link to={"/register"} className="text-blue-500">Register</Link></p>
            </form>
        </section>
    );

}

export default Login