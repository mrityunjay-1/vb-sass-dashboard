import { WechatOutlined, HistoryOutlined } from "@ant-design/icons";

const routes = [
    {
        routeName: "QnATrain",
        routeUrl: "qnaTrain",
        icon: <WechatOutlined />,
        renderOn: "botSelectedForEdit"
    },
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