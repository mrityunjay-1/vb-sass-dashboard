
import { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import "./css/call-history.css";

import socketIOClient from "socket.io-client";

import Filter from "./Filter";
import { useAuth } from "../../context/AuthContext";
import { DislikeOutlined, LikeOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
// import fetchData from "../../data/fetchData";

let socket;

const Caller = ({ details, currSession }: any) => {

    return (
        <>
            <div onClick={() => details.callback(details.sessionId, details)} className="caller" style={{ borderRadius: "0.3rem", padding: "1.5rem 1rem", display: "flex", borderBottom: "0.01rem solid lightgrey", backgroundColor: currSession === details.sessionId ? "#e6e6e6" : "white" }}>

                <div style={{ width: "14%" }}>

                    <h3 style={{ backgroundColor: "rgb(169,253, 166)", width: "2.5rem", height: "2.5rem", border: "0.1rem rgb(169,253, 166) grey", borderRadius: "4rem", display: "grid", placeItems: "center" }}>
                        {details?.name ? details?.name[0] : "P"}
                    </h3>

                </div>

                <div style={{ width: "78%", padding: "0.2rem 1rem", display: "flex", flexDirection: "column" }}>
                    <h2 style={{ marginBottom: "0.5rem" }}>{details?.name ? (details?.name + " - Ph: ") : "User Name"}{details?.phone ?? ""}</h2>
                    <p title={`unique conversation id : ${details?.sessionId}`} style={{ color: "darkgrey" }}>CID: {details?.sessionId ?? "Alsngfkdfngknjdfnjhkgfjnhkjfgnkhn"}</p>
                    <br />
                    <p title={`startDateTime : ${details?.startDateTime}`} style={{ color: "darkgrey" }}>{details?.startDateTime ? new Date(details?.startDateTime).toLocaleString() : ""}</p>
                </div>

            </div>

        </>
    );
}

const ChatHistory = () => {

    const authData: any = useAuth();

    const params = useParams();

    // console.log("authdata in chat history page: ", authData);

    const [allSessions, setAllSessions]: any = useState([]);

    const [currSession, setCurrSession] = useState("");

    const currSelectedSession: any = useRef(null);
    const actualLogsViewer: any = useRef(null);

    const [currSessionDetails, setCurrSessionDetails]: [any, any] = useState([]);

    const [currSessionUserDetails, setCurrSessionUserDetails] = useState({ name: "", phone: "", email: "" });

    const [currLiveUsers, setCurrLiveUsers] = useState([]);

    const [skip, setSkip] = useState(0);

    // isLazyLoadingForSessions
    const [isLazyLoadingForSessions, setIsLazyLoadingForSessions] = useState(false);

    // const [audio, setAudio] = useState();
    // var audio = new Audio('http://localhost:5000/MZ1ba472049bedce2be9bd15febdb89542/user_20230221144755.wav');
    // audio.play();

    const getAllSessions = async () => {
        try {

            const raw_res = await fetch(`${import.meta.env.VITE_SERVER_URL}/getAllTheSessions?skip=${skip}&limit=15`, {
                headers: {
                    "Authorization": "Bearer " + authData.data.token
                }
            });
            const res = await raw_res.json();

            // console.log("response for getting all the sessions: ", res);

            if (!res || res.length === 0) {
                console.error("Error ocurred: ");
                return null;
            }

            setAllSessions([...allSessions, ...res]);

            setIsLazyLoadingForSessions(false);

        } catch (err) {
            console.log("err: ", err);
            setIsLazyLoadingForSessions(false);
        }
    }

    const getSessionDetails = async (sessionId: string) => {
        try {

            console.log("sessionId: ", sessionId);

            const raw_res = await fetch(`${import.meta.env.VITE_SERVER_URL}/getSession/${sessionId}`, {
                headers: {
                    "Authorization": "Bearer " + authData.data.token
                }
            });
            const res = await raw_res.json();

            console.log("Response: ", res);

            if (!res || res.length === 0) {
                console.error("Error ocurred: ");
                setCurrSessionDetails([]);
                return null;
            }
            else {
                setCurrSessionDetails(res);
            }

        } catch (err) {
            console.error(err);
            setCurrSessionDetails([]);
        }
    }

    let aud: any;

    const playPauseAudio = (url: string) => {

        if (aud) aud.pause(); // clears memory for previous audio play if any

        const audio = new Audio(url);
        audio.play();

        aud = audio;

    }

    const loadMoreSessions = (e: any) => {
        try {
            const { offsetHeight, scrollTop, scrollHeight } = e.target;

            if (scrollHeight - (offsetHeight + scrollTop) < 10) {
                if (skip === allSessions.length) {
                    setIsLazyLoadingForSessions(false);
                    return;
                };
                setSkip(allSessions.length);
                setIsLazyLoadingForSessions(true);
            }
        } catch (err) {
            console.log("Error in loadMoreSessions function: ", err);
        }
    }

    // use effect for loading all the sessions
    // dependency is skip as whenvever this skip state change i need to load the next batch of sessions...
    useEffect(() => {
        getAllSessions();
        // eslint-disable-next-line
    }, [skip]);

    // used for loading the selected session details 
    // you can also check the dependency provided to use Effect
    useEffect(() => {

        authData.setBotInContext(params.botId);

        if (currSession) getSessionDetails(currSession);

        // eslint-disable-next-line
    }, [currSession]);

    // general useEffect for socket communication
    // initializing socket to backend server
    // also listening various events like "getLiveUsers", "showLiveUsers", "liveBroadcastChatData"
    // the basic idea to use this is to load the real time chat feed here in this component
    useEffect(() => {

        socket = socketIOClient(`${import.meta.env.VITE_SERVER_URL}`);

        socket.emit("getLiveUsers", "");

        socket.on("showliveUsers", (users) => {
            // console.log("Users: ", users);
            setCurrLiveUsers(users);
        });

        socket.on("liveBroadcastChatData", (data) => {

            console.log("currSession: ", currSelectedSession.current);
            console.log("liveBroadcastChatData events says: ", data);

            if (currSelectedSession.current === data.socketId) {

                console.log("actualLogsViewer : ", actualLogsViewer.current);

                const { offsetHeight, scrollTop, scrollHeight } = actualLogsViewer.current;

                console.log({ offsetHeight, scrollTop, scrollHeight });

                // console.log({ offsetHeight, scrollTop, scrollHeight });

                // if (offsetHeight + scrollTop === scrollHeight) {
                actualLogsViewer.current.scrollIntoView({
                    behavior: "smooth"
                })
                // }

                setCurrSessionDetails(data.chat_session_data);
            }

        });

    }, []);

    useEffect(() => {

        if (currLiveUsers?.length === 0) {
            setCurrSessionDetails([]);
            setCurrSession("");
            currSelectedSession.current = null;
            setCurrSessionUserDetails({ name: "", phone: "", email: "" });
        } else {
            getAllSessions();
        }
        // eslint-disable-next-line
    }, [currLiveUsers]);

    return (
        <div className="call-history-container">

            <div className="call-history-container-header" style={{}}>
                <Header>
                    <span>CALL HISTORY</span>
                </Header>
            </div>

            <div className="call-history-container-summary-filter">
                {/* Filter goes here */}

                <Filter
                    callback={(filter: any) => {
                        console.log("selected filter : ", filter);
                    }}
                />

            </div>

            <div className="call-history-container-data-viewer">

                {/* child - 1 */}
                <div>

                    <div style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem", position: "sticky", top: 0, padding: "1.5rem", display: "grid", placeItems: "center", backgroundColor: "rgb(169,253, 166)", height: "3rem" }}>
                        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>Call History Data</span>
                    </div>

                    <div onScroll={loadMoreSessions} style={{ overflowY: "scroll", padding: "1rem" }}>

                        {/* Live users feed */}
                        {
                            currLiveUsers?.length > 0 ?
                                <>
                                    <div style={{ padding: "1rem 0", borderBottom: "0.1rem solid grey" }}>
                                        <h2>Live Chats</h2>
                                        <br />
                                        {
                                            currLiveUsers?.map((liveUser: any) => {
                                                return (
                                                    <>
                                                        <Caller
                                                            currSession={currSession}
                                                            details={{
                                                                sessionId: liveUser.socketId,
                                                                ...liveUser,
                                                                callback: (sid: string, user_details: any) => {
                                                                    setCurrSession(sid);
                                                                    currSelectedSession.current = sid;
                                                                    setCurrSessionUserDetails(user_details);
                                                                }
                                                            }}
                                                        />
                                                    </>
                                                );
                                            })
                                        }
                                    </div>
                                </>
                                :
                                null
                        }

                        {/* Already Completed sessions meaning history of the sessions... */}

                        {
                            allSessions && allSessions.map((sid: any) => {
                                return (
                                    <Caller
                                        currSession={currSession}
                                        details={{
                                            sessionId: sid.socketId,
                                            ...sid,
                                            callback: (sid: string, user_details: any) => {
                                                setCurrSession(sid);
                                                currSelectedSession.current = sid;
                                                setCurrSessionUserDetails(user_details);
                                            }
                                        }}
                                    />
                                );
                            })
                        }
                    </div>

                    {
                        isLazyLoadingForSessions ?
                            <>
                                <h1 style={{ fontSize: "4rem", textAlign: "center" }}>Loading...</h1>
                            </>
                            :
                            null
                    }

                </div>

                {/* Child - 2 showing actual logs */}
                <div>

                    <div style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem", position: "sticky", top: 0, padding: "1.5rem", display: "grid", placeItems: "center", backgroundColor: "rgb(233, 233, 233)", height: "3rem" }}>
                        <span style={{ fontSize: "1.4rem", fontWeight: "bold" }}>Call History Data</span>
                    </div>

                    <div id="actual-logs-viewer" style={{ overflowY: "scroll", padding: "1rem" }}>
                        {
                            Array.isArray(currSessionDetails) && currSessionDetails.length > 0 && currSessionDetails.map((chats: { user: { time: string, text: string, audio: string }, bot: { time: string, text: string, audio: string } }) => {

                                let date = chats?.user?.time;
                                let time = chats?.user?.time;

                                date = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
                                time = time.substring(8, 10) + ":" + time.substring(10, 12) + ":" + time.substring(12, 14);

                                console.log("date: ", date);

                                return (
                                    <div style={{ display: "flex", flexDirection: "column", fontSize: "1.4rem" }}>

                                        {/* User hai mai */}{
                                            chats?.user?.text && chats?.user?.audio ?
                                                <>
                                                    <div style={{ display: "flex", marginTop: "2rem", alignItems: "center" }}>

                                                        <div style={{ width: "6%" }}>
                                                            <h3 style={{ backgroundColor: "rgb(169,253, 166)", width: "2.5rem", height: "2.5rem", border: "0.1rem rgb(169,253, 166) grey", borderRadius: "4rem", display: "grid", placeItems: "center" }}>
                                                                U
                                                            </h3>
                                                        </div>

                                                        <p style={{ maxWidth: "60%", width: "auto", backgroundColor: "lightgreen", borderRadius: "1rem", padding: "1rem" }}>
                                                            {

                                                                chats?.user?.text ?? null
                                                            }

                                                            <br />
                                                            <br />
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

                                                                <div>
                                                                    <p style={{ color: "grey", fontSize: "1rem" }}>{time}</p>
                                                                </div>

                                                            </div>

                                                        </p>

                                                        <p onClick={() => playPauseAudio(chats?.user?.audio)} style={{ cursor: "pointer", width: "5%", marginLeft: "1rem" }}>

                                                            🔉

                                                        </p>

                                                    </div>
                                                </>
                                                :
                                                null
                                        }

                                        {/* aur bot hai mai */}

                                        {
                                            chats?.bot?.text && chats?.bot?.audio ?
                                                <>
                                                    <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>

                                                        <p onClick={() => playPauseAudio(chats?.bot?.audio)} style={{ cursor: "pointer", width: "5%" }}>
                                                            🔉
                                                        </p>

                                                        <div style={{ marginLeft: "1rem", width: "7%", order: 2 }}>
                                                            <h3 style={{ backgroundColor: "rgb(169,253, 166)", width: "2.5rem", height: "2.5rem", border: "0.1rem rgb(169,253, 166) grey", borderRadius: "4rem", display: "grid", placeItems: "center" }}>
                                                                B
                                                            </h3>
                                                        </div>


                                                        <p style={{ border: "0.01rem solid lightgrey", maxWidth: "60%", minWidth: "20%", width: "auto", backgroundColor: "white", borderRadius: "1rem", padding: "1rem" }}>
                                                            {
                                                                chats?.bot?.text ?? null
                                                            }

                                                            <br />
                                                            <br />
                                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>

                                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                    <p className="like-button" title="Like This Response"><LikeOutlined /></p>
                                                                    <p className="dislike-button" title="Dislike This Response"><DislikeOutlined /></p>
                                                                </div>

                                                                <div>
                                                                    <p style={{ color: "grey", fontSize: "1rem" }}>{time}</p>
                                                                </div>

                                                            </div>
                                                        </p>

                                                    </div>

                                                </>
                                                :
                                                null
                                        }

                                    </div>
                                );
                            })
                        }

                        {/* If there is no chats to show */}
                        {
                            !(currSessionDetails?.length > 0) ?
                                <p style={{ textAlign: "center" }}>There is no chat logs for this chat as of now...</p>
                                :
                                null
                        }

                        <div ref={actualLogsViewer} />

                    </div>
                </div>

                {/* User profile details */}

                <div style={{ overflowY: "scroll" }}>

                    <div style={{ display: "flex", padding: "1rem", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <p style={{ fontSize: "4rem", color: "grey", width: "8rem", height: "8rem", backgroundColor: "lightgreen", borderRadius: "10rem", display: "grid", placeItems: "center" }}>
                            {/* <img src="https://mrityunjay-1.github.io/portfolio/static/media/my_profile_img.fdf6ddba.png" alt="profileimage" style={{ width: "100%", height: "100%", borderRadius: "10rem" }} /> */}

                            {/* <h3 style={{ backgroundColor: "rgb(169,253, 166)", width: "2.5rem", height: "2.5rem", border: "0.1rem rgb(169,253, 166) grey", borderRadius: "4rem", display: "grid", placeItems: "center" }}> */}
                            {(currSessionUserDetails && currSessionUserDetails?.name) ? currSessionUserDetails?.name[0] : "P"}
                            {/* </h3> */}
                        </p>
                        <br />
                        <p style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{(currSessionUserDetails && currSessionUserDetails?.name) ? currSessionUserDetails?.name : "User Name: NA"}</p>
                        <p style={{ fontSize: "1.2rem", color: "grey" }}>{(currSessionUserDetails && currSessionUserDetails?.email) ? (currSessionUserDetails?.email + " | ") : ""}{(currSessionUserDetails && currSessionUserDetails?.phone) ? currSessionUserDetails?.phone : "Phone: NA"}</p>

                        {/* Making custom audio player in js */}

                        <br />
                        {/* <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div className="audio-player-controller">
                                <p style={{ cursor: "pointer" }}>🔉</p>
                                <input type="range" id="audio-seek-bar" style={{ cursor: "pointer", accentColor: "green", height: "0.3rem", width: "60%" }} />
                                <p style={{ cursor: "pointer" }}>▶️</p>
                                <p style={{ cursor: "pointer" }}>⏸️</p>

                                <p>12:00 / 30:00</p>
                            </div>
                        </div> */}

                        <audio controls style={{ height: "2.5rem", width: "100%" }}>
                            <source src="" />
                        </audio>
                    </div>

                    <hr />
                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> USER DETAILS </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Name
                            </p>
                            <p>
                                {(currSessionUserDetails && currSessionUserDetails?.name) ? currSessionUserDetails?.name : "NA"}
                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Eamil
                            </p>
                            <p>
                                {(currSessionUserDetails && currSessionUserDetails?.email) ? currSessionUserDetails?.email : "NA"}
                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Phone
                            </p>
                            <p>
                                {(currSessionUserDetails && currSessionUserDetails?.phone) ? currSessionUserDetails?.phone : "NA"}
                            </p>
                        </div>
                    </div>
                    <hr />
                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> LIVE CHAT DETAILS </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Agent ID
                            </p>
                            <p>

                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Agent Name
                            </p>
                            <p>

                            </p>
                        </div>

                    </div>
                    <hr />

                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> USAGE PROFILE </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Account Id
                            </p>
                            <p>

                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Account Status
                            </p>
                            <p>

                            </p>
                        </div>


                    </div>
                    <hr />

                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> USER SENTIMENTS </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Sentiment
                            </p>
                            <p>
                                Neutral
                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Score
                            </p>
                            <p>
                                0.9
                            </p>
                        </div>

                    </div>
                    <hr />

                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> NOTES </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Untitled
                            </p>
                            <p>

                            </p>
                        </div>

                    </div>

                    {/* 
                    
                    <hr />
                    <div style={{ padding: "1rem", margin: "1rem 0" }}>
                        <h3 style={{}}> TICKET - FRESHDESK </h3>

                        <br />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Name
                            </p>
                            <p>
                                Mrityunjay Kumar
                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Name
                            </p>
                            <p>
                                Mrityunjay Kumar
                            </p>
                        </div>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <p>
                                Name
                            </p>
                            <p>
                                Mrityunjay Kumar
                            </p>
                        </div>
                    </div>
                    <hr />
                     */}
                </div>


            </div>

        </div>
    );

}

export default ChatHistory;