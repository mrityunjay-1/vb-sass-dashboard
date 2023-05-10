import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { Collapse, message } from "antd";
import { useState } from "react";

const AddQnA = ({ question, answer, isNew = true, onCancel, isInEditMode = false }: any) => {

    const [questions, setQuestions]: any = useState(question ?? []);
    // const [answer, setAnswer] = useState("");

    const [quest, setQuest] = useState("");
    const [ans, setAns] = useState(answer);

    const [editMode, setEditMode] = useState(isInEditMode);

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "white", paddingBottom: "2rem", border: "0.1rem solid lightgrey", borderRadius: "0.7rem", boxShadow: "0.1rem 0.1rem 0.5rem grey" }}>

            {isNew ? <h1 style={{ padding: "1rem 2rem" }}>Add QnA</h1> : ""}

            <Collapse defaultActiveKey={['1']} ghost collapsible="icon" >
                <Collapse.Panel
                    header={
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", }}>
                                <p style={{ fontSize: "1.4rem", fontWeight: "bold", marginRight: "2rem" }}>Questions</p>
                                <span style={{ fontSize: "1rem", backgroundColor: "orange", width: "2rem", height: "2rem", display: "grid", placeItems: "center", borderRadius: "100rem" }}> {questions.length} </span>
                            </div>
                            <div style={{ display: "flex", }}>
                                <p onClick={() => setEditMode(true)} style={{ marginRight: "2rem" }}><EditFilled /></p>
                                <p><DeleteFilled /></p>
                            </div>
                        </div>
                    }
                    key="1"
                >

                    <div style={{ display: "flex", flexDirection: "column", border: "0.01rem solid grey", marginTop: "-1rem", padding: "1rem" }}>

                        <div id="questions-container" style={{ height: "auto", maxHeight: "10rem", overflow: "auto", scrollBehavior: "smooth", marginBottom: "0.8rem" }}>
                            {
                                questions?.map((q: string, index: number) => {
                                    return (
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            <p style={{ color: "grey", width: "10%" }}>{index + 1}</p>
                                            <p style={{ color: "grey", width: "85%" }}>{q}</p>
                                            <p onClick={() => {
                                                setQuestions((prevState: any) => {
                                                    return prevState.filter((q1: string) => q1 !== q);
                                                })
                                            }} style={{ cursor: "pointer", width: "5%" }}><DeleteFilled /></p>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <input
                            autoFocus
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

                                    if (questions.includes(quest)) {
                                        return message.warning("Question already present!");
                                    }

                                    setQuestions([...questions, quest]);
                                    const qc: any = document.getElementById("questions-container");
                                    setTimeout(() => qc.scrollTop = qc.scrollHeight, 100);
                                }
                            }}
                        />

                    </div>
                </Collapse.Panel>
            </Collapse>

            <Collapse accordion={false} defaultActiveKey={['1']} ghost
                collapsible="icon"
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
                            style={{ flex: 1, padding: "0.5rem", outline: "none", color: "grey", border: "0.01rem solid grey" }}
                        />

                    </div>
                </Collapse.Panel>
            </Collapse>

            {/* <details open={true}>
                <summary>Questions</summary>

                <div style={{ display: "flex", flexDirection: "column", border: "0.01rem solid grey", marginTop: "-1rem", padding: "1rem" }}>

                    <div id="questions-container" style={{ height: "auto", maxHeight: "10rem", overflow: "auto", scrollBehavior: "smooth", marginBottom: "0.8rem" }}>
                        {
                            questions?.map((q: string, index: number) => {
                                return (
                                    <div style={{ display: "flex", justifyContent: "space-between", width: "99%" }}>
                                        <p style={{ color: "grey", width: "10%" }}>{index + 1}</p>
                                        <p style={{ color: "grey", width: "80%" }}>{q}</p>
                                        <p onClick={() => {
                                            setQuestions((prevState: any) => {
                                                return prevState.filter((q1: string) => q1 !== q);
                                            })
                                        }} style={{ cursor: "pointer", width: "80%" }}><DeleteFilled /></p>
                                    </div>
                                );
                            })
                        }
                    </div>

                    <input
                        autoFocus
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

                                if (questions.includes(quest)) {
                                    return message.warning("Question already present!");
                                }

                                setQuestions([...questions, quest]);
                                const qc: any = document.getElementById("questions-container");
                                setTimeout(() => qc.scrollTop = qc.scrollHeight, 100);
                            }
                        }}
                    />

                </div>
            </details>

            <details open={true}>
                <summary>Answers</summary>

                <div style={{ display: "flex", flexDirection: "column"}}>
                    <input
                        type="text"
                        value={ans}
                        onChange={(e: any) => {
                            setAns(e.target.value);
                        }}
                        placeholder="Please Enter Answer Here"
                        style={{ flex: 1, padding: "0.3rem 0.5rem", outline: "none" }}
                    />

                </div>
            </details> */}

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
                                    <button>Save</button>
                                    :
                                    <button>Update</button>
                            }
                        </div>
                    </>
                    :
                    null
            }

            {/* <div style={{ padding: "0 1.5rem", display: "flex", justifyContent: "center" }}>
                <button
                    onClick={() => {
                        if (isNew) onCancel(false);
                    }}
                    style={{ marginRight: "1rem", background: "pink" }}>
                    Cancel
                </button>
                {
                    isNew ?
                        <button>Save</button>
                        :
                        <button>Update</button>
                }
            </div> */}

        </div>
    );
}

export default AddQnA;