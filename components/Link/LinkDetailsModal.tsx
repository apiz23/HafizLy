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
import QRCode from "react-native-qrcode-svg";
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
    const [showQRCode, setShowQRCode] = useState(false); // State for QR Code visibility
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
            setShowQRCode(false); // Reset QR Code visibility when link changes
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
            transparent
            onRequestClose={onClose}
        >
            <Pressable className="flex-1" onPress={onClose} />
            <View className="bg-[#040D12] rounded-t-3xl p-6 min-h-[30%] border-t-2 border-x-2 border-gray-300">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-white">
                        {editMode ? "Edit Link" : "Link Details"}
                    </Text>
                    <TouchableOpacity onPress={onClose}>
                        <Feather name="x" size={24} color="#93B1A6" />
                    </TouchableOpacity>
                </View>

                {/* QR Code */}
                {showQRCode && !editMode && (
                    <View className="mx-auto mb-4">
                        <QRCode
                            value={link.link}
                            size={200}
                            logoBackgroundColor="transparent"
                        />
                    </View>
                )}

                {/* QR Code Toggle Button */}
                {!editMode && (
                    <View className="mb-4">
                        <TouchableOpacity
                            onPress={() => setShowQRCode(!showQRCode)} // Toggle QR Code visibility
                            className="flex-row items-center justify-center bg-gray-700 rounded-lg p-2"
                        >
                            <Text className="text-base text-white">
                                {showQRCode ? "Hide QR Code" : "Show QR Code"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Name */}
                <Text className="text-xs text-white mb-1">Title</Text>
                {editMode ? (
                    <TextInput
                        className="rounded-lg bg-[#183D3D] text-lg text-white border border-[#183D3D] p-3 mb-3"
                        value={name}
                        onChangeText={setName}
                    />
                ) : (
                    <Text className="text-lg text-white mb-3">{link.name}</Text>
                )}

                {/* Description */}
                <Text className="text-xs text-white mb-1">Description</Text>
                {editMode ? (
                    <TextInput
                        className="rounded-lg bg-[#183D3D] text-base text-white border border-[#183D3D] p-3 mb-3"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />
                ) : (
                    <Text className="text-base text-white mb-3">
                        {link.description || "-"}
                    </Text>
                )}

                {/* URL */}
                <Text className="text-xs text-white mb-1">URL</Text>
                {editMode ? (
                    <TextInput
                        className="rounded-lg bg-[#183D3D] text-base text-white border border-[#183D3D] p-3 mb-3"
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
                            className="text-base text-[#93B1A6] flex-1"
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
                        <Text className="ml-2 text-white">
                            {isPublic ? "Public" : "Private"}
                        </Text>
                    </View>
                    {editMode && (
                        <Switch
                            value={isPublic}
                            onValueChange={setIsPublic}
                            trackColor={{ false: "#5C8374", true: "#93B1A6" }}
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
                                className="bg-[#93B1A6] rounded-lg py-2 px-4 mr-2"
                            >
                                <Text className="text-[#1A1A1A] font-bold text-base">
                                    Save
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setEditMode(false)}
                                className="bg-[#183D3D] rounded-lg py-2 px-4"
                            >
                                <Text className="text-white font-bold text-base">
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => setEditMode(true)}
                                className="bg-[#93B1A6] rounded-lg py-2 px-4 mr-2"
                            >
                                <Text className="text-[#1A1A1A] font-bold text-base">
                                    Edit
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() =>
                                    Alert.alert(
                                        "Delete Link",
                                        "Are you sure you want to delete this link?",
                                        [
                                            { text: "Cancel", style: "cancel" },
                                            {
                                                text: "Delete",
                                                style: "destructive",
                                                onPress: () =>
                                                    onDelete(link.id),
                                            },
                                        ]
                                    )
                                }
                                className="bg-[#5C8374] rounded-lg py-2 px-4"
                            >
                                <Text className="text-white font-bold text-base">
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
