import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import "./global.css";

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "index") {
                        return (
                            <Feather name="globe" size={size} color={color} />
                        );
                    } else if (route.name === "private") {
                        return (
                            <Feather name="lock" size={size} color={color} />
                        );
                    } else if (route.name === "settings") {
                        return (
                            <Feather
                                name="settings"
                                size={size}
                                color={color}
                            />
                        );
                    }
                    return null;
                },
                tabBarActiveTintColor: "#93B1A6",
                tabBarInactiveTintColor: "#5C8374",
                tabBarStyle: {
                    backgroundColor: "#040D12",
                    borderColor: "#183D3D",
                },
                tabBarLabelStyle: {
                    fontWeight: "bold",
                    fontSize: 13,
                    color: "#FFFFFF",
                },
            })}
        />
    );
}
