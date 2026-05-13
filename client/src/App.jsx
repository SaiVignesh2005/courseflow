import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Courses from './pages/courses';
import EnrolledCourses from './pages/enrolledCourses';
import CreateCourse from './pages/createCourse';


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