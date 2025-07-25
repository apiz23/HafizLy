import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import "./global.css";

type TabIconProps = {
    name: keyof typeof Feather.glyphMap;
    size: number;
    color: string;
    focused: boolean;
};

export default function RootLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Feather.glyphMap = "globe";

                    if (route.name === "index") iconName = "globe";
                    if (route.name === "private") iconName = "lock";

                    return (
                        <TabBarIcon
                            name={iconName}
                            size={size}
                            color={color}
                            focused={focused}
                        />
                    );
                },
                tabBarActiveTintColor: "#93B1A6",
                tabBarInactiveTintColor: "#5C8374",
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarBackground: () => (
                    <View style={styles.tabBarBackground} />
                ),
            })}
        />
    );
}

const TabBarIcon = ({ name, color, size, focused }: TabIconProps) => {
    const scale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: focused ? 1.2 : 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }, [focused]);

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Feather name={name} size={size} color={color} />
        </Animated.View>
    );
};

interface Style {
    tabBar: ViewStyle;
    tabBarItem: ViewStyle;
    tabBarLabel: TextStyle;
    tabBarBackground: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    tabBar: {
        height: 70,
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    tabBarItem: {
        paddingVertical: 8,
        position: "relative",
    },
    tabBarLabel: {
        fontWeight: "600",
        fontSize: 12,
        marginBottom: 4,
    },
    tabBarBackground: {
        flex: 1,
        backgroundColor: "#040D12",
        borderTopWidth: 1,
        borderTopColor: "rgba(24, 61, 61, 0.5)",
        shadowColor: "#183D3D",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
});
