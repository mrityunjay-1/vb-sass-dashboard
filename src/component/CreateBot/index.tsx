// import { NavLink, useParams } from "react-router-dom";
import Header from "../Header/Header";
import { useState } from "react";
// import { useAuth } from "../../context/AuthContext";
import fetchData from "../../data/fetchData";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const CreateBot = () => {

    // const params = useParams();
    // const auth: any = useAuth();

    const navigate = useNavigate();

    // console.log("Params: ", params);

    // useEffect(() => {
    //     auth.setBotInContext(params.botId);
    // }, []);

    const [botName, setBotName] = useState("");

    const createBot = async () => {
        try {

            const res = await fetchData({
                url: "/createBot",
                method: "POST",
                data: {
                    botName,
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("Response : ", res);

            if (res) {
                message.success("Bot Succesfully Created");
                navigate("/");
            }

        } catch (err) {
            console.log("Error: ", err);
        }
    }

    return (
        <>

            <Header Title="Create Bot" />

            <div>
                <h1>Let's Create Bot</h1>

                <input
                    type="text"
                    value={botName}
                    onChange={(e) => {
                        setBotName(e.target.value);
                    }}
                />

                <button onClick={createBot}>Create</button>
            </div>

            {/* <Navigate to="/channels"></Navigate> */}

            {/* <NavLink to="channels">Channel</NavLink> */}
        </>
    );
}

export default CreateBot;