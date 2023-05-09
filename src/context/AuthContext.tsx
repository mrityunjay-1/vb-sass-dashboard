import { message } from "antd";
import { createContext, useContext, useReducer } from "react";
import fetchData from "../data/fetchData";

const AuthContext = createContext({});

const reducer: any = (state: any, action: any) => {

    // console.log("Action: ", action);

    switch (action.type) {

        case "login":
            return action.payload;

        case "logout":
            return { isLoggedIn: false, isLoding: true };

        case "set_editable_bot_in_context":
            return { ...state, ...action.payload };

        default:
            return state;
    }

}

const Auth = ({ children }: any) => {

    let state: any = { isLoggedIn: false };

    let localData = localStorage.getItem("AuthData");

    // console.log("under context: ", localData);

    if (localData) {
        state = JSON.parse(localData);
        state.isLoggedIn = true;
    }

    const [data, dispatch]: any = useReducer(reducer, state);

    const login = async ({ email, password }: any) => {
        try {

            const raw_res = await fetch(`${import.meta.env.VITE_SERVER_URL}/userLogin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (raw_res.status !== 200) throw new Error("Login Api gived non 200 status code...");

            const res = await raw_res.json();

            const payload = { isLoggedIn: true, ...res, isLoading: false };

            localStorage.setItem("AuthData", JSON.stringify(payload));

            message.success(`Welcome, ${res.name}`);

            dispatch({ type: "login", payload });

        } catch (err) {
            message.error("Login Failed Please Try Again !");
        }
    }

    const signUp = async ({ name, email, password }: any) => {
        try {

            console.log("user sign up details : ", { name, email, password });

            const res = await fetchData({ url: "/userSignUp", method: "POST", data: { name, email, password } });

            console.log("Sign up response: ", res);

            if (!res) {
                message.error("something went wrong while signing up!");
                return false;
            } else {
                return true;
            }

        } catch (err) {
            console.log("Error in sign up function: ", err)
        }
    }

    const logout = () => {

        const authData = localStorage.getItem("AuthData");

        let userName = "";

        if (authData) {
            userName = (JSON.parse(authData)).name;
        }

        localStorage.removeItem("AuthData");

        message.success(`${userName ? userName + " is" : ""} successfully logged out.`);

        dispatch({ type: "logout" });
    }

    const checkIfLoggedIn = async () => {
        try {

            let authData: any = localStorage.getItem("AuthData");

            if (authData) {
                authData = JSON.parse(authData);

                if (authData?.token) {
                    const raw_res = await fetch(`${import.meta.env.VITE_SERVER_URL}/verifyToken`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ token: authData.token })
                    });

                    if (raw_res.status !== 200) {
                        message.error("Token Expired Please Login Again !");
                        logout();
                    };

                    const res = await raw_res.json();

                    if (res?.isValid) {
                        dispatch({ type: "login", payload: authData });
                    }
                }
            }

        } catch (err) {

            console.log("Error in check if logged in : ", err);
            // message.error("");
        }
    }

    const setBotInContext = async (botId: string) => {
        try {

            dispatch({ type: "set_editable_bot_in_context", payload: { isBotSelectedForEditing: true, botId } })

        } catch (err) {
            console.log("Error in setBotInContext function of auth context: ", err);
        }
    }

    const removeBotFromContext = async () => {
        try {

        } catch (err) {
            console.log("Error in setBotInContext function of auth context: ", err);
        }
    }

    return (
        <>

            <AuthContext.Provider value={{ data, signUp, login, logout, checkIfLoggedIn, setBotInContext, removeBotFromContext }}>
                {children}
            </AuthContext.Provider>

        </>
    );
}

const useAuth = () => {

    const auth = useContext(AuthContext);

    if (!auth) throw new Error("please create context first!");

    return auth;

}

export { Auth, useAuth };