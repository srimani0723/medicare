
import Header from '../components/Header'
import { GetPatients } from '../middlewares/fetchData'

function CareTakerDashboard() {
  const { data: patients } = GetPatients()
  const totalPatients = patients ? patients.length : 0;
  const averageAdherence = (
  patients.reduce((acc, patient) => acc + parseInt(patient.adherence.replace("%", "")), 0)
  / patients.length
).toFixed(0);

  const totalMedications = patients ? patients.reduce((acc, patient) => acc + patient.medicationCount, 0) : 0;
  const needAttention = patients ? patients.filter(patient => patient.adherence < 50).length : 0;

  return (
    <>
      <Header/>
      <section className='flex flex-col items-start  min-h-screen bg-gray-50 p-4'>
        <section className='flex flex-col w-full'>
          <h1 className='ml-2 text-xl font-semibold'>Caretaker Dashboard</h1>
          <p className='ml-2 text-md text-purple-500 font-semibold mb-3'>Monitor and manage medications for all your patients</p>
          <div className='flex flex-wrap justify-between'>
            <div className='p-4 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 w-full md:w-[48%]'>
            <h1 className='text-lg font-semibold'>Total Patients</h1>
            <p className='text-teal-500 text-3xl font-bold'>{totalPatients}</p>
            <p className='text-sm font-semibold text-gray-500'>Under your Care</p>
            </div>

            <div className='p-4 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 w-full md:w-[48%]'>
            <h1 className='text-lg font-semibold'>Average Adherence</h1>
              <p className='text-yellow-600 text-3xl font-bold'>{averageAdherence }%</p>
            <p className='text-sm font-semibold text-gray-500'>Across all patients</p>
            </div>

            <div className='p-4 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 w-full md:w-[48%]'>
            <h1 className='text-lg font-semibold'>Total Medications</h1>
              <p className='text-amber-600 text-3xl font-bold'>{totalMedications }</p>
            <p className='text-sm font-semibold text-gray-500'>Being Managed</p>
            </div>

            <div className='p-4 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 w-full md:w-[48%]'>
            <h1 className='text-lg font-semibold'>Need Attention</h1>
              <p className='text-red-700 text-3xl font-bold'>{needAttention }</p>
            <p className='text-sm font-semibold text-gray-500'>Patients need follow-up</p>
            </div>
          </div>
        </section>

        <section className='flex flex-col w-full mt-4'>
          <h1 className='text-xl font-semibold mb-3 ml-2'>All Patients</h1>
          <ul>
            {patients && patients.map((patient) => {

              const { id, fullname, email, medicationCount, adherence } = patient;
              return (
              <li key={id} className='flex flex-wrap justify-between'>
              <div className='p-4 px-4 font-semibold rounded-xl cursor-pointer  border border-gray-300 hover:shadow-sm hover:border-gray-600 bg-white mb-3 w-full md:w-[48%]'>
              
                <div className='flex items-center w-full justify-between'>
                  <h1 className='text-lg font-semibold'>{fullname}</h1>
                  <p className='text-lg text-pink-500'>{adherence }</p>
                </div>
                    
                    <div className='flex items-center justify-between'
                    >
                      <p className='text-lg'>Email:</p>
                      <p className='text-teal-500 text-mf=d font-bold'>{email}</p>
                    </div>
                    <div className='flex items-center justify-between'
                    >
                      <p className='text-lg'>MedicationCount</p>
                      <p className='text-lg font-semibold text-sky-500 '>{medicationCount}</p>
                    </div>
                
              </div>
            </li>)
            }
)}
          </ul>
          
        </section>
      </section>
    </>
    
  )
}

export default CareTakerDashboard