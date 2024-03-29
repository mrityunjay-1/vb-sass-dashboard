import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Collapse, message } from "antd";
import { useEffect, useState } from "react";
import fetchData from "../../../data/fetchData";
import "./css/AddUpdateDeleteQnA.css";

const AddQnA = ({ botId, question, answer = "", qna, isNew = true, onCancel, isInEditMode = false, onSave, onUpdate }: any) => {

    // For Question
    const [questions, setQuestions]: any = useState(question ?? []);
    const [questionsDup, _setQuestionsDup] = useState(question ?? []);

    // This is temporary only while adding the question
    const [quest, setQuest] = useState("");

    // Answer
    const [ans, setAns] = useState(answer);
    const [ansDup, _setAnsDup] = useState(answer);

    const [editMode, setEditMode] = useState(isInEditMode);

    const saveQnA = async () => {
        try {

            const res = await fetchData({
                url: `/createQnA/${botId}`,
                method: "POST",
                data: {
                    question: questions,
                    answer: ans
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("res : ", res);

            if (!res) return message.error("something went wrong while creating the qna");

            message.success("QnA Successfully created.");

            onSave(res);

        } catch (err) {
            console.log("Error while saving qna : ", err);
        }
    }

    const deleteQnA = async () => {
        try {

            const res = await fetchData({
                url: `/deleteQnA/${qna._id}`
            });

            if (!res) return message.error("something went wrong while deleting the qna.");

            message.success("QnA successfully deleted...");

            onSave();

        } catch (err) {
            console.log("Error: ", err);
        }
    }

    const updateQnA = async () => {
        try {

            const res: any = await fetchData({
                url: `/updateQnA/${qna._id}`,
                method: "POST",
                data: {
                    question: questions,
                    answer: ans
                },
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log("res from update QNA API : ", res);

            if (!res) {
                message.error("Sorry, Something went wrong as empty response received from api...");
                throw new Error("something went wrong as empty response received from api...");
            }

            message.success("QnA Successfully updated.");

            onUpdate();

        } catch (err) {
            console.log("Error while updating QNA: ", err);
        }
    }

    useEffect(() => {

        if ((JSON.stringify(questions) !== JSON.stringify(questionsDup)) || ans !== ansDup) {
            setEditMode(true);
        }

    }, [questions, ans]);

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", paddingBottom: "2rem", border: "0.1rem solid darkgrey", borderRadius: "0.7rem", boxShadow: "0.1rem 0.1rem 1rem lightgrey" }}>

            {isNew ? <h1 style={{ padding: "1rem 2rem" }}>Add QnA</h1> : ""}

            {/* Question Area including long header */}
            <Collapse defaultActiveKey={isNew ? ['1'] : ['1']} ghost collapsible="icon" >
                <Collapse.Panel
                    key="1"
                    header={
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", }}>
                                <p style={{ fontSize: "1.4rem", fontWeight: "bold", marginRight: "2rem" }}>{questions[0] ?? "Question"}</p>
                                <span style={{ fontSize: "1rem", backgroundColor: "orange", width: "2rem", height: "2rem", display: "grid", placeItems: "center", borderRadius: "100rem" }}> {questions.length} </span>
                            </div>

                            {
                                !isNew ?
                                    <div style={{ display: "flex", }}>
                                        <p onClick={() => setEditMode(true)} style={{ cursor: "pointer", marginRight: "2rem" }}><EditFilled /></p>
                                        <p onClick={() => deleteQnA()} style={{ cursor: "pointer", }} ><DeleteFilled /></p>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    }>

                    <div style={{ display: "flex", flexDirection: "column", border: "0.01rem solid grey", borderRadius: "0.4rem", marginTop: "-1rem", padding: "1rem" }}>

                        <div id="questions-container" style={{ height: "auto", maxHeight: "10rem", overflow: "auto", scrollBehavior: "smooth", marginBottom: "0.8rem" }}>
                            {
                                questions?.map((q: string, index: number) => {
                                    return (
                                        <div key={(index * Math.random() * 100).toString()} style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ color: "grey", width: "10%" }}>{index + 1}</p>
                                            <p style={{ color: "grey", width: "85%" }}>{q}</p>
                                            <p onClick={() => {
                                                setQuestions((prevState: any) => {
                                                    return prevState.filter((q1: string) => q1 !== q);
                                                });
                                            }} style={{ cursor: "pointer", width: "5%" }}><DeleteFilled /></p>
                                        </div>
                                    );
                                })
                            }

                        </div>

                        <input
                            autoFocus={isNew ? true : false}
                            type="text"
                            value={quest}
                            onChange={(e: any) => {
                                setQuest(e.target.value);
                            }}
                            placeholder="Please Enter Your Queations Here"
                            style={{ flex: 1, padding: "0.5rem", outline: "none", border: "0.01rem solid grey" }}
                            onKeyDown={(e) => {

                                if (e.key === "Enter") {
                                    setQuest("");

                                    if (questions.includes(quest)) message.warning("Question already present!");

                                    setQuestions([...questions, quest]);
                                    const qc: any = document.getElementById("questions-container");
                                    setTimeout(() => qc.scrollTop = qc.scrollHeight, 100);
                                }
                            }}
                        />

                    </div>
                </Collapse.Panel>
            </Collapse>

            {/* Answer Area */}
            <Collapse accordion={false} defaultActiveKey={['1']} ghost
                collapsible="icon"
                style={{ backgroundColor: "#e6e6e6", border: "0.01rem solid grey", margin: "0 1.5rem" }}
            >
                <Collapse.Panel showArrow={false} header={<div style={{ display: "flex", alignItems: "center", fontWeight: "bold", }}><p style={{ fontSize: "1.4rem", marginRight: "2rem" }}>Answer</p> </div>} key="1">

                    <div style={{ display: "flex", flexDirection: "column", marginTop: "-1rem", }}>
                        <input
                            type="text"
                            value={ans}
                            onChange={(e: any) => {
                                setAns(e.target.value);
                            }}
                            placeholder="Please Enter Answer Here"
                            style={{ flex: 1, padding: "0.5rem", outline: "none", color: "grey", border: "0.01rem solid grey", borderRadius: "0.4rem" }}
                        />

                    </div>
                </Collapse.Panel>
            </Collapse>

            {
                editMode ?
                    <>
                        <div style={{ padding: "0 1.5rem", display: "flex", justifyContent: "center" }}>
                            <button
                                onClick={() => {
                                    if (isNew) {
                                        onCancel(false);
                                        return;
                                    }

                                    if (editMode) {
                                        setEditMode(false);
                                    }

                                }}
                                style={{ marginRight: "1rem", background: "pink" }}>
                                Cancel
                            </button>
                            {
                                isNew ?
                                    <button onClick={saveQnA}>Save</button>
                                    :
                                    <button onClick={updateQnA}>Update</button>
                            }
                        </div>
                    </>
                    :
                    null
            }

        </div>
    );
}

export default AddQnA;