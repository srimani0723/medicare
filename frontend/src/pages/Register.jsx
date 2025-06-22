import { useState } from "react";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Cookies from "js-cookie"


function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("patient");
    const [showPass, setShowPass] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationFn: async () => {
            const body = {
                username,
                password,
                fullname,
                email,
                role
            }
            console.log(body)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, body)
            return response.data
        },
        onSuccess: () => {
            setSuccess(true)
            setTimeout(() => {
                navigate("/login")
            },3000)
        },
        onError: (err) => {
            console.log(err)
            setError(err)
        }
    })

    const jwtToken = Cookies.get("jwt_token")
    const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
    
    if(jwtToken && user.role) return <Navigate to={`/${user.role}/${user.id}`}/>

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("")
        mutation.mutate()
    };

    return (
        <section className="flex items-center justify-center h-[100vh]">
            <form onSubmit={handleSubmit} className="shadow-lg/10 p-8 rounded-lg flex flex-col items-center justify-center border border-gray-200">
                <h1 className="text-2xl font-bold text-sky-400">Register</h1>


                <div className=" w-full">
                    <label htmlFor="fullname" className="font-semibold text-sm">Fullname</label><br />
                    <input
                        id="fullname"
                        type="name"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        placeholder="Enter your Fullname"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="username" className="font-semibold text-sm">Username</label><br />
                    <input
                        id="username"
                        type="text"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter Username"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="email" className="font-semibold text-sm">Email</label><br />
                    <input
                        id="email"
                        type="email"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                    />
                </div>

                <div className=" w-full">
                    <label htmlFor="password" className="font-semibold text-sm">Password</label><br />

                    <div className="relative  flex items-center justify-between">
                        <input
                            id="password"
                            type={!showPass ? "password" : "text"}
                            className="rounded outline-none p-2 text-md border border-gray-300 focus:border-sky-300 font-semibold w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                        />

                        <button className="absolute pr-2 cursor-pointer right-0" type="button" onClick={() => setShowPass(prev => !prev)}>
                            {!showPass ? <MdVisibility className="text-xl" /> : <MdVisibilityOff className="text-xl" />}
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    <label htmlFor="select" className="font-semibold text-sm">Role</label><br />

                    <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded outline-none p-2 text-md border border-gray-300 focus:border-sky-300 font-semibold  w-full">
                        <option value={"patient"}>patient</option>
                        <option value={"caretaker"}>caretaker</option>
                    </select>
                </div>

                {success?<p className="bg-green-200 w-full rounded text-center flex items-center justify-center mt-2 border border-green-500 text-green-800 p-2">Success <IoMdCheckmarkCircleOutline className="ml-1"/></p>:<button type="submit" className="p-2 bg-sky-400 text-white font-semibold rounded mt-3 w-full hover:bg-sky-500 cursor-pointer hover:shadow-md">Register</button>
                }

                {error === "" ? null : <p className="text-red-600 font-medium text-sm">*{error}</p>}

                <p className="mt-2 font-semibold">Have an Account, <Link to={"/login"} className="text-blue-500">Login</Link></p>
            </form >
            <div className="hidden md:block w-[50%] max-w-[500px]">
                <img src="https://img.freepik.com/free-vector/login-concept-illustration_114360-757.jpg?semt=ais_hybrid&w=740" alt="login" className="w-full" />
            </div>
        </section >

    );

}

export default Register