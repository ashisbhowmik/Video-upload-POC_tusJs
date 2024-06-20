import { Platform } from "react-native";
import { Permissions } from ".";
import DocumentPicker from "react-native-document-picker";

export function uploadVideo() {
    return new Promise(async function (resolved, reject) {
        try {
            if (Platform.OS === "android") {
                const granted = await Permissions.GetAllPermissionsForAccess("storage");
                if (granted) {
                    try {
                        const res = await DocumentPicker.pick({
                            type: [
                                DocumentPicker.types.video
                            ],
                        });
                        let docResData = {
                            uri: res[0].uri,
                            type: res[0].type,
                            name: res[0].name,
                            size: res[0].size,
                        };
                        resolved(docResData);
                    } catch (err) {
                        if (DocumentPicker.isCancel(err)) {
                            console.log("error -----", err);
                        } else {
                            resolved(err);
                        }
                    }
                }
            } else {
                try {
                    const res = await DocumentPicker.pick({
                        type: [
                            DocumentPicker.types.video
                        ],
                    });
                    let docResData = {
                        uri: res[0].uri,
                        type: res[0].type,
                        name: res[0].name,
                        size: res[0].size,
                    };
                    resolved(docResData);
                } catch (err) {
                    if (DocumentPicker.isCancel(err)) {
                        console.log("error -----", err);
                    } else {
                        resolved(err);
                    }
                }
            }
        } catch (err) {
            // resolved(err)
            console.log(err);
        }
    });
}