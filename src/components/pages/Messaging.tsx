import { Sidebar } from "../Sidebar";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Calendar,
} from "lucide-react";
import { useState } from "react";

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    lastMessage: "Yes, I can start next week. Let's schedule a call?",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    lastMessage: "I've sent the proposal for your review",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    lastMessage: "Thank you! Looking forward to working with you",
    time: "2 days ago",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "David Park",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    lastMessage: "The requirements look good. I have some questions",
    time: "3 days ago",
    unread: 1,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "other",
    text: "Hi! I saw your project requirement for an Appian developer. I have 8+ years of experience in BPM solutions.",
    time: "9:15 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Great! I checked your profile and it looks like a good fit. Can you tell me about your experience with process automation?",
    time: "9:20 AM",
  },
  {
    id: 3,
    sender: "other",
    text: "I've worked on 50+ automation projects including document management, approval workflows, and integration with third-party systems.",
    time: "9:25 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "That's impressive! What's your availability for a 6-month project starting next month?",
    time: "10:10 AM",
  },
  {
    id: 5,
    sender: "other",
    text: "Yes, I can start next week. Let's schedule a call?",
    time: "10:30 AM",
  },
];

export function Messaging() {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role="client" />
      <div className="flex-1 overflow-hidden flex">
        {/* Conversations List */}
        <div className="w-80 border-r flex flex-col bg-background">
          <div className="p-4 border-b">
            <h2 className="mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-9" />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                  selectedConversation.id === conversation.id
                    ? "bg-accent"
                    : ""
                }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="flex gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.image} />
                      <AvatarFallback>
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">
                        {conversation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {conversation.time}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <Badge
                          variant="default"
                          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-background flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={selectedConversation.image} />
                  <AvatarFallback>
                    {selectedConversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div>
                <p className="font-semibold">{selectedConversation.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-lg ${
                      message.sender === "me"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border"
                    } rounded-lg p-4`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === "me"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-background">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
