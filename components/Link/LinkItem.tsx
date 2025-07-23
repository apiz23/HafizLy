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
        <TouchableOpacity
            onPress={() => onViewDetails(link)}
            activeOpacity={0.9}
        >
            <CustomCard>
                <View className="w-full gap-4">
                    <Text
                        className="font-medium text-center text-white text-lg w-full"
                        numberOfLines={1}
                    >
                        {link.name}
                    </Text>
                </View>
            </CustomCard>
        </TouchableOpacity>
    );
}
