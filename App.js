import React, { useState } from 'react';
import { Button, Linking, Text, View, Alert } from 'react-native';
import * as tus from 'tus-js-client';
import { FileUpload } from './common-view-function';
let accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjcmVhdGVkX2F0IjoxNzE4ODc5NTUzLCJ2YWxpZF9mb3IiOjE4MDAsInVzZXJfaWQiOiI0MzQ3NCIsImFjY2VzcyI6ImZ1bGwifQ.6ajEGcLE6wacNBdo3bJ7uRPHqdVEv6YjK7WeEnpm5Qc";



const App = () => {
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('no file selected');
    const [uploadUrl, setUploadUrl] = useState(null);
    const [progress, setProgress] = useState(0);

    const selecteFile = async () => {
        const file = await FileUpload.uploadVideo();
        console.log("Fiel is ---> ", file)
        setFile(file);
    }


    const startUpload = async () => {
        console.log("Here....")
        if (!file) return;

        console.log("uploading file is ---> ", file);
        let fileSizeInMBs = file.size / (1024 * 1024 * 1024);

        console.log("File Size im mb is ", fileSizeInMBs, " GB")
        const startTime = new Date().getTime();


        const upload = new tus.Upload(
            { uri: file.uri },
            {
                endpoint: 'https://uploader.lykstage.com/files',
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                },
                retryDelays: [0, 3000, 5000, 10000, 20000],
                metadata: {
                    filename: file.name,
                    filetype: file.type,
                },
                onError: (error) => {
                    setStatus("Error while uploading ....")
                    console.log("error happende ----> ", (error))
                    setStatus(`upload failed ${error}`);
                },
                onProgress: (bytesUploaded, bytesTotal) => {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                    console.log("Upload progress ::: --> ", percentage);
                    setProgress(percentage);
                },
                onSuccess: () => {
                    console.log("Upload finished....>>>  ");
                    console.log('Upload URL :', upload.url);
                    const endTime = new Date().getTime();
                    const timeDifference = Math.ceil((endTime - startTime) / 1000 / 60); // Convert milliseconds to seconds
                    let fileSizeInMBs = file.size / (1024 * 1024);
                    console.log(`Time taken for upload ${fileSizeInMBs} MB file is  ${timeDifference} Minute`);
                },
            });
        upload.start();

    };



    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10, marginTop: 40 }}>
            <View style={{ marginVertical: 10 }} />
            <Button title="Select Video" onPress={selecteFile} />
            <View style={{ marginVertical: 10 }} />
            <Button title="Upload File" onPress={startUpload} />
            <View style={{ marginVertical: 10 }} />
            <Text>Progress: {progress}%</Text>
            <Text>Status : {status} </Text>
        </View>
    );
};

export default App;
