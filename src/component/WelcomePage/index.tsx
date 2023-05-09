import { NavLink } from "react-router-dom";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const WelcomePage = () => {

    const auth: any = useAuth();

    useEffect(() => {
        auth.checkIfLoggedIn();
    }, []);

    return (
        <>
            <Header>
                <span style={{ fontSize: "1.7rem", fontWeight: 599 }}>WELCOME TO VOICE BOT</span>
            </Header>

            {/* <h1>Welcome</h1> */}

            <NavLink to={"/create-bot"}>Create Bot</NavLink>

        </>
    );
}

export default WelcomePage;