import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/Dashboard";
import AddStudent from "./pages/students/AddStudent";
import StudentDetail from "./pages/students/StudentDetail";
import EditStudent from "./pages/students/EditStudent";

import "./index.css";
import "./styles/button.css";

function Students() {
  return <h1>Student Records</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/students" element={<Students />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/:id" element={<StudentDetail />} />
          <Route path="/students/edit/:id" element={<EditStudent />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
