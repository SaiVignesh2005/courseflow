import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Courses from './pages/Courses';
import EnrolledCourses from './pages/EnrolledCourses';
import CreateCourse from './pages/CreateCourse';


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/enrolled" element={<EnrolledCourses />} />

        <Route path="/create-course" element={<CreateCourse />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;