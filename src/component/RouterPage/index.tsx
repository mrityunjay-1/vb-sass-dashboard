import { useAuth } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const RouterPage = () => {

    const authData: any = useAuth();

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