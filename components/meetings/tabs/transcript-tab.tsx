'use client';

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TranscriptTabProps {
    meeting: {
        transcriptUrl?: string;
        summary?: string;
    };
}

export const TranscriptTab = ({ meeting }: TranscriptTabProps) => {
    const handleDownload = () => {
        if (meeting.transcriptUrl) {
            window.open(meeting.transcriptUrl, '_blank');
        }
    };

    return (
        <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Meeting Transcript</h2>
                </div>
                {meeting.transcriptUrl && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                )}
            </div>

            <Card>
                <CardContent className="pt-6">
                    {meeting.transcriptUrl ? (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                The full transcript of this meeting is available for download.
                            </p>
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download Transcript
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Transcript Available</h3>
                            <p className="text-muted-foreground">
                                The transcript will be available once the meeting is completed and processed.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
