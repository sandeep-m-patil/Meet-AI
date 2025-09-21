import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Calendar, Users, Clock, Download, Eye, Play, Filter, Search } from 'lucide-react';

export default function MeetsPage() {
  const meetings = [
    {
      id: 1,
      title: 'Product Planning Meeting',
      date: '2024-01-15',
      time: '2:00 PM - 3:00 PM',
      participants: 5,
      status: 'Completed',
      duration: '1h 15m',
      recording: true,
      agent: 'Meeting Assistant',
      summary: 'Discussed Q1 roadmap and feature priorities'
    },
    {
      id: 2,
      title: 'Team Standup',
      date: '2024-01-15',
      time: '10:00 AM - 10:30 AM',
      participants: 8,
      status: 'Completed',
      duration: '28m',
      recording: true,
      agent: 'Note Taker Pro',
      summary: 'Daily progress updates and blocker discussions'
    },
    {
      id: 3,
      title: 'Client Demo',
      date: '2024-01-15',
      time: '4:30 PM - 5:30 PM',
      participants: 3,
      status: 'In Progress',
      duration: '45m',
      recording: true,
      agent: 'Client Meeting Bot',
      summary: 'Product demonstration for potential client'
    },
    {
      id: 4,
      title: 'Sprint Retrospective',
      date: '2024-01-14',
      time: '3:00 PM - 4:00 PM',
      participants: 6,
      status: 'Completed',
      duration: '1h 5m',
      recording: false,
      agent: 'Action Items Tracker',
      summary: 'Team reflection on sprint performance and improvements'
    },
    {
      id: 5,
      title: 'Design Review',
      date: '2024-01-14',
      time: '11:00 AM - 12:00 PM',
      participants: 4,
      status: 'Completed',
      duration: '58m',
      recording: true,
      agent: 'Meeting Assistant',
      summary: 'UI/UX design feedback and iteration planning'
    },
  ];

  const stats = [
    { title: 'Total Meetings', value: '24', change: '+3 this week' },
    { title: 'Meeting Hours', value: '18.5h', change: '+2h this week' },
    { title: 'Participants', value: '156', change: '+12 this week' },
    { title: 'Recordings', value: '22', change: '+2 this week' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600">View and manage your meeting recordings and transcripts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Video className="h-4 w-4 mr-2" />
            Start Meeting
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-xs text-green-600">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Recording
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings List */}
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{meeting.title}</h3>
                    <Badge variant={meeting.status === 'Completed' ? 'default' : 'secondary'}>
                      {meeting.status}
                    </Badge>
                    {meeting.recording && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        <Video className="h-3 w-3 mr-1" />
                        Recorded
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-3">{meeting.summary}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{meeting.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4" />
                      <span>{meeting.duration}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">
                      Agent: {meeting.agent}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {meeting.recording && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {meeting.status === 'In Progress' && (
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">
          Load More Meetings
        </Button>
      </div>
    </div>
  );
}
