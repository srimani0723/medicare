import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const UseMedications = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const jwtToken = Cookies.get("jwt_token");
      const headers = {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/medications`,
        { headers }
      );
        
      return response.data.medications;
    },
  });
};

const GetMedicationLogByUserID = () => {
    return useQuery({
        queryKey: ["medicationLogByUserId"],
        queryFn: async () => {
            const jwtToken = Cookies.get("jwt_token");
            const userid = JSON.parse(Cookies.get("user")).id

            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/medicationlogs/${userid}`, {
                headers,
            }
            );
            return response.data.medications;
        },
    })      
};

const GetAdherenceReport = () => {
    return useQuery({
        queryKey: ["adherenceReport"],
        queryFn: async () => {
            const jwtToken = Cookies.get("jwt_token");
            const userid = JSON.parse(Cookies.get("user")).id

            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/adherencereport/${userid}`, {
                headers,
            }
            );

            return response.data;
        },
    })      
};

const GetDailyStreak = () => {
    return useQuery({
        queryKey: ["getDailyStreak"],
        queryFn: async () => {
            const jwtToken = Cookies.get("jwt_token");
            const userid = JSON.parse(Cookies.get("user")).id

            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/dailystreak/${userid}`, {
                headers,
            }
            );

            return response.data.dates;
        },
    })      
};

const GetMedicationLogByDate = (medication) => {
    return useQuery({
        queryKey: ["medicationLog", medication.date, medication.userid],
        queryFn: async () => {
            const { date, userid } = medication;
            const jwtToken = Cookies.get("jwt_token");
            const body = {
                date,
                userid
            };

            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/medicationlog/date`, {
                headers,
                params: body
            }
            );
            return response.data.medications;
        },
    })      
};

const DeleteMedicationLog = () => {
    const queryClient = useQueryClient()
    return useMutation({    
        mutationFn: async (id) => {
            const jwtToken = Cookies.get("jwt_token");
            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/medications/${id}`,
                { headers }
            );

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["medications"])
        }
    });
}

const GetPatients = () => {
    return useQuery({
        queryKey: ["getDailyStreak"],
        queryFn: async () => {
            const jwtToken = Cookies.get("jwt_token");

            const headers = {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            };

            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/user/patients`, {
                headers,
            }
            );

            return response.data.patients;
        },
    })      
};

export { UseMedications, GetMedicationLogByDate, DeleteMedicationLog, GetMedicationLogByUserID, GetAdherenceReport,GetDailyStreak, GetPatients };