import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import type { Link } from "../../hooks/useLinks";

interface LinkDetailsModalProps {
    visible: boolean;
    link: Link | null;
    onClose: () => void;
    onSave: (
        id: number,
        name: string,
        description: string,
        url: string,
        isPublic: boolean
    ) => void;
    onDelete: (id: number) => void;
    onTogglePrivacy: (id: number, currentCategory: string) => void;
    onOpen: (url: string) => void;
}

export default function LinkDetailsModal({
    visible,
    link,
    onClose,
    onSave,
    onDelete,
    onTogglePrivacy,
    onOpen,
}: LinkDetailsModalProps) {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(link?.name || "");
    const [description, setDescription] = useState(link?.description || "");
    const [url, setUrl] = useState(link?.link || "");
    const [isPublic, setIsPublic] = useState(link?.category === "Public");

    React.useEffect(() => {
        if (link) {
            setName(link.name);
            setDescription(link.description || "");
            setUrl(link.link);
            setIsPublic(link.category === "Public");
            setEditMode(false);
        }
    }, [link, visible]);

    if (!link) return null;

    const handleSave = () => {
        if (!name.trim() || !url.trim()) {
            Alert.alert("Error", "Name and URL are required.");
            return;
        }
        onSave(link.id, name.trim(), description.trim(), url.trim(), isPublic);
        setEditMode(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <Pressable className="flex-1" onPress={onClose} />
            <View
                style={{ backgroundColor: "#040D12" }}
                className="rounded-t-3xl p-6 min-h-[30%] border-t-2 border-x-2 border-gray-300"
            >
                <View className="flex-row justify-between items-center mb-4">
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: "#FFFFFF" }}
                    >
                        {editMode ? "Edit Link" : "Link Details"}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color="#93B1A6" />
                    </TouchableOpacity>
                </View>

                {/* Name */}
                <Text className="text-xs mb-1" style={{ color: "#FFFFFF" }}>
                    Title
                </Text>
                {editMode ? (
                    <TextInput
                        style={{
                            backgroundColor: "#183D3D",
                            color: "#FFFFFF",
                            borderColor: "#183D3D",
                        }}
                        className="rounded-lg p-3 mb-3 border text-lg"
                        value={name}
                        onChangeText={setName}
                    />
                ) : (
                    <Text className="text-lg mb-3" style={{ color: "#FFFFFF" }}>
                        {link.name}
                    </Text>
                )}

                {/* Description */}
                <Text className="text-xs mb-1" style={{ color: "#FFFFFF" }}>
                    Description
                </Text>
                {editMode ? (
                    <TextInput
                        style={{
                            backgroundColor: "#183D3D",
                            color: "#FFFFFF",
                            borderColor: "#183D3D",
                        }}
                        className="rounded-lg p-3 mb-3 border text-base"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                ) : (
                    <Text
                        className="text-base mb-3"
                        style={{ color: "#FFFFFF" }}
                    >
                        {link.description || "-"}
                    </Text>
                )}

                {/* URL */}
                <Text className="text-xs mb-1" style={{ color: "#FFFFFF" }}>
                    URL
                </Text>
                {editMode ? (
                    <TextInput
                        style={{
                            backgroundColor: "#183D3D",
                            color: "#FFFFFF",
                            borderColor: "#183D3D",
                        }}
                        className="rounded-lg p-3 mb-3 border text-base"
                        value={url}
                        onChangeText={setUrl}
                        autoCapitalize="none"
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => onOpen(link.link)}
                        className="flex-row items-center mb-3"
                    >
                        <Text
                            className="text-base flex-1"
                            style={{ color: "#93B1A6" }}
                            numberOfLines={1}
                        >
                            {link.link}
                        </Text>
                        <Feather
                            name="external-link"
                            size={16}
                            color="#93B1A6"
                        />
                    </TouchableOpacity>
                )}

                {/* Privacy */}
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <MaterialIcons
                            name={isPublic ? "public" : "lock"}
                            size={20}
                            color={isPublic ? "#93B1A6" : "#93B1A6"}
                        />
                        <Text className="ml-2" style={{ color: "#FFFFFF" }}>
                            {isPublic ? "Public" : "Private"}
                        </Text>
                    </View>
                    {editMode && (
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{
                                false: "#5C8374",
                                true: "#93B1A6",
                            }}
                            thumbColor="#E0E0E0"
                        />
                    )}
                </View>

                {/* Actions */}
                <View className="flex-row justify-between">
                    {editMode ? (
                        <>
                            <TouchableOpacity
                                onPress={handleSave}
                                style={{
                                    backgroundColor: "#93B1A6",
                                    borderRadius: 8,
                                    paddingVertical: 10,
                                    paddingHorizontal: 24,
                                    marginRight: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#1A1A1A",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setEditMode(false)}
                                style={{
                                    backgroundColor: "#183D3D",
                                    borderRadius: 8,
                                    paddingVertical: 10,
                                    paddingHorizontal: 24,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FFFFFF",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => setEditMode(true)}
                                style={{
                                    backgroundColor: "#93B1A6",
                                    borderRadius: 8,
                                    paddingVertical: 10,
                                    paddingHorizontal: 24,
                                    marginRight: 8,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#1A1A1A",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    Edit
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert(
                                        "Delete Link",
                                        "Are you sure you want to delete this link?",
                                        [
                                            {
                                                text: "Cancel",
                                                style: "cancel",
                                            },
                                            {
                                                text: "Delete",
                                                style: "destructive",
                                                onPress: () =>
                                                    onDelete(link.id),
                                            },
                                        ]
                                    );
                                }}
                                style={{
                                    backgroundColor: "#5C8374",
                                    borderRadius: 8,
                                    paddingVertical: 10,
                                    paddingHorizontal: 24,
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#FFFFFF",
                                        fontWeight: "bold",
                                        fontSize: 16,
                                    }}
                                >
                                    Delete
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}
