import { View } from "react-native";

export default function CustomCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <View className="w-full bg-neutral-600 rounded-2xl overflow-hidden shadow-lg mb-3">
            <View className="flex-row px-3 py-4">
                <View className="w-3 h-3 rounded-full bg-[#ff605c] mr-1" />
                <View className="w-3 h-3 rounded-full bg-[#ffbd44] mr-1" />
                <View className="w-3 h-3 rounded-full bg-[#00ca4e] mr-1" />
            </View>
            <View className="pb-4 px-4">{children}</View>
        </View>
    );
}
