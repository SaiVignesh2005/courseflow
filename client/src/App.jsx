import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Courses from './pages/Courses';
import EnrolledCourses from './pages/EnrolledCourses';

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/courses" element={<Courses />} />

        <Route path="/enrolled" element={<EnrolledCourses />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;