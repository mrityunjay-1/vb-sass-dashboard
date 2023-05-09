import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const RouterPage = () => {

    const authData: any = useAuth();
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!authData.data.isLoggedIn) {
    //         navigate("/login");
    //     } else {
    //         navigate("/");
    //     }
    //     // eslint-disable-next-line
    // }, []);

    return (
        <>

            {
                authData.data.isLoggedIn ?
                    <Outlet />
                    :
                    <Navigate to={"/login"} />
            }

        </>
    );
}

export default RouterPage;