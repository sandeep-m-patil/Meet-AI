import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Plus, Settings, Play, Pause, Trash2, Edit, MoreHorizontal } from 'lucide-react';

export default function AgentsPage() {
  const agents = [
    {
      id: 1,
      name: 'Meeting Assistant',
      description: 'Automatically joins meetings and provides real-time assistance with note-taking and action item tracking.',
      status: 'Active',
      meetings: 24,
      lastUsed: '2 hours ago',
      type: 'General Purpose',
      avatar: '🤖'
    },
    {
      id: 2,
      name: 'Note Taker Pro',
      description: 'Specialized in capturing detailed meeting notes with perfect accuracy and speaker identification.',
      status: 'Paused',
      meetings: 12,
      lastUsed: '1 day ago',
      type: 'Note Taking',
      avatar: '📝'
    },
    {
      id: 3,
      name: 'Action Items Tracker',
      description: 'Identifies and tracks action items from meetings, sending follow-up reminders automatically.',
      status: 'Active',
      meetings: 8,
      lastUsed: '30 minutes ago',
      type: 'Task Management',
      avatar: '✅'
    },
    {
      id: 4,
      name: 'Client Meeting Bot',
      description: 'Optimized for client meetings with professional transcription and relationship insights.',
      status: 'Active',
      meetings: 15,
      lastUsed: '1 hour ago',
      type: 'Client Focused',
      avatar: '👥'
    },
  ];

  const agentTypes = [
    { name: 'All Agents', count: 4, active: 3 },
    { name: 'General Purpose', count: 1, active: 1 },
    { name: 'Note Taking', count: 1, active: 0 },
    { name: 'Task Management', count: 1, active: 1 },
    { name: 'Client Focused', count: 1, active: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p className="text-gray-600">Manage your AI meeting assistants and their configurations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Agent
        </Button>
      </div>

      {/* Agent Types Filter */}
      <div className="flex flex-wrap gap-2">
        {agentTypes.map((type, index) => (
          <Badge 
            key={index} 
            variant={index === 0 ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-gray-100"
          >
            {type.name} ({type.active}/{type.count})
          </Badge>
        ))}
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{agent.avatar}</div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {agent.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="mt-2">{agent.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                  <span className="text-sm text-gray-500">Last used: {agent.lastUsed}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Meetings:</span>
                  <span className="font-medium">{agent.meetings}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                  >
                    {agent.status === 'Active' ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Start
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New Agent Card */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Agent</h3>
          <p className="text-gray-600 text-center mb-4">
            Build a custom AI agent tailored to your specific meeting needs
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Agent
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
