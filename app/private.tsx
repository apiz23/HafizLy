import AuthGate from "@/components/authgate";
import LinkDetailsModal from "@/components/Link/LinkDetailsModal";
import { supabase } from "@/utils/supabase";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LinkList from "../components/Link/LinkList";
import { Link, useLinks } from "../hooks/useLinks";

export default function PrivateScreen() {
    const { links, togglePrivacy, deleteLink, fetchLinks } = useLinks();
    const [search, setSearch] = useState("");
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);

    const privateLinks = links.filter((item) => item.category === "Private");

    const filteredLinks = privateLinks.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.description &&
                item.description
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
            item.link.toLowerCase().includes(search.toLowerCase())
    );

    const handleViewDetails = (link: Link) => {
        setSelectedLink(link);
        setDetailsVisible(true);
    };

    const handleCloseDetails = () => {
        setSelectedLink(null);
        setDetailsVisible(false);
    };

    const handleSave = async (
        id: number,
        name: string,
        description: string,
        url: string,
        isPublic: boolean
    ) => {
        const { error } = await supabase
            .from("link-hub")
            .update({
                name,
                description,
                link: url,
                category: isPublic ? "Public" : "Private",
            })
            .eq("id", id);

        if (error) {
            Alert.alert("Error", "Failed to update link.");
            return;
        }

        fetchLinks();
        handleCloseDetails();
    };

    const handleDelete = (id: number) => {
        deleteLink(id);
        handleCloseDetails();
    };

    const openLink = (url: string) => {
        import("react-native").then(({ Linking }) => {
            Linking.openURL(url).catch(() => {
                Alert.alert("Error", "Could not open the link");
            });
        });
    }; 

    return (
        <AuthGate>
            <View className="flex-1" style={{ backgroundColor: "#040D12" }}>
                <View className="flex-1 p-6">
                    <View className="mt-10">
                        <Text className="text-4xl font-bold mb-4 text-white">
                            Private Links
                        </Text>
                    </View>

                    {/* Search bar + refresh */}
                    <View className="flex-row items-center mb-4">
                        <TextInput
                            style={{
                                backgroundColor: "#183D3D",
                                color: "#FFFFFF",
                                borderColor: "#183D3D",
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
                                backgroundColor: "#183D3D",
                                borderRadius: 12,
                                padding: 10,
                                borderWidth: 1,
                                borderColor: "#183D3D",
                            }}
                        >
                            <Feather
                                name="refresh-cw"
                                size={22}
                                color="#93B1A6"
                            />
                        </TouchableOpacity>
                    </View>

                    <LinkList
                        links={filteredLinks}
                        onViewDetails={handleViewDetails}
                    />
                </View>
            </View>

            <LinkDetailsModal
                visible={detailsVisible}
                link={selectedLink}
                onClose={handleCloseDetails}
                onSave={handleSave}
                onDelete={handleDelete}
                onTogglePrivacy={togglePrivacy}
                onOpen={openLink}
            />
        </AuthGate>
    );
}
