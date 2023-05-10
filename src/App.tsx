import { lazy, Suspense } from "react";
import "./App.css";

import { NavLink, Routes, Route, Navigate, useParams } from "react-router-dom";
import ChatHistory from "./component/ChatHistory/ChatHistory";

import { routes } from "./config/config";

import Login from "./component/Auth/Login";
import { useAuth } from "./context/AuthContext";
import SignUp from "./component/Auth/SignUp";
import RouterPage from "./component/RouterPage";
import ForgetPassword from "./component/Auth/ForgetPassword";
import PageNotFound from "./component/PageNotFound";
import { HeatMapOutlined } from "@ant-design/icons";
import QnATraning from "./component/BotTraining/QnATraining.tsx";
import Summary from "./component/Summary/index.tsx";
import TestBot from "./component/TestBot/index.tsx";

const CreateBot = lazy(() => import("./component/CreateBot"));
const WelcomePage = lazy(() => import("./component/WelcomePage"));

const App = () => {

  const authData: any = useAuth();

  console.log("authdata : ", authData.data);

  // const isBotSelected = useRef(authData.)
  const params = useParams();

  console.log("params :", params);

  // useEffect(() => {
  //   // authData.checkIfLoggedIn();
  //   // eslint-disable-next-line
  // }, []);

  return (
    <>
      <Suspense fallback={<h1>Loading...</h1>}>
        {
          authData.data.isLoggedIn ?
            <div className="container">

              {/* Left Side panel Container */}
              <div className="container-left">

                {/* Logo -> situated at left top most corner */}
                <NavLink to="/" className="logo-container" style={{ backgroundColor: "white" }}>
                  <img title="Talk Fusion" alt="logo" src="https://vil-email-sprint-dashboard.oriserve.com/static/media/ori-logo-solo.2b103573806a735ad176.png" style={{ width: "45%", marginBottom: "0.5rem" }} />
                  <center><p>v{import.meta.env.VITE_APP_VERSION}</p></center>
                </NavLink>

                {/* Rendering all the routes */}

                {/* rendering route when bot is selected by user */}
                <NavLink target="_blank" to={`https://mrityunjay.site`} className="logo-container" style={{ display: "grid", placeItems: "center", width: "100%", margin: "0.3rem", padding: "1rem", backgroundColor: "lightgrey" }}>
                  <h1><HeatMapOutlined /></h1>
                  <p>Help</p>
                </NavLink>

                {
                  authData?.data?.isBotSelectedForEditing && routes?.map((route: any, index) => {
                    return (
                      <>
                        <NavLink key={index} to={`/manage-bot/${authData?.data?.botId}/${route?.routeUrl}`} className={({ isActive }) => (["nav-link", isActive ? "active" : null].join(" "))} >
                          <h1>{route.icon}</h1>
                          <p>{route?.routeName}</p>
                        </NavLink>
                      </>
                    );
                  })
                }

              </div>

              {/* Right Side panel Container */}
              <div className="container-right">

                {/* Routes Listed over here are protected */}
                <Routes>

                  {/* Why this is not required as i am already checking auth status above to render this block of code */}
                  {/* <Route element={<PrivateRoutes />}> */}
                  {/* </Route> */}

                  <Route path="/" element={<WelcomePage />} />
                  <Route path="/home" element={<WelcomePage />} />
                  {/* <Route path="/chatHistory" element={<ChatHistory />} />
                  <Route path="/liveConversations" element={<LiveChat />} /> */}

                  <Route path="/manage-bot/:botId/" >
                    <Route index path="" element={<Summary />} />
                    <Route path="chatHistory" element={<ChatHistory />} />

                    {/* AI Training Routes */}
                    <Route path="qnaTrain" element={<QnATraning />} />

                    {/* Testing the Bot */}
                    <Route path="test-bot" element={<TestBot />} />

                  </Route>

                  {/* Create Bot Route */}
                  <Route path="/create-bot" element={<CreateBot />} />

                  {/* handling Auth Routes */}
                  <Route path="/login" element={<Navigate to="/" />} />
                  <Route path="/signup" element={<Navigate to="/" />} />
                  <Route path="/forget-password" element={<Navigate to="/" />} />


                  {/* If there is no match for any route simply show 404 not found page */}
                  <Route path="/*" element={<PageNotFound />} />

                </Routes>

              </div>

            </div>
            :
            <Routes>
              <Route index path="/" element={<RouterPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/*" element={<><Navigate to="/login" /></>} />
            </Routes>
        }

      </Suspense>
    </>
  );
}

export default App;