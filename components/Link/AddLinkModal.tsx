import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AddLinkModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (
        name: string,
        description: string,
        link: string,
        isPublic: boolean,
        onSuccess: () => void
    ) => void;
    loading?: boolean;
    accentColor?: string;
    darkMode?: boolean;
}

export default function AddLinkModal({
    visible,
    onClose,
    onAdd,
    loading,
    accentColor = "#93B1A6",
    darkMode = false,
}: AddLinkModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const handleAdd = () => {
        onAdd(name, description, link, isPublic, () => {
            setName("");
            setDescription("");
            setLink("");
            setIsPublic(true);
            onClose();
        });
    };

    const modalBg = darkMode ? "#000000" : "#fff";
    const textColor = darkMode ? "#fff" : "#000";
    const inputBg = darkMode ? "#18181b" : "#f9fafb";
    const inputText = darkMode ? "#fff" : "#222";
    const placeholder = darkMode ? "#a1a1aa" : "#9ca3af";
    const borderColor = darkMode ? "#333" : "#e5e7eb";

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable className="flex-1" onPress={onClose} />
            <View
                style={{ backgroundColor: modalBg }}
                className="p-6 rounded-t-3xl shadow-lg border-t-2 border-x-2 border-gray-300"
            >
                <View className="flex-row justify-between items-center mb-4">
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: accentColor }}
                    >
                        Add New Link
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color={accentColor} />
                    </TouchableOpacity>
                </View>
                <View className="mb-6">
                    <TextInput
                        style={{
                            backgroundColor: inputBg,
                            color: inputText,
                            borderColor,
                        }}
                        className="rounded-xl p-4 mb-2 border text-lg"
                        placeholder="Enter link name..."
                        placeholderTextColor={placeholder}
                        value={name}
                        onChangeText={setName}
                        autoFocus={true}
                    />
                    <TextInput
                        style={{
                            backgroundColor: inputBg,
                            color: inputText,
                            borderColor,
                        }}
                        className="rounded-xl p-4 mb-2 border text-lg"
                        placeholder="Enter description (optional)..."
                        placeholderTextColor={placeholder}
                        value={description}
                        onChangeText={setDescription}
                    />
                    <TextInput
                        style={{
                            backgroundColor: inputBg,
                            color: inputText,
                            borderColor,
                        }}
                        className="rounded-xl p-4 mb-2 border text-lg"
                        placeholder="https://example.com"
                        placeholderTextColor={placeholder}
                        value={link}
                        onChangeText={setLink}
                        onSubmitEditing={handleAdd}
                        keyboardType="url"
                        autoCapitalize="none"
                    />
                    <View
                        className="flex-row items-center justify-between rounded-xl p-4 mb-2 border"
                        style={{ backgroundColor: inputBg, borderColor }}
                    >
                        <View className="flex-row items-center">
                            <MaterialIcons
                                name={isPublic ? "public" : "lock"}
                                size={20}
                                color={isPublic ? accentColor : "#BC6FF1"}
                            />
                            <Text className="ml-2" style={{ color: textColor }}>
                                {isPublic ? "Public" : "Private"}
                            </Text>
                        </View>
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{ false: "#52057B", true: accentColor }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={{ backgroundColor: accentColor }}
                    className="rounded-xl py-4 items-center"
                    onPress={handleAdd}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    <Text className="text-white font-semibold text-lg">
                        {loading ? "Adding..." : "Add Link"}
                    </Text>
                </TouchableOpacity>
            </View>
            <View className="bg-black" />
        </Modal>
    );
}
