import React, { useState } from 'react'
import Header from '../components/Header'
import MedicationForm from './MedicationForm'
import Cookies from 'js-cookie'
import {  DeleteMedicationLog, GetAdherenceReport, GetMedicationLogByDate,GetMedicationLogByUserID,UseMedications,GetDailyStreak } from '../middlewares/fetchData'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import EmptyView from '../components/EmptyView'
import StreakCalendar from '../components/StreakCalender'

function PatientDashboaard() {
  const [medFormVisible, setMedFormVisible] = useState(false)
  const [seletedMed, setSeletedMed] = useState(null);
  const [methodType, setMethodType] = useState("post");
  
  const userid = JSON.parse(Cookies.get('user')).id;
  const date = new Date().toISOString().split('T')[0];

  
  const { data: medicationsList,refetch:getMedications } = UseMedications()
  const { data: medicationLogList, refetch } = GetMedicationLogByDate({ date, userid });
  const { mutate: deleteMedicationLog } = DeleteMedicationLog();
  const { data: medicationLogListByUserId, refetch: getMedicationLogByUserId } = GetMedicationLogByUserID()
  const { data: adherenceReport, refetch: getAdherenceReport } = GetAdherenceReport()
  const { data: dailyStreak, refetch:getDailyStreak} = GetDailyStreak()

  const todayTaken = medicationLogListByUserId ? medicationLogListByUserId.filter(each => each.datetaken === date) : []

  const streak = dailyStreak? dailyStreak.length: 0

  const { mutate: markTaken } = useMutation({
    mutationFn: async (id) => {
      const jwtToken = Cookies.get("jwt_token");
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      };

      const body = {
        userid,
        medicationid: id,
        datetaken: date
      };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/medicationlog`,
        body,
        { headers }
      );
    },
    onSuccess: () => {
      refetch();
      getMedicationLogByUserId();
      getAdherenceReport()
      getDailyStreak()
    },
    onError: (error) => { 
      console.error("Error marking medication as taken:", error);
    }
  })

  
  const onToggleMedForm = () => {
    setMedFormVisible(prev => !prev)
  }

  return (
    <>
      <Header/>
      <section className='p-3 bg-gray-100 min-h-[100vh]'>
        <h1 className='font-semibold text-xl md:text-2xl ml-3 mb-3'>Your Medication Dashboard</h1>

        <section className='flex  justify-evenly flex-wrap'>
          <div className=' p-3 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 md:mb-0 w-full md:w-[32%]'>
            <h1 className='text-lg font-semibold'>Adherence Rate</h1>
            <p className='text-pink-500 text-3xl font-bold'>{adherenceReport?adherenceReport.averageAdherence:"?" }%</p>
            <p className='text-sm font-semibold text-gray-500'>Needs Improvement</p>
            <div className='h-[10px] w-full bg-gray-200 rounded-full mt-3'>
              <div className={`w-[${adherenceReport ?adherenceReport.averageAdherence : "0"}%] bg-red-400 h-full rounded-full`}></div>
            </div>
          </div>
          
           <div className=' p-3 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 md:mb-0 w-full md:w-[32%]'>
            <h1 className='text-lg font-semibold'>Today's Medications</h1>
            <p className='text-teal-500 text-3xl font-bold'>{medicationsList? medicationsList.length : "0"}</p>
            <p className='text-sm font-semibold text-gray-500'>{todayTaken ? todayTaken.length : "0"} completed</p>
          </div>

          <div className=' p-3 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 md:mb-0 w-full md:w-[32%]'>
            <h1 className='text-lg font-semibold'>Streak</h1>
            <p className='text-purple-500 text-2xl font-bold'>{streak} {streak > 1? "Days":"Day"}</p>
            <p className='text-sm font-semibold text-gray-500'>{streak == 0 ? "Get better!" : "Keep it up!"}</p>
          </div>
          
        </section>

        <section className='flex flex-col lg:flex-row mt-2 lg:justify-evenly w-full px-3'>
        <section className='flex flex-col lg:w-[95%] lg:mr-3'>
          <div className='flex items-center w-full justify-between mt-3 p-3'>
            <h1 className='text-lg font-bold text-gray-700'>Today's Medications</h1>
            <button type='button' onClick={onToggleMedForm} className=' p-2 px-4 font-semibold rounded cursor-pointer bg-sky-500 text-white hover:shadow-sm hover:bg-sky-600'>Add Medication</button>
          </div>
          
          {medFormVisible && <MedicationForm
            toggleForm={onToggleMedForm}
            refetch={refetch}
            selectedMedication={seletedMed}
            methodType={methodType}
            resetAll={() => {
              setSeletedMed(null);
              setMethodType("post");
              setMedFormVisible(false);
            }}
            refresh={getMedications}
          />}

          
          <ul>
            {(medicationsList && medicationsList.length > 0) ? medicationsList.map((medication) => {
              const { id, name, dosage, frequency } = medication;

              const isTaken = medicationLogList ?medicationLogList.filter(each => each.medicationid === id)[0]?.taken || false: false;

              return <li key={id} className=' p-3 px-4 font-semibold rounded-xl border  border-gray-300 hover:shadow-md hover:border-gray-400 bg-white mb-3 w-full'>

                <div className='flex flex-col md:flex-row md:items-center mb-2'>

              <div className='flex items-center justify-between w-full'>
                <div className='flex items-center'>
                  <div className={`h-4 w-4 ${isTaken ? "bg-green-400" : "bg-gray-400"} rounded-full mr-3 `} ></div>
                  
                <div className=''>
                  <h1 className='text-lg md:text-xl font-semibold'>{name}</h1>
                  <p className='text-sm md:text-xl text-violet-500 font-bold'>{dosage} - {frequency}</p>
                  </div>
                  </div>
                  
                {isTaken ? <div className='flex flex-col md:flex-row items-center ml-auto'>
                  <p className='bg-teal-100 rounded-full text-green-800 px-3 mr-2 text-sm'>taken</p>
                  <button className='bg-teal-500 text-white px-4 py-1 rounded-lg hover:bg-teal-700 cursor-pointer hover:shadow-md text-sm mt-2 md:mt-0 disabled:bg-gray-400' disabled>Taken</button>
                </div>
                  : <div className='flex items-center ml-auto flex-col md:flex-row'>
                  <p className='bg-sky-100 rounded-full text-sky-800 px-3 mr-2 text-sm'>pending</p>
                    <button className='bg-teal-500 text-white px-4 py-1 rounded-lg hover:bg-teal-700 cursor-pointer hover:shadow-md text-sm mt-2 md:mt-0 disabled:bg-gray-400'
                    onClick={()=>markTaken(id)}>Mark Taken</button>
                    </div>}
                  </div>
                  
              </div>
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      setSeletedMed(medication);
                      setMethodType("put");
                      setMedFormVisible(true);
                    }}
                    className='font-bold p-1.5 md:p-2 text-sm rounded-xl cursor-pointer flex items-center shadow-sky-50 shadow-lg border border-gray-300 hover:bg-gray-200 mr-3' >
                    <FaRegEdit className="text-sm md:text-lg mr-2" /> Edit
                </button>
                  <button
                    onClick={() => deleteMedicationLog(id)}
                    className='font-bold p-1.5 md:p-2 text-sm rounded-xl cursor-pointer flex items-center shadow-sky-50 shadow-lg border border-red-700 bg-red-500 text-white hover:bg-red-700' >
                    <MdDeleteOutline className="mr-2 text-sm md:text-lg" /> Delete
                  </button>
                  
            </div>
              </li>
            }) : (
                <EmptyView/>
            )}
          </ul>
        </section>

        <section className='flex flex-col lg:w-[95%] mt-3'>
          <h1 className='font-bold text-xl my-3'>Streak Calender</h1>
          <StreakCalendar />
          </section>
          </section>
      </section>
    </>
  )
}

export default PatientDashboaard