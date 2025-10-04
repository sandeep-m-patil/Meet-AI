'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Video, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingTabProps {
    meeting: {
        name: string;
        recordingUrl?: string;
    };
}

export const RecordingTab = ({ meeting }: RecordingTabProps) => {
    const handleDownload = () => {
        if (meeting.recordingUrl) {
            window.open(meeting.recordingUrl, '_blank');
        }
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
                            {/* Video Player Placeholder */}
                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                    <Play className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                    <p className="text-muted-foreground">Video Player</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <Button onClick={handleDownload} className="flex-1">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Recording
                                </Button>
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
