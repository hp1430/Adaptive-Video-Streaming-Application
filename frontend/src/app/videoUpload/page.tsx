"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';

interface Video {
    movieId: string;
}

export default function VideoUpload() {
    const [reload, setReload] = useState<boolean>(false);
    const [uploadedVideos, setUploadedVideos] = useState<Video[]>([]);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get('http://localhost:3000/api/v1/getVideos');
            return response;
        };
        fetchData().then((response) => {
            console.log(response.data);
            setUploadedVideos(response.data);
        })
        .catch((error) => {
            console.log("Error while fetching the data ", error);
        });
    }, [reload]);

    const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        console.log(file);
        try {
            const formData = new FormData();
            formData.append("video", file);
            const response = await axios.post(
                'http://localhost:3000/api/v1/videos/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }

            );

            console.log(response.data);
            setTimeout(()=>{
                setReload(file => !file);
            }, 1000);
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }


    return (
        <div
            className="flex flex-row w-4/5"
        >
            <div
                className="flex-1 min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-4"
            >
                <div
                    className="max-w-md w-full bg-white shadow-lg rounded-lg p-6"
                >
                    <h1>
                        Upload your video here
                    </h1>

                    <input 
                        type="file"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-700 rounded-lg border border-gray-300 p-2 mt-2 cursor-pointer bg-gray-500 mb-4"
                    />

                </div>
            </div>

            <div >
                <h1 className='text-xl mb-4 font-bold'>Uploaded Videos:</h1>
                {uploadedVideos.length === 0 ? (
                    <p>No videos uploaded yet.</p>
                ) : (
                    <ul>
                        {uploadedVideos.map((video, index) => {
                            // Safely split the movieId and extract the last part
                            const videoName = video.movieId?.split("/").pop() || "Unnamed Video";
                            return <li 
                                key={index}
                                className='border 4px solid black bg-gray-500 px-4 py-2 mb-1 rounded-md cursor-pointer hover:bg-gray-600'
                                onClick={() => router.push(`/stream/${videoName}`)}
                            >
                                {videoName}
                            </li>;
                        })}
                    </ul>
                )}
            </div>
        </div>
    )
}