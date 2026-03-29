import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/students/AddStudent";
import StudentDetail from "./pages/students/StudentDetail";
import EditStudent from "./pages/students/EditStudent";

import "./index.css";
import "./styles/button.css";
import ProtectedRoute from "./pages/students/components/ProtectedRoute";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Studentsrecord from "./pages/StudentsRecord";

function Students() {
  return <h1>Student Records</h1>;
}

function App() {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          {/* 🔓 Public Route */}
          <Route path="/login" element={<Login />} />

          {/* 🔐 Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="students/edit/:id" element={<EditStudent />} />
            <Route path="applications" element={<Applications />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="studentsrecord" element={<Studentsrecord />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
