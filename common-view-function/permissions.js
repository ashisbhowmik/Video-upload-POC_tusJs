// permissions file write here

import { PermissionsAndroid, Platform } from "react-native";



// for get all permissions
export async function GetAllPermissionsForAccess(type) {
    // it will ask the permission for user foe all
    try {
        if (Platform.OS == "android") {
            if (Platform.Version < 33) {
                if (type == "camera") {
                    return (await getCameraPermission());
                } else if (type == "storage") {
                    let tempPermission = await getWriteExternalStoragePermission();
                    tempPermission = await getReadExternalStoragePermission();
                    return (tempPermission);
                } else if (type == "all") {
                    return (await getAllPermissionLessSdk33());
                } else {
                    return true;
                }
            } else {
                if (type == "camera") {
                    return (await getCameraPermission());
                } else if (type == "storage") {
                    let tempPermission = await getAccessReadMediaImagesPermission();
                    tempPermission = await getAccessReadMediaVideoPermission();
                    tempPermission = await getAccessReadMediaAudioPermission();
                    return (tempPermission);
                } else if (type == "audio") {
                    return (await getAccessReadMediaAudioPermission());
                } else if (type == "all") {
                    return (await getAllPermissionGretterSdk33());
                } else {
                    return true;
                }
            }
        } else {
            return null;
        }
    } catch (err) {
        console.log(err);
        return null;
    }
}

// All permission for less than sdk 33
export async function getAllPermissionLessSdk33() {
    try {
        const userResponse = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ]);
        return userResponse;
    } catch (err) {
        console.warn(err);
        return null;
    }
}

// All permission for gratter than sdk 33
export async function getAllPermissionGretterSdk33() {
    try {
        const userResponse = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
            // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            // PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        return userResponse;
    } catch (err) {
        console.warn(err);
        return null;
    }
}
// for access the camera
export async function getCameraPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: "Camera",
                message:
                    'This app would like to access your camera.' +
                    'so you can take awesome pictures.',
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Camera');
            return true;
        } else {
            console.log('Camera permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}


// for access the Write External Storage
export async function getWriteExternalStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: "File",
                message:
                    "This app would like to write your file.",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the file write');
            return true;
        } else {
            console.log('file write permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}

// for access the Read External Storage
export async function getReadExternalStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
                title: "File",
                message:
                    "This app would like to view your file.",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the file read');
            return true;
        } else {
            console.log('file read permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}


// for access the Coarse Location
export async function getAccessCoarseLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                title: "Location",
                message:
                    "This app would like to Access the coarse location.",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the coarse location');
            return true;
        } else {
            console.log('Coarse location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}


// for access the Fine Location
export async function getAccessFineLocationPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location",
                message:
                    "This app would like to Access the fine location.",
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the fine location');
            return true;
        } else {
            console.log('Fine location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}


// for Android 13 and above

// for access the Read Media Images
export async function getAccessReadMediaImagesPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
                title: "Read Images",
                message:
                    'This app would like to access your images.' +
                    'so you can take awesome pictures.',
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the images');
            return true;
        } else {
            console.log('Images permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}

// for access the Read Media Video
export async function getAccessReadMediaVideoPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            {
                title: "Read Video",
                message:
                    'This app would like to access your Video.',
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the video');
            return true;
        } else {
            console.log('video permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}

// for access the Read Media Audio
export async function getAccessReadMediaAudioPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
            {
                title: "your Audio",
                message:
                    'This app would like to access your Audio.',
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the Audio');
            return true;
        } else {
            console.log('Audio permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}


// for access the Record Audio
export async function getAccessRecordAudioPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
                title: "Audio Record",
                message:
                    'This app would like to access your Audio Record.',
                buttonPositive: "OK"
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the record audio');
            return true;
        } else {
            console.log('Record audio permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
}

// for get all permissions
export async function GetAllPermissions() {
    // it will ask the permission for user
    try {
        if (Platform.OS == "android") {
            const userResponse = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                // PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]);
            return userResponse;
        }
    } catch (err) {
        console.log(err);
    }
    return null;
}
