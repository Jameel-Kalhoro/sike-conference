import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './components/AdminLogin/AdminLogin';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminManageSchedules from './components/AdminManageSchedules/AdminManageSchedules';
import AdminUpdateSession from './components/AdminUpdateSesson/AdminUpdateSession';
import AdminManageBlogs from './components/AdminManageBlogs/AdminManageBlogs';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/AdminLogin' element = {<AdminLogin/>}/>
        <Route path='/AdminDashboard' element = {<AdminDashboard/>}/>
        <Route path='/AdminManageSchedules' element = {<AdminManageSchedules/>}/>
        <Route path='/AdminUpdateSession/:sessionId' element = {<AdminUpdateSession/>}/>
        <Route path='/AdminManageBlogs' element = {<AdminManageBlogs/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
