import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LinkList from "../components/Link/LinkList";
import { useLinks } from "../hooks/useLinks";

export default function PrivateScreen() {
    const [unlocked, setUnlocked] = useState(false);
    const [input, setInput] = useState("");
    const [passwordSet, setPasswordSet] = useState(false);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const { links, togglePrivacy, deleteLink, fetchLinks } = useLinks();

    useEffect(() => {
        (async () => {
            const pwd = await AsyncStorage.getItem("private_password");
            setPasswordSet(!!pwd);
            setChecking(false);
        })();
    }, []);

    const handleUnlock = async () => {
        const pwd = await AsyncStorage.getItem("private_password");
        if (input === pwd) {
            setUnlocked(true);
            setError("");
        } else {
            setError("Incorrect password");
        }
    };

    if (checking) {
        return null;
    }

    if (!passwordSet) {
        return (
            <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: "#000000" }}
            >
                <Text className="text-lg mb-2" style={{ color: "#fff" }}>
                    No password set for private links.
                </Text>
                <Text className="mb-4" style={{ color: "#BC6FF1" }}>
                    Please set a password in Settings.
                </Text>
            </View>
        );
    }

    if (!unlocked) {
        return (
            <View
                className="flex-1 items-center justify-center px-8"
                style={{ backgroundColor: "#000000" }}
            >
                <Text
                    className="text-2xl font-bold mb-4"
                    style={{ color: "#BC6FF1" }}
                >
                    Enter Password
                </Text>
                <TextInput
                    style={{
                        backgroundColor: "#18181b",
                        color: "#fff",
                        borderColor: "#333",
                    }}
                    className="w-full rounded-lg p-4 mb-2 border text-lg"
                    placeholder="Password"
                    placeholderTextColor="#a1a1aa"
                    secureTextEntry
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleUnlock}
                />
                {error ? (
                    <Text className="mb-2" style={{ color: "#ff6b81" }}>
                        {error}
                    </Text>
                ) : null}
                <TouchableOpacity
                    style={{ backgroundColor: "#892CDC" }}
                    className="rounded-lg px-6 py-3 mt-2"
                    onPress={handleUnlock}
                >
                    <Text className="text-white font-semibold text-lg">
                        Unlock
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Show only private links
    const privateLinks = links.filter((item) => item.category === "Private");
    // Filter by search
    const filteredLinks = privateLinks.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.description &&
                item.description
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
            item.link.toLowerCase().includes(search.toLowerCase())
    );
    const openLink = (url: string) => {
        // Use Linking from react-native
        import("react-native").then(({ Linking }) => {
            Linking.openURL(url).catch(() => {
                Alert.alert("Error", "Could not open the link");
            });
        });
    };

    const handleViewDetails = (link: any) => {
        // Implementation of handleViewDetails
    };

    return (
        <View className="flex-1" style={{ backgroundColor: "#000000" }}>
            <View className="flex-1 p-6">
                <View className="mt-10">
                    <Text
                        className="text-4xl font-bold mb-4"
                        style={{ color: "#BC6FF1" }}
                    >
                        Private Links
                    </Text>
                </View>
                {/* Search bar and refresh */}
                <View className="flex-row items-center mb-4">
                    <TextInput
                        style={{
                            backgroundColor: "#18181b",
                            color: "#fff",
                            borderColor: "#333",
                            flex: 1,
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            fontSize: 16,
                            marginRight: 8,
                        }}
                        placeholder="Search links..."
                        placeholderTextColor="#a1a1aa"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                    />
                    <TouchableOpacity
                        onPress={fetchLinks}
                        style={{
                            backgroundColor: "#18181b",
                            borderRadius: 12,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "#333",
                        }}
                    >
                        <Feather name="refresh-cw" size={22} color="#BC6FF1" />
                    </TouchableOpacity>
                </View>
                <LinkList
                    links={filteredLinks}
                    onViewDetails={handleViewDetails}
                />
            </View>
        </View>
    );
}
