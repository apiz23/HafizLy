import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Link } from "../../hooks/useLinks";
import CustomCard from "../CustomCard";

interface LinkItemProps {
    link: Link;
    onViewDetails: (link: Link) => void;
}

export default function LinkItem({ link, onViewDetails }: LinkItemProps) {
    return (
        <CustomCard>
            <View className="w-full">
                <Text
                    className="font-medium text-white text-lg w-full"
                    numberOfLines={1}
                >
                    {link.name}
                </Text>

                <View className="flex-row justify-end">
                    <TouchableOpacity
                        onPress={() => onViewDetails(link)}
                        activeOpacity={0.8}
                        className="bg-zinc-200 rounded-lg py-1.5 px-3"
                    >
                        <Text className="text-black font-bold text-base">
                            View Details
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </CustomCard>
    );
}
