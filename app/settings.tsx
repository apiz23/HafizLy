import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [currentSet, setCurrentSet] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        (async () => {
            const pwd = await AsyncStorage.getItem("private_password");
            setCurrentSet(!!pwd);
        })();
    }, []);

    const handleSetPassword = async () => {
        if (!password || !confirm) {
            setStatus("Password and confirmation required");
            return;
        }
        if (password !== confirm) {
            setStatus("Passwords do not match");
            return;
        }
        await AsyncStorage.setItem("private_password", password);
        setPassword("");
        setConfirm("");
        setCurrentSet(true);
        setStatus("Password set successfully");
    };

    return (
        <View
            className="flex-1 items-center justify-center px-8"
            style={{ backgroundColor: "#000000" }}
        >
            <Text
                className="text-2xl font-bold mb-4"
                style={{ color: "#BC6FF1" }}
            >
                Settings
            </Text>
            <Text
                className="mb-4"
                style={{ color: currentSet ? "#BC6FF1" : "#fff" }}
            >
                Private links password: {currentSet ? "Set" : "Not set"}
            </Text>
            <TextInput
                style={{
                    backgroundColor: "#18181b",
                    color: "#fff",
                    borderColor: "#333",
                }}
                className="w-full rounded-lg p-4 mb-2 border text-lg"
                placeholder="New password"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={{
                    backgroundColor: "#18181b",
                    color: "#fff",
                    borderColor: "#333",
                }}
                className="w-full rounded-lg p-4 mb-2 border text-lg"
                placeholder="Confirm password"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                value={confirm}
                onChangeText={setConfirm}
            />
            {status ? (
                <Text
                    className="mb-2"
                    style={{
                        color: status.includes("success")
                            ? "#BC6FF1"
                            : "#ff6b81",
                    }}
                >
                    {status}
                </Text>
            ) : null}
            <TouchableOpacity
                style={{ backgroundColor: "#892CDC" }}
                className="rounded-lg px-6 py-3 mt-2"
                onPress={handleSetPassword}
            >
                <Text className="text-white font-semibold text-lg">
                    {currentSet ? "Change Password" : "Set Password"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
