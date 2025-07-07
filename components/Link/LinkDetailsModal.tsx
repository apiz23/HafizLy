import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Modal,
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
            <View className="flex-1 justify-end">
                <View
                    style={{ backgroundColor: "#18181b" }}
                    className="rounded-t-3xl p-6 min-h-[30%]"
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <Text
                            className="text-2xl font-bold"
                            style={{ color: "#fff" }}
                        >
                            {editMode ? "Edit Link" : "Link Details"}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#BC6FF1" />
                        </TouchableOpacity>
                    </View>

                    {/* Name */}
                    <Text className="text-xs mb-1" style={{ color: "#fff" }}>
                        Title
                    </Text>
                    {editMode ? (
                        <TextInput
                            style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderColor: "#333",
                            }}
                            className="rounded-lg p-3 mb-3 border text-lg"
                            value={name}
                            onChangeText={setName}
                        />
                    ) : (
                        <Text
                            className="text-lg mb-3"
                            style={{ color: "#fff" }}
                        >
                            {link.name}
                        </Text>
                    )}

                    {/* Description */}
                    <Text className="text-xs mb-1" style={{ color: "#fff" }}>
                        Description
                    </Text>
                    {editMode ? (
                        <TextInput
                            style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderColor: "#333",
                            }}
                            className="rounded-lg p-3 mb-3 border text-base"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    ) : (
                        <Text
                            className="text-base mb-3"
                            style={{ color: "#fff" }}
                        >
                            {link.description || "-"}
                        </Text>
                    )}

                    {/* URL */}
                    <Text className="text-xs mb-1" style={{ color: "#fff" }}>
                        URL
                    </Text>
                    {editMode ? (
                        <TextInput
                            style={{
                                backgroundColor: "#000",
                                color: "#fff",
                                borderColor: "#333",
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
                                style={{ color: "#BC6FF1" }}
                                numberOfLines={1}
                            >
                                {link.link}
                            </Text>
                            <Feather
                                name="external-link"
                                size={16}
                                color="#BC6FF1"
                            />
                        </TouchableOpacity>
                    )}

                    {/* Privacy */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <MaterialIcons
                                name={isPublic ? "public" : "lock"}
                                size={20}
                                color={isPublic ? "#BC6FF1" : "#892CDC"}
                            />
                            <Text className="ml-2" style={{ color: "#fff" }}>
                                {isPublic ? "Public" : "Private"}
                            </Text>
                        </View>
                        {editMode && (
                            <Switch
                                value={isPublic}
                                onValueChange={setIsPublic}
                                trackColor={{
                                    false: "#892CDC",
                                    true: "#BC6FF1",
                                }}
                                thumbColor="#fff"
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
                                        backgroundColor: "#BC6FF1",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                        marginRight: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#000",
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
                                        backgroundColor: "#18181b",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
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
                                        backgroundColor: "#BC6FF1",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                        marginRight: 8,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#000",
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
                                        backgroundColor: "#ff6b81",
                                        borderRadius: 8,
                                        paddingVertical: 10,
                                        paddingHorizontal: 24,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#fff",
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
            </View>
        </Modal>
    );
}
