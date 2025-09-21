import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Video, Users, TrendingUp, Calendar, Clock, Plus, Play } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { title: 'Active Agents', value: '3', icon: Bot, change: '+1 this week', color: 'text-blue-600' },
    { title: 'Meetings Today', value: '8', icon: Video, change: '+3 from yesterday', color: 'text-green-600' },
    { title: 'Total Participants', value: '1,234', icon: Users, change: '+12% this week', color: 'text-purple-600' },
    { title: 'Meeting Hours', value: '24.5', icon: Clock, change: '+8% this month', color: 'text-orange-600' },
  ];

  const recentMeetings = [
    { 
      id: 1, 
      title: 'Product Planning Meeting', 
      time: '2:00 PM', 
      participants: 5, 
      status: 'Completed',
      duration: '1h 15m',
      agent: 'Meeting Assistant'
    },
    { 
      id: 2, 
      title: 'Team Standup', 
      time: '10:00 AM', 
      participants: 8, 
      status: 'Completed',
      duration: '28m',
      agent: 'Note Taker'
    },
    { 
      id: 3, 
      title: 'Client Demo', 
      time: '4:30 PM', 
      participants: 3, 
      status: 'In Progress',
      duration: '45m',
      agent: 'Action Tracker'
    },
  ];

  const upcomingMeetings = [
    { title: 'Sprint Review', time: '3:00 PM', participants: 6, agent: 'Meeting Assistant' },
    { title: 'Design Critique', time: '5:00 PM', participants: 4, agent: 'Note Taker' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your meetings.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start Meeting
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Meetings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Meetings</CardTitle>
              <CardDescription>Your latest meeting activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        meeting.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {meeting.time}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {meeting.participants} participants
                          </span>
                          <span className="flex items-center">
                            <Bot className="h-3 w-3 mr-1" />
                            {meeting.agent}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={meeting.status === 'Completed' ? 'default' : 'secondary'}>
                        {meeting.status}
                      </Badge>
                      <span className="text-sm text-gray-500">{meeting.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Meetings & Quick Actions */}
        <div className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>Your scheduled meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{meeting.title}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {meeting.time}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {meeting.participants}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {meeting.agent}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Bot className="h-6 w-6" />
                  <span className="text-xs">Create Agent</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Video className="h-6 w-6" />
                  <span className="text-xs">Start Meeting</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-xs">Schedule</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
