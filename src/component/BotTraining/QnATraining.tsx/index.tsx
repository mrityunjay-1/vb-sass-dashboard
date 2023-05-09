import { useParams } from "react-router-dom";
import Header from "../../../component/Header/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./css/index.css";
import { message } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";

const QnATraning = () => {

    const auth: any = useAuth();
    const params: any = useParams();

    const [shoUploadFileModal, setShoUploadFileModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [fileData, setFileData] = useState([]);

    const uploadFileAndGetData = async () => {
        try {

            const { files }: any = document.getElementById("file");

            if (files && files.length < 1) return message.error("Please upload file for training...");

            const file = files[0];

            if (!file.type.includes("spreadsheet")) return message.error("please upload xlsx file only!");

            // will add more verification regarding file here as per need

            const formData = new FormData();

            formData.append("tenantId", auth.data.tenantId);
            formData.append("botId", params.botId);

            formData.append("qna_data_file", file);

            const raw_res = await fetch(`${import.meta.env.VITE_SERVER_URL}/trainBotForQnA`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + auth.data.token
                },
                body: formData
            });

            console.log("raw Response: ", raw_res);


            const res = await raw_res.json();

            console.log("Response: ", res);


            if (raw_res.status === 400 && res.message) {
                setErrorMessage(res.message);
                return;
            }

            if (!res) {
                return message.error("File Upload failed!");
            }

            if (res && res.message && res.message.data) {
                setErrorMessage("");
                message.success("File Successfully uploaded!");
                setFileData(res.message.data);
            } else {
                throw new Error("invalid response from server");
            }

        } catch (err) {
            console.log("Error in uploadFileAndGetData: ", err);
            message.error("File Upload failed!");
        }
    }

    useEffect(() => {
        auth.setBotInContext(params.botId);
    }, [])

    return (
        <>

            {/* Modal for Uploading the file */}
            {
                shoUploadFileModal ?
                    <>

                        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "fixed", top: 0, left: 0, background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(10px)" }}>
                            {/* 
                            <div style={{ margin: "1rem 2rem", display: "flex", justifyContent: "flex-end", cursor: "pointer" }}>
                                <h1 onClick={() => setShoUploadFileModal(false)} style={{ fontSize: "3rem" }}>&times;</h1>
                            </div> */}

                            {/* Child 1 -> contains form for uploading xlsx file that contains question and answer */}
                            <div style={{ padding: "1rem 3rem" }}>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "green" }}>UPLOAD FILE TO TRAIN BOT</p>
                                    <input id="file" type="file" accept=".xlsx" style={{ flex: 0.7, border: "0.1rem solid grey", textAlign: "center", backgroundColor: "white", padding: "0.5rem" }} />
                                    <input onClick={uploadFileAndGetData} type="submit" style={{ flex: 0.2, padding: "0.8rem", border: "0.1rem solid grey" }} />
                                </div>

                            </div>

                            {
                                errorMessage ?
                                    <pre style={{ color: "red", fontSize: "1.6rem", padding: "1rem 3rem" }}>
                                        Error Occured In File Data <br /><br />

                                        {errorMessage}
                                    </pre>
                                    :
                                    null
                            }

                            {/* Child 2 -> contains the user sheet data for review */}
                            <div style={{ margin: "0 3rem", border: "0.1rem solid lightgrey", overflowY: "scroll", flex: 1 }}>


                                {
                                    fileData?.length === 0 ?
                                        <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
                                            <h1>Question Answers Will be shown here to cross check...</h1>
                                        </div>
                                        :
                                        <>
                                            <div style={{ position: "sticky", top: 0, backgroundColor: "white", display: "flex", borderBottom: "0.01rem solid grey", padding: "0.5rem" }}>
                                                <h2 style={{ flex: 0.1, textAlign: "center" }}>SR</h2>
                                                <h2 style={{ flex: 0.4 }}>Question</h2>
                                                <h2 style={{ flex: 0.4 }}>Answer</h2>
                                            </div>

                                            {
                                                fileData?.map((qa: any, index) => {
                                                    return (
                                                        <div style={{ display: "flex", borderBottom: "0.01rem solid grey", padding: "0.5rem" }}>
                                                            <p style={{ flex: 0.1, textAlign: "center" }}>{index + 1}</p>
                                                            <p style={{ flex: 0.4 }}>{qa.question}</p>
                                                            <p style={{ flex: 0.4 }}>{qa.answer}</p>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </>
                                }

                            </div>

                            <div style={{ margin: "0 3rem", display: "flex", justifyContent: "flex-end" }}>
                                <button onClick={() => setShoUploadFileModal(false)} style={{ marginRight: "1rem", background: "red", color: "white" }}>&times; Close</button>
                                <button style={{}} >Verified and Upload</button>
                            </div>

                        </div>

                    </>
                    :
                    null
            }


            {/* File uploader */}
            <div className="file-upload-container">

                <Header> <span style={{ fontSize: "1.7rem", fontWeight: 599 }}>QnA Traning</span> </Header>

                <div className="main-container">

                    {/* Child 1 -> contains form for uploading xlsx file that contains question and answer */}
                    <div>
                        <button style={{ background: "lightgreen", fontSize: "1.6rem", fontWeight: "normal", padding: "0.6rem 1.2rem" }} onClick={() => setShoUploadFileModal(true)}> <FolderAddOutlined /> &nbsp; Train Bot By File Upload </button>
                    </div>

                    {/* Child 2 -> contains the user sheet data for review */}
                    {/* <div>
                        <h1>Hi</h1>
                    </div> */}

                    {/* Child 3 -> contains simple submit button */}
                    {/* <div>
                        <input type="submit" style={{ border: "0.1rem solid grey", padding: "1rem", fontSize: "2rem" }} />
                    </div> */}

                </div>
            </div>

        </>
    );
}

export default QnATraning;