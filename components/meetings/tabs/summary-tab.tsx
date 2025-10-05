'use client';

import { Clock, Sparkles, CheckCircle, Target, Users, Calendar, User } from "lucide-react";
import { GeneratedAvatar } from "@/components/avatar/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SummaryTabProps {
    meeting: {
        id: string;
        name: string;
        startedAt?: string;
        endedAt?: string;
        summary?: string;
        status?: string;
        createdAt?: string;
    };
    agent?: {
        name: string;
        instructions?: string;
    };
}

export const SummaryTab = ({ meeting, agent }: SummaryTabProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getDuration = () => {
        if (!meeting.startedAt || !meeting.endedAt) return null;
        const start = new Date(meeting.startedAt);
        const end = new Date(meeting.endedAt);
        const durationMs = end.getTime() - start.getTime();
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.floor((durationMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'active': return 'bg-blue-100 text-blue-800';
            case 'upcoming': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Parse summary if it exists, otherwise show default content
    const getSummaryContent = () => {
        if (meeting.summary) {
            try {
                // Try to parse as JSON if it's structured
                const parsed = JSON.parse(meeting.summary);
                
                // Validate the structure and provide defaults
                return {
                    overview: parsed.overview || "No overview available",
                    keyPoints: parsed.keyPoints || [],
                    actionItems: parsed.actionItems || [],
                    topics: parsed.topics || [],
                    participants: parsed.participants || []
                };
            } catch {
                // If not JSON, return as plain text
                return { 
                    overview: meeting.summary,
                    keyPoints: [],
                    actionItems: [],
                    topics: [],
                    participants: []
                };
            }
        }
        
        // Default content when no summary is available
        return {
            overview: "This meeting summary is being generated. Please check back later or view the transcript for detailed information.",
            keyPoints: [],
            actionItems: [],
            topics: [],
            participants: []
        };
    };

    const summaryContent = getSummaryContent();
    const duration = getDuration();

    return (
        <div className="space-y-6 py-6">
            {/* Meeting Header */}
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground">{meeting.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {agent && (
                                <div className="flex items-center gap-2">
                                    <GeneratedAvatar
                                        variant="botttsNeutral"
                                        seed={agent.name}
                                        className="h-5 w-5 rounded-full border"
                                    />
                                    <span className="font-medium text-foreground">{agent.name}</span>
                                </div>
                            )}
                            {meeting.startedAt && (
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(meeting.startedAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {meeting.status && (
                        <Badge className={getStatusColor(meeting.status)}>
                            {meeting.status}
                        </Badge>
                    )}
                </div>

                {/* Meeting Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {duration && (
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Duration</p>
                                    <p className="font-semibold">{duration}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                    
                    {meeting.startedAt && (
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Calendar className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Started</p>
                                    <p className="font-semibold">{formatTime(meeting.startedAt)}</p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {agent && (
                        <Card className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">AI Agent</p>
                                    <p className="font-semibold">{agent.name}</p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Separator />

            {/* Summary Content */}
            <div className="space-y-6">
                {/* Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Overview
                        </CardTitle>
                    </CardHeader>
                     <CardContent>
                         <div className="prose prose-sm max-w-none">
                             <p className="text-foreground leading-7 text-base mb-4">
                                 {summaryContent.overview}
                             </p>
                         </div>
                     </CardContent>
                </Card>

                {/* Key Points */}
                {summaryContent.keyPoints && summaryContent.keyPoints.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Key Points
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {summaryContent.keyPoints.map((point: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <span className="text-muted-foreground leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Action Items */}
                {summaryContent.actionItems && summaryContent.actionItems.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                Action Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {summaryContent.actionItems.map((item: string, index: number) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Topics Discussed */}
                {summaryContent.topics && summaryContent.topics.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Topics Discussed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {summaryContent.topics.map((topic: any, index: number) => (
                                    <div key={index} className="p-3 border rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{topic.name}</h4>
                                            {topic.timestamp && (
                                                <Badge variant="outline" className="text-xs">
                                                    {topic.timestamp}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{topic.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Participants */}
                {summaryContent.participants && summaryContent.participants.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" />
                                Participants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {summaryContent.participants.map((participant: any, index: number) => (
                                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-blue-600">
                                                {participant.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">{participant.name}</span>
                                                {participant.role && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {participant.role}
                                                    </Badge>
                                                )}
                                            </div>
                                            {participant.contribution && (
                                                <p className="text-sm text-muted-foreground">{participant.contribution}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
