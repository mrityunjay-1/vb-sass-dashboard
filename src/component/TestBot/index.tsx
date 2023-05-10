import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";

const TestBot = () => {

    const auth: any = useAuth();
    const params: any = useParams();

    useEffect(() => {
        auth.setBotInContext(params.botId);
    }, []);

    return (
        <>

            <h1>Test Bot</h1>

        </>
    );
}

export default TestBot;