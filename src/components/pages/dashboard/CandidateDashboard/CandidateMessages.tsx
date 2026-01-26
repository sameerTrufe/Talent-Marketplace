import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  MessageSquare, 
  Search, 
  Send, 
  User,
  Check,
  Clock
} from 'lucide-react';

const CandidateMessages: React.FC = () => {
  const conversations = [
    {
      id: '1',
      name: 'Jane Smith',
      role: 'Recruiter, TechCorp',
      lastMessage: 'Looking forward to our interview tomorrow!',
      time: '10:30 AM',
      unread: true
    },
    {
      id: '2',
      name: 'John Doe',
      role: 'HR Manager, Global Solutions',
      lastMessage: 'We\'d like to proceed with the next round.',
      time: 'Yesterday',
      unread: false
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      role: 'Talent Acquisition, Innovate Labs',
      lastMessage: 'Thanks for submitting your application.',
      time: '2 days ago',
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/candidate/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with recruiters and employers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b hover:bg-accent cursor-pointer ${
                    conversation.unread ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.role}</p>
                      <p className="text-sm truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Jane Smith</h3>
                  <p className="text-sm text-muted-foreground">Recruiter, TechCorp Inc</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[500px]">
              {/* Messages */}
              <div className="space-y-4">
                {/* Received Message */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p>Hi John, thanks for applying to the Senior Appian Developer position. Your profile looks great!</p>
                      <p className="mt-2">We'd like to schedule an interview for tomorrow at 10 AM. Does that work for you?</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Yesterday, 10:30 AM</span>
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Sent Message */}
                <div className="flex gap-3 justify-end">
                  <div>
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                      <p>Hi Jane, thanks for getting back to me! Yes, tomorrow at 10 AM works perfectly for me.</p>
                      <p className="mt-2">Looking forward to our conversation!</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1 justify-end">
                      <span className="text-xs text-muted-foreground">Yesterday, 11:15 AM</span>
                      <Check className="h-3 w-3 text-green-500" />
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Received Message */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <p>Great! I've scheduled the interview. Here are the meeting details:</p>
                      <p className="mt-2"><strong>Date:</strong> Tomorrow, January 25</p>
                      <p><strong>Time:</strong> 10:00 AM EST</p>
                      <p><strong>Meeting Link:</strong> https://meet.google.com/abc-defg-hij</p>
                      <p className="mt-2">Looking forward to our interview tomorrow!</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">Today, 10:30 AM</span>
                      <Check className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Empty State */}
        <div className="text-center mt-8 hidden">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
          <p className="text-muted-foreground mb-6">
            Start a conversation with recruiters or employers to get messages here.
          </p>
          <Button asChild>
            <Link to="/candidate/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateMessages;