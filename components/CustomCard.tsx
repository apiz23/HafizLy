import { View } from "react-native";

export default function CustomCard({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <View className="w-full border-4 border-white bg-black px-6 py-4 shadow-[10px_10px_0_#fff] font-sans mb-4 rounded-md">
            <View className="flex-row px-3 py-4">
                <View className="w-3 h-3 rounded-full bg-[#ff605c] mr-1" />
                <View className="w-3 h-3 rounded-full bg-[#ffbd44] mr-1" />
                <View className="w-3 h-3 rounded-full bg-[#00ca4e] mr-1" />
            </View>
            <View className="mt-4 text-sm leading-relaxed border-b-2 border-black pb-4 font-semibold">
                {children}
            </View>
        </View>
    );
}
