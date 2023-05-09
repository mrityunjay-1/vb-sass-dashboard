import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { Auth } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (import.meta.env.PROD) {
  console.log = () => { };
}

root.render(
  <>
    <BrowserRouter>
      <Auth>
        <App />
      </Auth>
    </BrowserRouter>
  </>
);