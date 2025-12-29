'use client'

import { useState, useEffect } from 'react'

interface AutoReply {
  id: string
  keyword: string
  response: string
  enabled: boolean
}

interface Message {
  id: string
  sender: string
  text: string
  timestamp: Date
  isAutoReply: boolean
}

export default function Home() {
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([
    { id: '1', keyword: 'hello', response: 'Hi! Thanks for your message. How can I help you?', enabled: true },
    { id: '2', keyword: 'price', response: 'Please visit our website for pricing information or contact our sales team.', enabled: true },
    { id: '3', keyword: 'hours', response: 'We are open Monday-Friday 9AM-5PM EST.', enabled: true },
  ])

  const [messages, setMessages] = useState<Message[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [newResponse, setNewResponse] = useState('')
  const [connected, setConnected] = useState(false)
  const [simulatedNumber, setSimulatedNumber] = useState('')
  const [simulatedMessage, setSimulatedMessage] = useState('')

  const addAutoReply = () => {
    if (newKeyword && newResponse) {
      const newReply: AutoReply = {
        id: Date.now().toString(),
        keyword: newKeyword.toLowerCase(),
        response: newResponse,
        enabled: true,
      }
      setAutoReplies([...autoReplies, newReply])
      setNewKeyword('')
      setNewResponse('')
    }
  }

  const deleteAutoReply = (id: string) => {
    setAutoReplies(autoReplies.filter(reply => reply.id !== id))
  }

  const toggleAutoReply = (id: string) => {
    setAutoReplies(autoReplies.map(reply =>
      reply.id === id ? { ...reply, enabled: !reply.enabled } : reply
    ))
  }

  const simulateIncomingMessage = () => {
    if (!simulatedNumber || !simulatedMessage) return

    const incomingMsg: Message = {
      id: Date.now().toString(),
      sender: simulatedNumber,
      text: simulatedMessage,
      timestamp: new Date(),
      isAutoReply: false,
    }

    setMessages(prev => [...prev, incomingMsg])

    // Check for auto-reply match
    const messageLower = simulatedMessage.toLowerCase()
    const matchingReply = autoReplies.find(reply =>
      reply.enabled && messageLower.includes(reply.keyword)
    )

    if (matchingReply) {
      setTimeout(() => {
        const autoReplyMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'You (Auto)',
          text: matchingReply.response,
          timestamp: new Date(),
          isAutoReply: true,
        }
        setMessages(prev => [...prev, autoReplyMsg])
      }, 1000)
    }

    setSimulatedMessage('')
  }

  const connectWhatsApp = () => {
    setConnected(true)
  }

  const disconnectWhatsApp = () => {
    setConnected(false)
    setMessages([])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            WhatsApp Auto Reply
          </h1>
          <p className="text-gray-600">Automate your WhatsApp message responses</p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="font-semibold text-gray-800">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={connected ? disconnectWhatsApp : connectWhatsApp}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                connected
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {connected ? 'Disconnect' : 'Connect Demo'}
            </button>
          </div>

          {!connected && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a demo application showing WhatsApp auto-reply functionality.
                In a production environment, this would integrate with WhatsApp Business API.
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Auto Reply Rules */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Auto Reply Rules</h2>

            <div className="mb-6 space-y-3">
              <input
                type="text"
                placeholder="Keyword (e.g., 'hello')"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              />
              <textarea
                placeholder="Auto reply message"
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              />
              <button
                onClick={addAutoReply}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {autoReplies.map((reply) => (
                <div key={reply.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded">
                          {reply.keyword}
                        </span>
                        <span className={`text-xs ${reply.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                          {reply.enabled ? '• Active' : '• Disabled'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{reply.response}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => toggleAutoReply(reply.id)}
                      className={`flex-1 py-1 px-3 rounded text-sm font-semibold transition-colors ${
                        reply.enabled
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          : 'bg-green-100 hover:bg-green-200 text-green-700'
                      }`}
                    >
                      {reply.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => deleteAutoReply(reply.id)}
                      className="py-1 px-3 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-semibold transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Simulator */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Message Simulator</h2>

            {connected ? (
              <>
                <div className="mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Phone number (e.g., +1234567890)"
                    value={simulatedNumber}
                    onChange={(e) => setSimulatedNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={simulatedMessage}
                      onChange={(e) => setSimulatedMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && simulateIncomingMessage()}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    />
                    <button
                      onClick={simulateIncomingMessage}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 h-96 overflow-y-auto bg-gray-50">
                  {messages.length === 0 ? (
                    <p className="text-gray-400 text-center mt-8">No messages yet. Send a test message above.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div key={msg.id} className={`${msg.isAutoReply ? 'text-right' : 'text-left'}`}>
                          <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
                            msg.isAutoReply
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-gray-800 border border-gray-200'
                          }`}>
                            <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</p>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs mt-1 opacity-75">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="border border-gray-200 rounded-lg p-8 text-center text-gray-400">
                <p>Connect to start testing auto-replies</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{autoReplies.filter(r => r.enabled).length}</div>
            <div className="text-gray-600 mt-1">Active Rules</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{messages.length}</div>
            <div className="text-gray-600 mt-1">Total Messages</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {messages.filter(m => m.isAutoReply).length}
            </div>
            <div className="text-gray-600 mt-1">Auto Replies Sent</div>
          </div>
        </div>
      </div>
    </main>
  )
}
