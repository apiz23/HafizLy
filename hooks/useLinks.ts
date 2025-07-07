import { useEffect, useState } from "react";
import { Alert, Keyboard } from "react-native";
import { supabase } from "../utils/supabase";

export type Link = {
    id: number;
    name: string;
    description: string;
    link: string;
    category: string;
    created_at: string;
};

export function useLinks() {
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("link-hub")
            .select("*")
            .order("created_at", { ascending: false });
        setLoading(false);
        if (error) {
            Alert.alert("Error", "Failed to fetch links.");
            console.error(error);
            return;
        }
        setLinks(data as Link[]);
    };

    const addLink = async (
        name: string,
        description: string,
        link: string,
        isPublic: boolean,
        onSuccess?: () => void
    ) => {
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
        Keyboard.dismiss();
        if (onSuccess) onSuccess();
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

    return {
        links,
        loading,
        fetchLinks,
        addLink,
        togglePrivacy,
        deleteLink,
    };
}
