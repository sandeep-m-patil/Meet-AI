'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface TranscriptTabProps {
    meeting: {
        id: string;
        transcriptUrl?: string;
        summary?: string;
    };
}

interface TranscriptSegment {
    id: string;
    timestamp: string;
    speaker: string;
    speakerType: 'user' | 'agent' | 'unknown';
    text: string;
    duration: number;
    startTime: number;
    endTime: number;
}

interface TranscriptStats {
    totalDuration: number;
    totalSegments: number;
    totalWords: number;
    speakers: Array<{
        name: string;
        type: string;
        segments: number;
        totalDuration: number;
        wordCount: number;
    }>;
}

interface FormattedTranscriptData {
    transcript: TranscriptSegment[];
    stats: TranscriptStats;
}

export const TranscriptTab = ({ meeting }: TranscriptTabProps) => {
    const [transcriptData, setTranscriptData] = useState<FormattedTranscriptData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch and format transcript content when component mounts
    useEffect(() => {
        if (meeting.transcriptUrl) {
            fetchAndFormatTranscript();
        }
    }, [meeting.transcriptUrl]);

    const fetchAndFormatTranscript = async () => {
        if (!meeting.transcriptUrl) return;
        
        setIsLoading(true);
        setError(null);
        
        try {
            console.log('Calling transcript API with:', { meetingId: meeting.id, transcriptUrl: meeting.transcriptUrl });
            
            // Call the transcript formatting API
            const response = await fetch('/api/meetings/format-transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meetingId: meeting.id,
                    transcriptUrl: meeting.transcriptUrl
                })
            });

            console.log('API Response status:', response.status);
            console.log('API Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`Failed to format transcript: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('API Response data:', result);
            
            if (result.success) {
                setTranscriptData(result);
            } else {
                throw new Error(result.error || 'Failed to format transcript');
            }
        } catch (err) {
            console.error('Error formatting transcript:', err);
            setError(err instanceof Error ? err.message : 'Failed to load transcript');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (meeting.transcriptUrl) {
            window.open(meeting.transcriptUrl, '_blank');
        }
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getSpeakerBadgeColor = (speakerType: string) => {
        switch (speakerType) {
            case 'user': return 'bg-blue-100 text-blue-800';
            case 'agent': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 py-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Meeting Transcript</h2>
                </div>
                <div className="flex items-center gap-2">
                    {meeting.transcriptUrl && (
                        <Button variant="outline" size="sm" onClick={fetchAndFormatTranscript} disabled={isLoading}>
                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    )}
                {meeting.transcriptUrl && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                )}
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {error && (
                        <Alert className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin mr-2" />
                            <span>Processing transcript...</span>
                        </div>
                    ) : meeting.transcriptUrl ? (
                        <div className="space-y-4">
                            {transcriptData ? (
                                <div className="space-y-4">
                                    {/* Transcript Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{transcriptData.stats.totalSegments}</p>
                                            <p className="text-sm text-muted-foreground">Segments</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{transcriptData.stats.totalWords}</p>
                                            <p className="text-sm text-muted-foreground">Words</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{formatDuration(transcriptData.stats.totalDuration)}</p>
                                            <p className="text-sm text-muted-foreground">Duration</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold">{transcriptData.stats.speakers.length}</p>
                                            <p className="text-sm text-muted-foreground">Speakers</p>
                                        </div>
                                    </div>

                                    {/* Speaker Stats */}
                                    <div className="space-y-2">
                                        <h3 className="font-medium">Speaker Statistics</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {transcriptData.stats.speakers.map((speaker, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={getSpeakerBadgeColor(speaker.type)}>
                                                            {speaker.type}
                                                        </Badge>
                                                        <span className="font-medium">{speaker.name}</span>
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {speaker.segments} segments • {speaker.wordCount} words
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Transcript Content */}
                                    <div className="space-y-2">
                                                                                
                                        <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4">
                                            {transcriptData.transcript.map((segment) => (
                                                <div key={segment.id} className="flex gap-3">
                                                    <div className="flex-shrink-0 w-16 text-xs text-muted-foreground mt-1">
                                                        {segment.timestamp}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-medium text-sm">{segment.speaker}</span>
                                                            <Badge className={getSpeakerBadgeColor(segment.speakerType)}>
                                                                {segment.speakerType}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm leading-relaxed">
                                                            {segment.text}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                The full transcript of this meeting is available for download.
                            </p>
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download Transcript
                            </Button>
                                </div>
                            )}
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
