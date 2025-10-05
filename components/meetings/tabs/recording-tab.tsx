'use client';

import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Download, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface RecordingTabProps {
    meeting: {
        id: string;
        name: string;
        recordingUrl?: string;
        startedAt?: string;
        endedAt?: string;
    };
}

export const RecordingTab = ({ meeting }: RecordingTabProps) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleDownload = () => {
        if (meeting.recordingUrl) {
            window.open(meeting.recordingUrl, '_blank');
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        if (videoRef.current) {
            videoRef.current.volume = value[0];
            setVolume(value[0]);
            setIsMuted(value[0] === 0);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (!isFullscreen) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            setIsFullscreen(!isFullscreen);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getDuration = () => {
        if (meeting.startedAt && meeting.endedAt) {
            const start = new Date(meeting.startedAt);
            const end = new Date(meeting.endedAt);
            const diffMs = end.getTime() - start.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffSecs = Math.floor((diffMs % 60000) / 1000);
            return `${diffMins}:${diffSecs.toString().padStart(2, '0')}`;
        }
        return formatTime(duration);
    };

    return (
        <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Meeting Recording</h2>
                </div>
                {meeting.recordingUrl && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="pt-6">
                    {meeting.recordingUrl ? (
                        <div className="space-y-4">
                            {/* Video Player */}
                            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    src={meeting.recordingUrl}
                                    className="w-full h-full object-contain"
                                    onTimeUpdate={handleTimeUpdate}
                                    onLoadedMetadata={handleLoadedMetadata}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />

                                {/* Video Controls Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    {/* Progress Bar */}
                                    <div className="mb-3">
                                        <Slider
                                            value={[currentTime]}
                                            max={duration || 100}
                                            step={1}
                                            onValueChange={handleSeek}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Control Buttons */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={togglePlay}
                                                className="text-white hover:bg-white/20"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-4 h-4" />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                            </Button>

                                            <div className="flex items-center gap-2 text-white text-sm">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>/</span>
                                                <span>{getDuration()}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={toggleMute}
                                                className="text-white hover:bg-white/20"
                                            >
                                                {isMuted ? (
                                                    <VolumeX className="w-4 h-4" />
                                                ) : (
                                                    <Volume2 className="w-4 h-4" />
                                                )}
                                            </Button>

                                            <div className="w-20">
                                                <Slider
                                                    value={[isMuted ? 0 : volume]}
                                                    max={1}
                                                    step={0.1}
                                                    onValueChange={handleVolumeChange}
                                                    className="w-full"
                                                />
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={toggleFullscreen}
                                                className="text-white hover:bg-white/20"
                                            >
                                                <Maximize className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                            <div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Recording Available</h3>
                            <p className="text-muted-foreground">
                                The recording will be available once the meeting is completed and processed.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
