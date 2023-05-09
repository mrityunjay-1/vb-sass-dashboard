import { WechatOutlined, HistoryOutlined } from "@ant-design/icons";

const routes = [
    {
        routeName: "Live Chats",
        routeUrl: "liveConversations",
        icon: <WechatOutlined />,
        renderOn: "botSelectedForEdit"
    },
    {
        routeName: "Chat History",
        routeUrl: "chatHistory",
        icon: <HistoryOutlined />,
        renderOn: "botSelectedForEdit"
    }
];

export { routes };