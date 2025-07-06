import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Keyboard,
    Linking,
    Modal,
    Pressable,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { supabase } from "../utils/supabase";

type Link = {
    id: number;
    name: string;
    description: string;
    link: string;
    category: string;
    created_at: string;
};

export default function Index() {
    const [links, setLinks] = useState<Link[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [isPublic, setIsPublic] = useState(true); // New state for privacy toggle
    const [activeFilter, setActiveFilter] = useState<
        "all" | "public" | "private"
    >("all");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        const { data, error } = await supabase
            .from("link-hub")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            Alert.alert("Error", "Failed to fetch links.");
            console.error(error);
            return;
        }

        setLinks(data as Link[]);
    };

    const addLink = async () => {
        if (name.trim() === "" || link.trim() === "") {
            Alert.alert("Error", "Please enter both name and link");
            return;
        }

        if (!link.startsWith("http://") && !link.startsWith("https://")) {
            Alert.alert(
                "Error",
                "Please enter a valid link starting with http:// or https://"
            );
            return;
        }

        const { error } = await supabase.from("link-hub").insert([
            {
                name: name.trim(),
                description: description.trim(),
                link: link.trim(),
                category: isPublic ? "Public" : "Private",
            },
        ]);

        if (error) {
            Alert.alert("Error", "Failed to add link.");
            console.error(error);
            return;
        }

        setName("");
        setDescription("");
        setLink("");
        setIsPublic(true);
        setIsDrawerOpen(false);
        Keyboard.dismiss();
        fetchLinks();
    };

    const togglePrivacy = async (id: number, currentCategory: string) => {
        const newCategory = currentCategory === "Public" ? "Private" : "Public";
        const { error } = await supabase
            .from("link-hub")
            .update({ category: newCategory })
            .eq("id", id);

        if (error) {
            Alert.alert("Error", "Failed to update privacy.");
            console.error(error);
            return;
        }

        fetchLinks();
    };

    const deleteLink = async (id: number) => {
        const { error } = await supabase.from("link-hub").delete().eq("id", id);
        if (error) {
            Alert.alert("Error", "Failed to delete link.");
            console.error(error);
            return;
        }

        fetchLinks();
    };

    const openLink = (url: string) => {
        Linking.openURL(url).catch(() => {
            Alert.alert("Error", "Could not open the link");
        });
    };

    const filteredLinks = links.filter((item) => {
        if (activeFilter === "public") return item.category === "Public";
        if (activeFilter === "private") return item.category === "Private";
        return true;
    });

    const publicCount = links.filter(
        (link) => link.category === "Public"
    ).length;
    const privateCount = links.filter(
        (link) => link.category === "Private"
    ).length;

    return (
        <View className="flex-1 bg-gray-50">
            <TouchableOpacity
                className="absolute bottom-8 right-8 z-10 bg-indigo-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
                onPress={() => setIsDrawerOpen(true)}
                activeOpacity={0.8}
            >
                <Feather name="plus" size={28} color="white" />
            </TouchableOpacity>

            <View className="flex-1 p-6">
                <View className="my-10">
                    <Text className="text-4xl font-bold text-gray-900 mb-4">
                        HafizLy
                    </Text>
                    <View className="flex-row items-center">
                        <View className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2">
                            <MaterialIcons
                                name="public"
                                size={16}
                                color="#3b82f6"
                            />
                            <Text className="text-blue-700 ml-1 text-sm font-medium">
                                {publicCount}
                            </Text>
                        </View>
                        <View className="flex-row items-center bg-purple-100 rounded-full px-3 py-1 mr-2">
                            <MaterialIcons
                                name="lock"
                                size={16}
                                color="#8b5cf6"
                            />
                            <Text className="text-purple-700 ml-1 text-sm font-medium">
                                {privateCount}
                            </Text>
                        </View>
                        <Text className="text-gray-500 text-sm">
                            {links.length}{" "}
                            {links.length === 1 ? "link" : "links"} stored
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between mb-6 bg-white rounded-xl p-1 shadow-sm">
                    {(["all", "public", "private"] as const).map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            className={`flex-1 py-3 rounded-lg items-center ${
                                activeFilter === filter ? "bg-indigo-100" : ""
                            }`}
                            onPress={() => setActiveFilter(filter)}
                            activeOpacity={0.7}
                        >
                            <Text
                                className={`font-semibold ${
                                    activeFilter === filter
                                        ? "text-indigo-700"
                                        : "text-gray-500"
                                }`}
                            >
                                {filter.charAt(0).toUpperCase() +
                                    filter.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredLinks.length > 0 ? (
                    <FlatList
                        data={filteredLinks}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item }) => (
                            <View className="bg-white p-5 rounded-xl mb-3 shadow-sm">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center flex-1">
                                        <TouchableOpacity
                                            onPress={() =>
                                                togglePrivacy(
                                                    item.id,
                                                    item.category
                                                )
                                            }
                                            className={`p-2 rounded-full ${
                                                item.category === "Public"
                                                    ? "bg-blue-100"
                                                    : "bg-purple-100"
                                            }`}
                                        >
                                            <MaterialIcons
                                                name={
                                                    item.category === "Public"
                                                        ? "public"
                                                        : "lock"
                                                }
                                                size={20}
                                                color={
                                                    item.category === "Public"
                                                        ? "#3b82f6"
                                                        : "#8b5cf6"
                                                }
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            className="ml-3 flex-1 font-medium text-gray-800 text-lg"
                                            numberOfLines={1}
                                        >
                                            {item.name}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => deleteLink(item.id)}
                                        activeOpacity={0.7}
                                        className="p-2"
                                    >
                                        <Feather
                                            name="trash-2"
                                            size={20}
                                            color="#ef4444"
                                        />
                                    </TouchableOpacity>
                                </View>

                                {item.description && (
                                    <Text className="text-gray-500 text-sm mb-3">
                                        {item.description}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    onPress={() => openLink(item.link)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center"
                                >
                                    <Text
                                        className="text-indigo-600 text-sm flex-1"
                                        numberOfLines={1}
                                    >
                                        {item.link}
                                    </Text>
                                    <Feather
                                        name="external-link"
                                        size={16}
                                        color="#6366f1"
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <View className="bg-indigo-50 p-6 rounded-full mb-4">
                            <Feather
                                name="bookmark"
                                size={36}
                                color="#6366f1"
                            />
                        </View>
                        <Text className="text-gray-700 text-xl font-medium mb-1">
                            No links found
                        </Text>
                        <Text className="text-gray-400 text-center max-w-xs">
                            {activeFilter === "all"
                                ? "Add your first link by tapping the + button"
                                : `You don't have any ${activeFilter} links yet`}
                        </Text>
                    </View>
                )}
            </View>

            {/* Add Link Drawer */}
            <Modal
                visible={isDrawerOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsDrawerOpen(false)}
            >
                <Pressable
                    className="flex-1"
                    onPress={() => setIsDrawerOpen(false)}
                />
                <View className="bg-blue-900 p-6 rounded-t-3xl shadow-lg">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-2xl font-bold text-white">
                            Add New Link
                        </Text>
                        <TouchableOpacity
                            onPress={() => setIsDrawerOpen(false)}
                        >
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View className="mb-6">
                        <TextInput
                            className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-200 text-gray-800"
                            placeholder="Enter link name..."
                            placeholderTextColor="#9ca3af"
                            value={name}
                            onChangeText={setName}
                            autoFocus={true}
                        />
                        <TextInput
                            className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-200 text-gray-800"
                            placeholder="Enter description (optional)..."
                            placeholderTextColor="#9ca3af"
                            value={description}
                            onChangeText={setDescription}
                        />
                        <TextInput
                            className="bg-gray-50 rounded-xl p-4 mb-2 border border-gray-200 text-gray-800"
                            placeholder="https://example.com"
                            placeholderTextColor="#9ca3af"
                            value={link}
                            onChangeText={setLink}
                            onSubmitEditing={addLink}
                            keyboardType="url"
                            autoCapitalize="none"
                        />
                        <View className="flex-row items-center justify-between bg-gray-50 rounded-xl p-4 mb-2">
                            <View className="flex-row items-center">
                                <MaterialIcons
                                    name={isPublic ? "public" : "lock"}
                                    size={20}
                                    color={isPublic ? "#3b82f6" : "#8b5cf6"}
                                />
                                <Text className="ml-2 text-gray-800">
                                    {isPublic ? "Public" : "Private"}
                                </Text>
                            </View>
                            <Switch
                                value={isPublic}
                                onValueChange={setIsPublic}
                                trackColor={{
                                    false: "#8b5cf6",
                                    true: "#3b82f6",
                                }}
                                thumbColor="#ffffff"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-xl py-4 items-center"
                        onPress={addLink}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold text-lg">
                            Add Link
                        </Text>
                    </TouchableOpacity>
                </View>
                <View className="bg-black" />
            </Modal>
        </View>
    );
}
