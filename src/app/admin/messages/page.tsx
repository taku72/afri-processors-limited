'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MessageSquare, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  User,
  Trash2,
  X,
  Eye,
  EyeOff,
  Reply,
  Archive,
  Star,
  Clock,
  Send,
  Plus
} from 'lucide-react'

interface Message {
  id: number
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
  updated_at: string
  replied_at?: string
  archived_at?: string
  notes?: string
}

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null)
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notesContent, setNotesContent] = useState('')

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('adminSession')
    
    if (!sessionData) {
      router.push('/admin/login')
      return
    }
    
    let userData
    try {
      userData = JSON.parse(sessionData)
      setUser(userData)
    } catch {
      router.push('/admin/login')
      return
    }

    // Mock messages data
    const mockMessages: Message[] = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+256 784 123 456',
        subject: 'Inquiry about bulk moringa flour orders',
        message: 'Hello, I am interested in placing bulk orders for moringa flour for my health food store in Kampala. We would need approximately 500kg per month. Could you please provide pricing information and delivery options? Also, do you offer organic certification documentation?\n\nLooking forward to your response.\n\nBest regards,\nJohn Smith',
        status: 'unread',
        priority: 'high',
        created_at: '2024-01-20T09:30:00Z',
        updated_at: '2024-01-20T09:30:00Z'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.j@wellnessco.com',
        phone: '+256 752 987 654',
        subject: 'Partnership opportunity - Wellness products',
        message: 'Dear Afri Processors Team,\n\nI am the procurement manager at Wellness Co., a growing health products company. We are very impressed with your baobab flour products and would like to discuss potential partnership opportunities.\n\nCould we schedule a call to discuss:\n1. Wholesale pricing structures\n2. Custom packaging options\n3. Exclusive distribution rights for certain regions\n\nOur company is looking to expand our product line with authentic African superfoods.\n\nThank you for your time.\n\nSarah Johnson\nProcurement Manager\nWellness Co.',
        status: 'read',
        priority: 'medium',
        created_at: '2024-01-19T14:15:00Z',
        updated_at: '2024-01-20T08:00:00Z'
      },
      {
        id: 3,
        name: 'Michael Ochieng',
        email: 'michael.o@agritech.org',
        subject: 'Technical question about castor oil processing',
        message: 'Hi,\n\nI am researching castor oil processing methods for a small-scale agricultural project in western Kenya. I found your company online and was impressed with your operations.\n\nCould you provide information about:\n- Cold pressing vs traditional methods\n- Equipment requirements for small-scale production\n- Training opportunities\n\nI am particularly interested in learning about sustainable processing techniques.\n\nThanks,\nMichael',
        status: 'replied',
        priority: 'low',
        created_at: '2024-01-18T11:45:00Z',
        updated_at: '2024-01-19T10:30:00Z',
        replied_at: '2024-01-19T10:30:00Z',
        notes: 'Sent technical documentation and training information. Follow up scheduled for next week.'
      },
      {
        id: 4,
        name: 'Emma Davis',
        email: 'emma@exportltd.co.uk',
        phone: '+44 20 7123 4567',
        subject: 'URGENT: Export documentation needed',
        message: 'URGENT INQUIRY\n\nWe have an urgent shipment that requires proper export documentation by end of week. Our client needs:\n- Certificate of Origin\n- Phytosanitary Certificate\n- Organic Certification (if applicable)\n- Quality Analysis Report\n\nProducts: Moringa flour and Baobab flour\nQuantity: 2 containers\nDestination: Hamburg, Germany\n\nThis is time-sensitive. Please respond immediately with availability and pricing for expedited documentation.\n\nEmma Davis\nExport Manager\nGlobal Trade Ltd',
        status: 'unread',
        priority: 'urgent',
        created_at: '2024-01-20T16:20:00Z',
        updated_at: '2024-01-20T16:20:00Z'
      },
      {
        id: 5,
        name: 'David Kimani',
        email: 'david.kimani@gmail.com',
        subject: 'Feedback on your products',
        message: 'Hello,\n\nI just wanted to say that your moringa flour is excellent! I\'ve been using it for my family for the past 3 months and we\'ve noticed significant health improvements. The quality is consistent and the packaging is professional.\n\nDo you have a retail location in Nairobi where I can purchase directly? Also, are you planning to introduce any new products soon?\n\nKeep up the great work!\n\nDavid Kimani',
        status: 'archived',
        priority: 'low',
        created_at: '2024-01-15T13:10:00Z',
        updated_at: '2024-01-18T09:00:00Z',
        archived_at: '2024-01-18T09:00:00Z',
        notes: 'Positive feedback - customer satisfied. Provided information about Nairobi distributors.'
      }
    ]

    setMessages(mockMessages)
    setIsLoading(false)
  }, [router])

  const handleMarkAsRead = (message: Message) => {
    const updatedMessage = {
      ...message,
      status: 'read' as const,
      updated_at: new Date().toISOString()
    }
    setMessages(messages.map(m => m.id === message.id ? updatedMessage : m))
    setShowActionMenu(null)
  }

  const handleMarkAsUnread = (message: Message) => {
    const updatedMessage = {
      ...message,
      status: 'unread' as const,
      updated_at: new Date().toISOString()
    }
    setMessages(messages.map(m => m.id === message.id ? updatedMessage : m))
    setShowActionMenu(null)
  }

  const handleMarkAsReplied = (message: Message) => {
    const updatedMessage = {
      ...message,
      status: 'replied' as const,
      replied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setMessages(messages.map(m => m.id === message.id ? updatedMessage : m))
    setShowActionMenu(null)
  }

  const handleArchive = (message: Message) => {
    const updatedMessage = {
      ...message,
      status: 'archived' as const,
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setMessages(messages.map(m => m.id === message.id ? updatedMessage : m))
    setShowActionMenu(null)
  }

  const handleDeleteMessage = (message: Message) => {
    setMessageToDelete(message)
    setShowDeleteModal(true)
    setShowActionMenu(null)
  }

  const confirmDelete = () => {
    if (messageToDelete) {
      setMessages(messages.filter(m => m.id !== messageToDelete.id))
      setShowDeleteModal(false)
      setMessageToDelete(null)
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null)
      }
    }
  }

  const handleReply = (message: Message) => {
    setSelectedMessage(message)
    setReplyContent('')
    setShowReplyModal(true)
    setShowActionMenu(null)
  }

  const sendReply = () => {
    if (selectedMessage && replyContent.trim()) {
      const updatedMessage = {
        ...selectedMessage,
        status: 'replied' as const,
        replied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: selectedMessage.notes ? `${selectedMessage.notes}\n\nReply sent: ${replyContent}` : `Reply sent: ${replyContent}`
      }
      setMessages(messages.map(m => m.id === selectedMessage.id ? updatedMessage : m))
      setShowReplyModal(false)
      setSelectedMessage(null)
      setReplyContent('')
    }
  }

  const handleAddNotes = (message: Message) => {
    setSelectedMessage(message)
    setNotesContent(message.notes || '')
    setShowNotesModal(true)
    setShowActionMenu(null)
  }

  const saveNotes = () => {
    if (selectedMessage) {
      const updatedMessage = {
        ...selectedMessage,
        notes: notesContent,
        updated_at: new Date().toISOString()
      }
      setMessages(messages.map(m => m.id === selectedMessage.id ? updatedMessage : m))
      setShowNotesModal(false)
      setSelectedMessage(null)
      setNotesContent('')
    }
  }

  // Filter messages based on search and filters
  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === '' || 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-100 text-blue-800'
      case 'read':
        return 'bg-gray-100 text-gray-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>
      case 'high':
        return <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
      case 'medium':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      case 'low':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
      default:
        return null
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage inquiries and messages from customers and partners
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'unread').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <Reply className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Replied</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-lg p-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {/* Messages List */}
          <div className="lg:col-span-1 border-r border-gray-200 max-h-96 lg:max-h-none overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No messages found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? 'bg-green-50 border-l-4 border-green-500' : ''
                    } ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getPriorityIcon(message.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium text-gray-900 truncate ${
                            message.status === 'unread' ? 'font-bold' : ''
                          }`}>
                            {message.name}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(message.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedMessage.subject}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedMessage.priority)}`}>
                        {selectedMessage.priority}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(selectedMessage.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleReply(selectedMessage)}
                      className="p-2 text-green-600 hover:text-green-900"
                      title="Reply"
                    >
                      <Reply className="h-5 w-5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === selectedMessage.id ? null : selectedMessage.id)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                        title="More options"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {/* Action Menu Dropdown */}
                      {showActionMenu === selectedMessage.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {selectedMessage.status === 'unread' ? (
                              <button
                                onClick={() => handleMarkAsRead(selectedMessage)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as Read
                              </button>
                            ) : (
                              <button
                                onClick={() => handleMarkAsUnread(selectedMessage)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                Mark as Unread
                              </button>
                            )}
                            <button
                              onClick={() => handleMarkAsReplied(selectedMessage)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Mark as Replied
                            </button>
                            <button
                              onClick={() => handleArchive(selectedMessage)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Archive
                            </button>
                            <button
                              onClick={() => handleAddNotes(selectedMessage)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Add Notes
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(selectedMessage)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete Message
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedMessage.email}</span>
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{selectedMessage.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Message</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Notes Section */}
                {selectedMessage.notes && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.notes}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Message received</p>
                        <p className="text-xs text-gray-500">{formatDate(selectedMessage.created_at)}</p>
                      </div>
                    </div>
                    {selectedMessage.updated_at !== selectedMessage.created_at && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Status updated</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedMessage.updated_at)}</p>
                        </div>
                      </div>
                    )}
                    {selectedMessage.replied_at && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Reply sent</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedMessage.replied_at)}</p>
                        </div>
                      </div>
                    )}
                    {selectedMessage.archived_at && (
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">Message archived</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedMessage.archived_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
                <div>
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Select a message</p>
                  <p className="text-sm">Choose a message from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reply to {selectedMessage.name}</h3>
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setReplyContent('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>To:</strong> {selectedMessage.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Subject:</strong> Re: {selectedMessage.subject}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reply Message
              </label>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type your reply here..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowReplyModal(false)
                  setReplyContent('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Reply className="w-4 h-4 mr-2 inline" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Notes</h3>
              <button
                onClick={() => {
                  setShowNotesModal(false)
                  setNotesContent('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes for {selectedMessage.name}
              </label>
              <textarea
                value={notesContent}
                onChange={(e) => setNotesContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Add any notes or follow-up actions here..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowNotesModal(false)
                  setNotesContent('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveNotes}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && messageToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                Delete Message
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the message from <span className="font-semibold">{messageToDelete.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-center space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setMessageToDelete(null)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
