import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import Profile from "./components/Profile";
import JobDescription from "./components/JobDescription";
import Companies from "./components/admin/Companies";
import CompanyCreate from "./components/admin/CompanyCreate";
import CompanySetUp from "./components/admin/CompanySetUp";
import AdminJobs from "./components/admin/AdminJobs"
import Postjob from "./components/admin/PostJob";
import Applicants from "./components/admin/Applicants";
import ProtectedRoute from "./components/admin/protectedRoute";
//now we are settingup reactRouterDom so that we go to login/signup or any page when we click
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/jobs",
    element: <Jobs />,
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  //admin starts from here...
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>,
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetUp /></ProtectedRoute>,
  },
  //ab jobs ke liye ye...
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><AdminJobs/></ProtectedRoute>,
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><Postjob/></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants/></ProtectedRoute>
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={appRouter} />
    </>
  );
}

export default App;
