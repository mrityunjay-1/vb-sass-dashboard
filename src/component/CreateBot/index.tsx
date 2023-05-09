import { NavLink, Navigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CreateBot = () => {

    const params = useParams();
    const auth: any = useAuth();

    console.log("Params: ", params);

    useEffect(() => {
        auth.setBotInContext(params.botId);
    }, []);

    return (
        <>

            <Header Title="Create Bot" />

            <h1>Let's Create Bot</h1>

            {/* <Navigate to="/channels"></Navigate> */}

            <NavLink to="channels">Channel</NavLink>
        </>
    );
}

export default CreateBot;