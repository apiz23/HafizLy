import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Linking,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AddLinkModal from "../components/Link/AddLinkModal";
import LinkDetailsModal from "../components/Link/LinkDetailsModal";
import LinkList from "../components/Link/LinkList";
import type { Link } from "../hooks/useLinks";
import { useLinks } from "../hooks/useLinks";
import { supabase } from "../utils/supabase";

export default function Index() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const { links, loading, addLink, togglePrivacy, deleteLink, fetchLinks } =
        useLinks();

    // Only show public links
    const publicLinks = links.filter((item) => item.category === "Public");
    const publicCount = publicLinks.length;

    // Filter by search
    const filteredLinks = publicLinks.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            (item.description &&
                item.description
                    .toLowerCase()
                    .includes(search.toLowerCase())) ||
            item.link.toLowerCase().includes(search.toLowerCase())
    );

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => {
            alert("Could not open the link");
        });
    };

    const handleViewDetails = (link: Link) => {
        setSelectedLink(link);
        setDetailsVisible(true);
    };

    const handleCloseDetails = () => {
        setDetailsVisible(false);
        setSelectedLink(null);
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

    return (
        <View className="flex-1" style={{ backgroundColor: "#040D12" }}>
            <TouchableOpacity
                className="absolute bottom-8 right-8 z-10"
                style={{
                    backgroundColor: "#93B1A6",
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#183D3D",
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 10,
                }}
                onPress={() => setIsDrawerOpen(true)}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="flex-1 p-6">
                <View className="my-10">
                    <Text
                        className="text-4xl font-bold mb-4"
                        style={{ color: "#FFFFFF" }}
                    >
                        HafizLy
                    </Text>
                    <View className="flex-row items-center">
                        <View
                            className="flex-row items-center rounded-full px-3 py-1 mr-2"
                            style={{ backgroundColor: "#183D3D" }}
                        >
                            <MaterialIcons
                                name="public"
                                size={16}
                                color="#FFFFFF"
                            />
                            <Text
                                className="ml-1 text-sm font-medium"
                                style={{ color: "#FFFFFF" }}
                            >
                                {publicCount}
                            </Text>
                        </View>
                        <Text className="text-sm" style={{ color: "#FFFFFF" }}>
                            {publicCount} {publicCount === 1 ? "link" : "links"}{" "}
                            public
                        </Text>
                    </View>
                </View>

                {/* Search bar and refresh */}
                <View className="flex-row items-center mb-4">
                    <TextInput
                        style={{
                            backgroundColor: "#18181b",
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
                            backgroundColor: "#18181b",
                            borderRadius: 12,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "#183D3D",
                        }}
                    >
                        <Feather name="refresh-cw" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <LinkList
                    links={filteredLinks}
                    onViewDetails={handleViewDetails}
                />
            </View>

            <AddLinkModal
                visible={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onAdd={addLink}
                loading={loading}
                accentColor="#93B1A6"
                darkMode={true}
            />

            <LinkDetailsModal
                visible={detailsVisible}
                link={selectedLink}
                onClose={handleCloseDetails}
                onSave={handleSave}
                onDelete={handleDelete}
                onTogglePrivacy={togglePrivacy}
                onOpen={openLink}
            />
        </View>
    );
}
