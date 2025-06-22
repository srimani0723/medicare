import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Cookies from "js-cookie"

function MedicationForm(props) {
    const { toggleForm, refetch, selectedMedication, resetAll, methodType, refresh } = props
    
    const [success, setSuccess] = useState(false)
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [dosage, setDosage] = useState("")
    const [error, setError] = useState('')
    const [frequency, setFrequency] = useState("Once daily")
    
    const user = JSON.parse(Cookies.get("user"))
    const jwtToken = Cookies.get("jwt_token")

    useEffect(() => {
        if (selectedMedication) {
            setId(selectedMedication.id)
            setName(selectedMedication.name)
            setDosage(selectedMedication.dosage)
            setFrequency(selectedMedication.frequency)
        }
    }, [selectedMedication])

    
    const { mutate } = useMutation({
        mutationFn: async () => {
            const headers = {
                Authorization: `Bearer ${jwtToken}`,    
                "Content-Type": "application/json",
            };

            if (methodType === "post") {
                const body = {
                name,
                userid:user.id,
                dosage,
                frequency
                }
                
                console.log(body)
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/medications`, body, { headers })
                if (response.data.error) {
                    setError(response.data.error)
                    return
                }
                return response.data
            } else if (methodType === "put" && id) {
                const body = {
                id,
                name,
                userid:user.id,
                dosage,
                frequency
                }
                
                const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/medications/${id}`, body,{ headers})
                if (response.data.error) {
                    setError(response.data.error)
                    return
                }
                return response.data
            }
            
        },
        onSuccess: () => {
            setSuccess(true)
            resetAll()
            resetInput()
            toggleForm()
            refetch()
            refresh()
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        mutate();
    };

    const resetInput = () => {
        setName("")
        setDosage("")
        setId("")
        setTimeout(() => {
            setSuccess(false)
            toggleForm()
        },3000)
    }

  return (
      <form onSubmit={handleSubmit} className='bg-white p-5 rounded-lg border border-gray-300 shadow-md mb-3'>
          <h1 className='text-xl font-semibold'>MedicationForm</h1>
          <div className='flex flex-wrap justify-between'>
          <div className="my-3 w-full">
                    <label htmlFor="name" className="font-semibold text-sm">Medication Name</label><br />
                    <input
                        id="name"
                        type="text"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full "
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="eg.,Dolo"
                    />
          </div>
          <div className="mb-3 w-full md:w-[48%]">
                    <label htmlFor="dosage" className="font-semibold text-sm">Dosage</label><br />
                    <input
                        id="dosage"
                        type="text"
                        className="border border-gray-300 rounded outline-none p-2 text-md focus:border-sky-300 font-semibold w-full "
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        required
                        placeholder="eg.,650mg"
                    />
              </div>
              
                <div className="w-full md:w-[48%]">
                    <label htmlFor="select" className="font-semibold text-sm">Frequency</label><br />

                    <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="rounded outline-none p-2 text-md border border-gray-300 focus:border-sky-300 font-semibold  w-full">
                      <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                    </select>
              </div>
              <div className='mt-2 flex items-center justify-between w-full'>
            {success?<p className="bg-green-200 rounded text-center flex items-center justify-center border border-green-500 text-green-800 p-2">Success <IoMdCheckmarkCircleOutline className="ml-1"/></p>:<button className=' p-2 px-4 font-semibold rounded cursor-pointer bg-sky-500 text-white hover:shadow-sm hover:bg-sky-600 '>Add Medication</button>
                } 

                  <button type='button' onClick={() => {
                      toggleForm();
                      resetAll();
                      resetInput();
                   }} className=' p-2 px-4 font-semibold rounded cursor-pointer bg-gray-5 border border-gray-300 hover:shadow-sm hover:border-gray-400'>Cancel</button>
                  </div>
          </div>
          {error === "" ? null : <p className="text-red-600 font-medium text-sm">*{error}</p>}
      </form>
  )
}

export default MedicationForm