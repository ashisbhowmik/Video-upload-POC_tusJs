import React, { useState } from 'react';
import { View, Button, Alert, Text } from 'react-native';
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';


let token = "";

const VideoUpload = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const CHUNK_SIZE = 10 * 1024 * 1024
    const apiClient = axios.create({ baseURL: 'https://upload.lykstage.com:9092', headers: { "Content-Type": "application/json" } });
    let partsArray = [];


    const selectFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [types.video],
            });
            setFile(res[0]);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                Alert.alert('Error', 'Failed to pick a file');
            }
        }
    };


    const fetchToken = async () => {
        console.log("in the fetchtoken function")
        try {
            const result = await apiClient.post("/noauth/tkn", { userId: "12345" });
            const accessToken = result.data.response.access_token;
            console.log(" accessToken =====================  ", accessToken);
            token = accessToken;
            apiClient.defaults.headers.Authorization = "Bearer " + accessToken;
            return accessToken;
        } catch (error) { console.error('Error fetching token:', error); }
    };

    const getfileToken = async (fName, fileType, fileSize, totalChunks) => {
        const response = await fetch('https://upload.lykstage.com:9092/mob/inUp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fileName: fName,
                fileType: fileType,
                size: fileSize,
                totalChunks: totalChunks
            })
        });
        const initResp = await response.json();
        const fileToken = initResp.response.fileToken;
        return fileToken;
    }


    const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

    const uploadFile = async () => {
        if (!token) {
            await fetchToken();
        }
        if (!file) {
            console.log('Please select a file.');
            return;
        }
        else {
            await uploadFileBackgroundTask(file)
        }
    };




    const uploadFileBackgroundTask = async (file) => {
        let fileSizeInMBs = file.size / (1024 * 1024);

        console.log("File Size im mb is ", fileSizeInMBs, " MB ")

        const startTime = new Date().getTime();
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        console.log("file is >> ", file);
        console.log("TotalChunks >> ", totalChunks)

        try {
            let fileToken = await getfileToken(file.name, file.type, file.size, totalChunks);
            console.log("FileToken is >>>> ", fileToken)
            const chunkQueue = [];
            for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
                console.log("Creating chunk....")
                const start = (partNumber - 1) * CHUNK_SIZE;
                const end = Math.min(partNumber * CHUNK_SIZE, file.size);
                chunkQueue.push({ partNumber, start, end });
            }
            console.log("Complete creating chunk...")
            for (let i = 0; i < chunkQueue.length; i++) {
                await uploadChunk(fileToken, file.uri, totalChunks, chunkQueue[i].partNumber, chunkQueue[i].start, chunkQueue[i].end)
            }
            console.log("upload done >>>>>>> ");
            console.log("parts Arryay is >>>> ", partsArray);
            const endTime = new Date().getTime();
            const timeDifference = Math.ceil((endTime - startTime) / 1000 / 60); // Convert milliseconds to seconds
            let fileSizeInMBs = file.size / (1024 * 1024);
            console.log(`Time taken for upload ${fileSizeInMBs} MB file is  ${timeDifference} Minute`);

        }
        catch (e) {
            console.warn("Error happend---> ", e)
        }


    }



    const uploadChunk = async (fileToken, filePath, totalChunks, partNumber, start, end, retries = 3) => {
        const startTime = new Date().getTime();
        console.log("in the uploadChunk >>>> ", "partnumber : ", partNumber)
        try {
            const partData = await RNFS.read(filePath, end - start, start, 'base64');
            const presignedUrlResponse = await fetch('https://upload.lykstage.com:9092/mob/gtUp', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    fileToken: fileToken,
                    partNumber: partNumber
                })
            });

            if (!presignedUrlResponse.ok) {
                const errorText = await presignedUrlResponse.text();
                console.error('Failed to get presigned URL:', errorText);
                throw new Error('Failed to get presigned URL');
            }

            const preResp = await presignedUrlResponse.json();
            console.log("presignedUrlResponse for partNumber : ", partNumber, " is  : ", preResp?.response?.url)
            const uploadResponse = await RNFetchBlob.fetch('PUT', preResp?.response?.url, {
                'Content-Type': 'application/octet-stream',
            }, partData);
            const eTag = uploadResponse?.respInfo?.headers?.ETag;
            if (eTag) {
                partsArray.push({ ETag: eTag, PartNumber: partNumber });
                const uploadProgress = (partsArray.length / totalChunks * 100).toFixed(2);
                setProgress(uploadProgress)
                const endTime = new Date().getTime();
                const timeDifference = (endTime - startTime) / 1000; // Convert milliseconds to seconds
                console.log(`Time taken for partNo  ${partNumber} is : ${timeDifference} seconds`);
                console.log("progress is --> ", uploadProgress);
                console.log("\n");
                console.log("\n");
                console.log("\n")
            } else {
                console.log('Part upload failed.');
                throw new Error('Part upload failed');
            }
        } catch (error) {
            if (retries > 0) {
                console.warn(`Retrying chunk ${partNumber}... (${retries} retries left)`);
                await sleep(2000); // Adding sleep to avoid immediate retries
                await uploadChunk(fileToken, filePath, totalChunks, partNumber, start, end, retries - 1);
            } else {
                throw error;
            }
        }
    };





    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, marginTop: 40 }}>
            {/* <Button title="Fetch Token" onPress={fetchToken} /> */}


            <View style={{ marginVertical: 10 }} />

            <Button title="Select Video" onPress={selectFile} />
            <View style={{ marginVertical: 10 }} />
            <Button title="Upload File" onPress={uploadFile} />
            <View style={{ marginVertical: 10 }} />

            <Text>Progress: {progress}%</Text>
        </View>
    )
}

export default VideoUpload