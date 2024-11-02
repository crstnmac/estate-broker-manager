import {createFileRoute} from '@tanstack/react-router'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent} from '@/components/ui/card'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import { Send, Search } from 'lucide-react'

export const Route = createFileRoute('/_layout/messages')({
  component: MessagesCommunication,
})

function MessagesCommunication() {
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'When can we schedule a viewing?',
      time: '10:30 AM',
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'Thanks for the property information.',
      time: 'Yesterday',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      lastMessage: "I'm interested in listing my house.",
      time: '2 days ago',
    },
  ]

  const messages = [
    {
      id: 1,
      sender: 'John Doe',
      content: "Hi, I'm interested in the property at 123 Main St.",
      time: '10:15 AM',
    },
    {
      id: 2,
      sender: 'You',
      content:
        "Hello John! I'd be happy to provide more information. What would you like to know?",
      time: '10:20 AM',
    },
    {
      id: 3,
      sender: 'John Doe',
      content: 'When can we schedule a viewing?',
      time: '10:30 AM',
    },
  ]

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-1/3 border-r">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Conversations</h2>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Search conversations..."
              className="w-full"
            />
            <Button size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {conversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="mb-2 cursor-pointer hover:bg-gray-100"
            >
              <CardContent className="flex items-center p-4">
                <Avatar className="h-10 w-10 mr-4">
                  <AvatarFallback>
                    {conversation.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{conversation.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {conversation.time}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">John Doe</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                <p>{message.content}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {message.time}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}