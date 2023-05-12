import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import Header from "../Header/Header";
import { CopyFilled } from "@ant-design/icons";

const Code = ({ text }: any) => {
    return (
        <pre style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", fontSize: "1.4rem", backgroundColor: "white", borderRadius: "0.5rem", padding: "1rem 2rem", border: "0.1rem solid grey" }}>

            <div style={{ width: "95%", }}>
                <p>{text}</p>
            </div>

            <div onClick={() => navigator.clipboard.writeText(text)} style={{ width: "5%", cursor: "pointer" }}>
                <CopyFilled />
            </div>

        </pre>
    );
}

const TestBot = () => {

    const auth: any = useAuth();
    const params: any = useParams();

    useEffect(() => {
        auth.setBotInContext(params.botId);
    }, []);

    return (
        <>

            <Header>
                <span style={{ fontWeight: 599 }}>Test & Integrate</span>
            </Header>

            <div style={{ padding: "1rem" }}>

                <h1>Test</h1>
                <Code text={`https://wvb.netlify.app?botId=${params.botId}`} />

                <br />
                <br />

                <h1>Integrate</h1>
                <Code text={`<script src="https://startup-901-bucket.s3.ap-south-1.amazonaws.com/script2.js" botId="${params.botId}"> </script>`} />

            </div>

        </>
    );
}

export default TestBot;