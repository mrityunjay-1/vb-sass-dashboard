import { NavLink, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import fetchData from "../../data/fetchData";

const WelcomePage = () => {

    const auth: any = useAuth();

    const [bots, setBots] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        auth.checkIfLoggedIn();

        (
            async () => {
                try {

                    const res = await fetchData({
                        url: "/getAllBots"
                    });

                    console.log("response: ", res);

                    if (res) {
                        setBots(res.reverse());
                    }

                } catch (err) {
                    console.log("Error : ", err);
                }
            }
        )();

    }, []);

    return (
        <>
            <Header>
                <span style={{ fontSize: "1.7rem", fontWeight: 599 }}>WELCOME TO VOICE BOT</span>
            </Header>

            {/* <h1>Welcome</h1> */}

            <NavLink to={"/create-bot"}>Create Bot</NavLink>

            {
                bots?.map((bot: any) => {
                    return (
                        <div>
                            {bot.botName}

                            <button onClick={() => navigate(`manage-bot/${bot.botId}`)} >More</button>
                        </div>
                    );
                })
            }

        </>
    );
}

export default WelcomePage;