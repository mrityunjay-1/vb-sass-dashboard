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

            if (!botName) {
                return message.error("Please enter bot name to be created!");
            }

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

            <div style={{ flex: 1, display: "grid", placeItems: "center", marginTop: "2rem" }}>

                <div style={{ width: "80%", backgroundColor: "white", border: "0.01rem solid grey", padding: "2rem", display: "flex", flexDirection: "column"}}>

                    <h1>Let's Create Bot</h1>

                    <br />
                    <br />

                    <input
                        type="text"
                        value={botName}
                        onChange={(e) => {
                            setBotName(e.target.value);
                        }}
                        style={{ padding: "1rem" }}
                        placeholder="Bot Name"
                    />

                    <br />
                    <br />

                    <button onClick={createBot}>Create</button>

                </div>

            </div>

            {/* <Navigate to="/channels"></Navigate> */}

            {/* <NavLink to="channels">Channel</NavLink> */}
        </>
    );
}

export default CreateBot;