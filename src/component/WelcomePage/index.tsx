import { NavLink, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import fetchData from "../../data/fetchData";
import { BoxPlotFilled, DeleteFilled, EditFilled, HomeFilled, ReadOutlined, TransactionOutlined } from "@ant-design/icons";
import { message } from "antd";

import "./css/index.css";

const WelcomePage = () => {

    const auth: any = useAuth();

    const [bots, setBots] = useState([]);

    const navigate = useNavigate();

    const fetchBotList = async () => {
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

    const deleteBot = async (bot: any) => {
        try {

            const confirmation = window.confirm("Are you sure ?");

            console.log("confirmation: ", confirmation);

            if (confirmation) {
                const res = await fetchData({ url: `/deleteBot/${bot._id}` });
                console.log("Response : ", res);

                if (res) {
                    message.success(res.message);
                    fetchBotList();
                }
            }


        } catch (err) {
            console.log("Error: ", err);
        }
    }

    useEffect(() => {

        auth.checkIfLoggedIn();

        fetchBotList();

    }, []);

    return (
        <>
            <Header>
                <span style={{ fontSize: "1.7rem", fontWeight: 599 }}>WELCOME TO VOICE BOT</span>
            </Header>

            <div className="bot-container">

                <NavLink to="/create-bot" className="bot-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <br />
                    <h1>+</h1>
                    <br />
                    <br />
                    <h1>Create Bot</h1>
                    <br />
                    <br />
                </NavLink>

                {
                    bots?.map((bot: any) => {
                        return (
                            <div className="bot-card">
                                {/* header */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                    <div style={{ flex: 0.1 }}>
                                        <p style={{ fontSize: "2rem" }}><HomeFilled /></p>
                                    </div>

                                    <div style={{ flex: 0.7 }}>
                                        <h1 style={{ color: "grey" }}>{bot.botName}</h1>
                                        <p>Name</p>
                                    </div>

                                    <div style={{ flex: 0.2, display: "flex", justifyContent: "flex-end" }}>
                                        <p style={{ fontSize: "2rem", cursor: "pointer" }} onClick={() => navigate(`manage-bot/${bot.botId}`)}><BoxPlotFilled /></p>
                                    </div>

                                </div>

                                <hr style={{ border: "0.01rem solid lightgrey", margin: "1rem 0" }} />

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div>
                                        <button style={{ marginRight: "1rem" }} onClick={() => navigate(`manage-bot/${bot.botId}/qnaTrain`)}> Train <TransactionOutlined /></button>
                                        <button onClick={() => navigate(`manage-bot/${bot.botId}/test-bot`)}> Test <ReadOutlined /></button>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <button onClick={() => navigate(`manage-bot/${bot.botId}`)} style={{ marginRight: "1rem" }}> Edit <EditFilled /></button>
                                        <button onClick={() => deleteBot(bot)}> Delete <DeleteFilled /></button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

        </>
    );
}

export default WelcomePage;