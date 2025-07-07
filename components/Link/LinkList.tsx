import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import type { Link } from "../../hooks/useLinks";
import LinkItem from "./LinkItem";

interface LinkListProps {
    links: Link[];
    onViewDetails: (link: Link) => void;
}

export default function LinkList({ links, onViewDetails }: LinkListProps) {
    if (!links.length) {
        return (
            <View className="flex-1 justify-center items-center">
                <View className="bg-indigo-50 p-6 rounded-full mb-4">
                    <Feather name="bookmark" size={36} color="#6366f1" />
                </View>
                <Text className="text-gray-700 text-xl font-medium mb-1">
                    No links found
                </Text>
                <Text className="text-gray-400 text-center max-w-xs">
                    Add your first link by tapping the + button
                </Text>
            </View>
        );
    }
    return (
        <FlatList
            data={links}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
                <LinkItem link={item} onViewDetails={onViewDetails} />
            )}
        />
    );
}
