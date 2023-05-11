import { useParams } from "react-router-dom";
import Header from "../../../component/Header/Header";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./css/index.css";
import { message } from "antd";
import { FileAddFilled, FolderAddOutlined } from "@ant-design/icons";
import fetchData from "../../../data/fetchData";
import AddQnA from "./AddUpdateDeleteQnA";

import { v4 } from "uuid";

const QnATraning = () => {

    const auth: any = useAuth();
    const params: any = useParams();

    const [limit, _setLimit] = useState(30);
    const [skip, _setSkip] = useState(0);

    const [qnaData, setQnaData]: any = useState([]);

    console.log("qnaData : ", qnaData);

    const [showUploadFileModal, setShowUploadFileModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [fileData, setFileData] = useState([]);

    const [addQnA, setAddQnA] = useState(false);

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
                setFileData([]);
                setErrorMessage(res.message);
                return;
            }

            if (!res) {
                setFileData([]);
                return message.error("File Upload failed!");
            }

            if (res && res.message && res.message.data) {
                setErrorMessage("");
                message.success("File data successfully verified. Please verify once by yourself then proceed to upload!");
                setFileData(res.message.data);
            } else {
                throw new Error("invalid response from server");
            }

        } catch (err) {
            setFileData([]);
            console.log("Error in uploadFileAndGetData: ", err);
            message.error("File Upload failed!");
        }
    }

    const finalUploadForQnATraining = async () => {
        try {

            console.log("finalUploadForQnATraining fn called...");

            // Let's Modify our data in more efficient way
            const answers = fileData.map((qna: any) => qna.answer);
            const unique_answer = Array.from(new Set(answers));

            const finalData = [];

            for (const answer of unique_answer) {

                let question: any = [];

                fileData.forEach((qna: any) => {
                    if (qna.answer === answer)
                        question.push(qna.question)
                });

                let obj = { answer, question };
                finalData.push(obj);
            }

            // Finally our final data is prepared we are all set to send it to server for training

            console.log("finalData : ", finalData)

            const res = await fetchData({
                url: "/finalDataForQnaTraining",
                method: "POST",
                data: {
                    botId: auth.data.botId,
                    qnaData: finalData
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!res) {
                return message.error("Upload Failed...");
            }

            console.log("response from server at finalDataForQnaTraining route : ", res);


        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const reset = () => {
        try {

            setErrorMessage("");
            setFileData([]);

            const fileTag: any = document.getElementById("file");
            fileTag.value = "";

        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const loadQnaData = async () => {
        try {

            console.log("getBotQnaTraningData fn called...");

            console.log("params.botId : ", params.botId);


            const res = await fetchData({
                url: `/getBotQnaTraningData/${params.botId}?skip=${skip}&limit=${limit}`
            });

            if (!res) {
                throw new Error("Error while fetching the qna data");
            }

            console.log("res for load qna data : ", res);

            setQnaData([...res]);
            // localStorage && localStorage.setItem("qnaData", JSON.stringify(res));

        } catch (err) {
            console.log("Error while loadQnaData : ", err);
        }
    }

    useEffect(() => {

        auth.setBotInContext(params.botId);

        loadQnaData();

    }, []);

    // useEffect(() => {
    //     loadQnaData();
    // }, [auth])

    useEffect(() => {

    }, [skip, limit]);

    return (
        <>

            {/* Modal for Uploading the file */}
            {
                showUploadFileModal ?
                    <>

                        <div style={{ zIndex: 99999, display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "fixed", top: 0, left: 0, background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(10px)" }}>

                            {/* Child 1 -> contains form for uploading xlsx file that contains question and answer */}
                            <div style={{ padding: "1rem 3rem" }}>

                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <p style={{ fontSize: "1.6rem", fontWeight: "bold", color: "green" }}>UPLOAD FILE TO TRAIN BOT</p>
                                    <input id="file" type="file" accept=".xlsx" style={{ flex: 0.7, border: "0.1rem solid grey", textAlign: "center", backgroundColor: "white", padding: "0.5rem" }} />
                                    <button onClick={uploadFileAndGetData} type="submit" style={{ flex: 0.2, padding: "0.8rem", border: "0.1rem solid grey" }}> Upload </button>
                                </div>

                            </div>

                            {
                                errorMessage ?
                                    <pre style={{ flex: 1, overflow: "auto", color: "red", fontSize: "1.6rem", padding: "1rem 3rem", }}>
                                        Error Occured In File Data <br /><br />

                                        {errorMessage}
                                    </pre>
                                    :

                                    // This is child - 2
                                    <div style={{ margin: "0 3rem", border: "0.1rem solid lightgrey", overflowY: "scroll", flex: 1 }}>


                                        {
                                            fileData?.length === 0 ?
                                                <div style={{ height: "100%", display: "grid", placeItems: "center" }}>
                                                    <h1>Question Answers Will be shown here to cross check...</h1>
                                                </div>
                                                :
                                                <>
                                                    <div style={{ position: "sticky", top: 0, backgroundColor: "white", display: "flex", borderBottom: "0.01rem solid grey" }}>
                                                        <h2 style={{ padding: "1.5rem 0rem", flex: 0.1, textAlign: "center" }}>SR</h2>
                                                        <h2 style={{ padding: "1.5rem 0rem", flex: 0.4 }}>Question</h2>
                                                        <h2 style={{ padding: "1.5rem 0rem", flex: 0.4 }}>Answer</h2>
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
                            }

                            {/* Child 3 -> contains buttons for verify and upload, close and content upload type */}
                            <div style={{ margin: "0 3rem", display: "flex", justifyContent: "flex-end" }}>

                                <label style={{ display: "flex", alignItems: "center", width: "10%" }}>
                                    <input type="radio" name="dataType" style={{ marginRight: "1rem", fontSize: "3rem" }} />
                                    <p style={{ fontSize: "1.6rem" }}>Append</p>
                                </label>

                                <label style={{ display: "flex", alignItems: "center", width: "10%" }}>
                                    <input type="radio" name="dataType" style={{ marginRight: "1rem", fontSize: "3rem" }} />
                                    <p style={{ fontSize: "1.6rem" }}>Overwrite</p>
                                </label>

                                <button onClick={() => reset()} style={{ marginRight: "1rem", background: "orange", color: "white" }}>Reset</button>
                                <button onClick={finalUploadForQnATraining} style={{ marginRight: "1rem", }}>Upload</button>
                                <button onClick={() => setShowUploadFileModal(false)} style={{ marginRight: "1rem", background: "red", color: "white" }}>&times; Close</button>
                            </div>

                        </div>

                    </>
                    :
                    null
            }

            {/* File uploader */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", }}>

                <div>
                    <Header> <span style={{ fontSize: "1.7rem", fontWeight: 599 }}>QnA Traning</span> </Header>
                </div>

                <div className="main-container" id="cont">

                    {/* Child 1 -> contains form for uploading xlsx file that contains question and answer */}
                    <div className="main-container-child-1">
                        <button style={{ background: "lightgreen", fontSize: "1.6rem", fontWeight: "normal", padding: "0.6rem 1.2rem", marginRight: "1rem" }} onClick={() => setShowUploadFileModal(true)}> <FolderAddOutlined /> &nbsp; Train Bot By File Upload </button>
                        <button style={{ background: "lightgreen", fontSize: "1.6rem", fontWeight: "normal", padding: "0.6rem 1.2rem" }} onClick={() => { setAddQnA(true); }}> <FileAddFilled /> Add QnA </button>
                    </div>

                    {/* QnA Add */}
                    <div className="main-container-child-2" style={{ padding: "1rem 1rem" }}>
                        {
                            addQnA ?
                                <AddQnA
                                    isNew={true}
                                    question={[]}
                                    answer={""}
                                    onCancel={(res: boolean) => setAddQnA(res)}
                                    isInEditMode={true}
                                    botId={params.botId}
                                    onSave={(newQna: any) => {
                                        setQnaData([newQna, ...qnaData]);
                                        setAddQnA(false);
                                    }}
                                />
                                :
                                null
                        }
                    </div>

                    {/* Child 2 -> contains the user sheet data for review */}
                    <div className="main-container-child-3">

                        {
                            qnaData?.length === 0 ?
                                <h1 style={{ textAlign: "center" }}>No QnA Data Added.</h1>
                                :
                                null
                        }

                        {
                            qnaData?.map((qna: any) => {
                                return (
                                    <div style={{ borderRadius: "0.5rem" }} key={v4()}>
                                        <AddQnA
                                            isNew={false}
                                            question={qna.question}
                                            answer={qna.answer}
                                            qna={qna}
                                            botId={params.botId}
                                            onSave={() => {
                                                loadQnaData();
                                            }}
                                            onUpdate={() => {
                                                loadQnaData();
                                            }}
                                        />

                                    </div>
                                )
                            })
                        }
                    </div>

                </div>

            </div>

        </>
    );
}

export default QnATraning;