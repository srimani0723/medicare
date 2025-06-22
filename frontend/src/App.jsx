import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectedRoute from "./middlewares/ProtectedRoute"
import PatientDashboaard from "./pages/PatientDashboaard"
import NotFound from "./pages/NotFound"
import CareTakerDashboard from "./pages/CareTakerDashboard"

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes based on role */}
      <Route path="/patient/:id" element={<ProtectedRoute element={<PatientDashboaard />} allowedRole={"patient"} />} />
      
      <Route path="/caretaker/:id" element={<ProtectedRoute element={<CareTakerDashboard />} allowedRole={"caretaker"} /> } />

      {/* If path notfound or unauthorized */}
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found"/>}/>
    </Routes>
  )
}

export default App
