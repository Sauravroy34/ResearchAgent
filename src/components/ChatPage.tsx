import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Spinner,
  Image,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { FiSend, FiPaperclip, FiFile, FiImage, FiX, FiMessageSquare, FiZap, FiTrash2, FiLogOut } from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Toaster, toaster } from '../ui/toaster'

const BACKEND_URL = 'https://Codemaster67-GoolgeLangchainAgent.hf.space'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  filePreview?: { name: string; type: string; url?: string }
}

interface HistoryItem {
  id: string
  title: string
  timestamp: Date
  messageCount: number
}

interface ChatPageProps {
  onLogout: () => void
}

function TypingIndicator() {
  return (
    <HStack gap={1} py={1}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          w="7px" h="7px" borderRadius="full" bg="#4285F4"
          style={{
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </HStack>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <Flex
      justify={isUser ? 'flex-end' : 'flex-start'}
      w="full"
      style={{ animation: 'fadeInUp 0.3s ease-out' }}
    >
      {!isUser && (
        <Box
          w="32px" h="32px" borderRadius="10px" flexShrink={0}
          background="linear-gradient(135deg, #4285F4, #7C4DFF)"
          display="flex" alignItems="center" justifyContent="center"
          mr="12px" mt="4px"
        >
          <Icon color="white" fontSize="14px"><FiZap /></Icon>
        </Box>
      )}
      <Box maxW={{ base: '85%', md: '70%' }}>
        {msg.filePreview && (
          <Box mb={2} borderRadius="12px" overflow="hidden" border="1px solid rgba(255,255,255,0.1)">
            {msg.filePreview.type.startsWith('image/') && msg.filePreview.url ? (
              <Image src={msg.filePreview.url} maxH="200px" objectFit="cover" alt="uploaded" />
            ) : (
              <HStack p={3} bg="rgba(255,255,255,0.05)" gap={2}>
                <Icon color="#4285F4" fontSize="14px"><FiFile /></Icon>
                <Text fontSize="11px" color="rgba(255,255,255,0.7)" truncate>{msg.filePreview.name}</Text>
              </HStack>
            )}
          </Box>
        )}
        <Box
          bg={isUser ? 'linear-gradient(135deg, #4285F4 0%, #7C4DFF 100%)' : 'rgba(255,255,255,0.06)'}
          color="white"
          px="16px" py="12px"
          borderRadius={isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'}
          border={isUser ? 'none' : '1px solid rgba(255,255,255,0.08)'}
          fontSize="14px"
          lineHeight="1.6"
          className={!isUser ? 'md-body' : undefined}
        >
          {isUser ? (
            <span style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{msg.content}</span>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          )}
        </Box>
        <Text
          fontSize="10px" color="rgba(255,255,255,0.3)" mt="4px" px={1}
          textAlign={isUser ? 'right' : 'left'}
        >
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </Box>
      {isUser && (
        <Box
          w="32px" h="32px" borderRadius="10px" flexShrink={0}
          background="linear-gradient(135deg, #00C9B1, #4285F4)"
          display="flex" alignItems="center" justifyContent="center"
          ml="12px" mt="4px"
        >
          <Text color="white" fontSize="12px" fontWeight="700">U</Text>
        </Box>
      )}
    </Flex>
  )
}

export default function ChatPage({ onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi, how can I help you?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [sessionId] = useState(() => Date.now().toString())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setFilePreviewUrl(f.type.startsWith('image/') ? URL.createObjectURL(f) : null)
  }

  const clearFile = () => {
    setFile(null)
    setFilePreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const sendMessage = async () => {
    if (!input.trim() && !file) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      filePreview: file ? { name: file.name, type: file.type, url: filePreviewUrl || undefined } : undefined,
    }

    setMessages((prev) => [...prev, userMsg])
    const currentInput = input
    const currentFile = file
    setInput('')
    clearFile()
    setIsLoading(true)

    // Update history
    setHistory((prev) => {
      const existing = prev.find((h) => h.id === sessionId)
      if (existing) {
        return prev.map((h) => h.id === sessionId ? { ...h, messageCount: h.messageCount + 1 } : h)
      }
      return [{ id: sessionId, title: currentInput.slice(0, 35) || 'File Analysis', timestamp: new Date(), messageCount: 1 }, ...prev]
    })

    try {
      const formData = new FormData()
      formData.append('message', currentInput.trim() || 'Please analyze this file.')
      if (currentFile) formData.append('file', currentFile)

      const res = await fetch(`${BACKEND_URL}/chat`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Chat request failed')

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'No response received.',
        timestamp: new Date(),
      }])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toaster.create({ title: 'Error', description: message, type: 'error' })
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ **Error:** ${message}`,
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <Flex h="100vh" bg="#0A0F1E" overflow="hidden">
      <Toaster />
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes typingBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        .send-btn:hover { transform: scale(1.08) !important; }
        .send-btn:active { transform: scale(0.95) !important; }
        .logout-btn:hover { color: #fc8181 !important; }

        /* Markdown body styles for assistant messages */
        .md-body { color: rgba(255,255,255,0.92); }
        .md-body p { margin: 0 0 10px 0; }
        .md-body p:last-child { margin-bottom: 0; }
        .md-body h1, .md-body h2, .md-body h3, .md-body h4 { font-weight: 700; margin: 14px 0 8px 0; color: white; }
        .md-body h1 { font-size: 1.2em; }
        .md-body h2 { font-size: 1.1em; }
        .md-body h3 { font-size: 1.0em; }
        .md-body strong { color: white; font-weight: 700; }
        .md-body em { font-style: italic; color: rgba(255,255,255,0.85); }
        .md-body a { color: #63b3ed; text-decoration: underline; }
        .md-body code { background: rgba(255,255,255,0.12); padding: 2px 7px; border-radius: 5px; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.84em; color: #90cdf4; }
        .md-body pre { background: rgba(0,0,0,0.55); padding: 14px; border-radius: 10px; overflow-x: auto; margin: 10px 0; border: 1px solid rgba(255,255,255,0.06); }
        .md-body pre code { background: none; padding: 0; color: #e2e8f0; font-size: 0.85em; }
        .md-body ul, .md-body ol { padding-left: 22px; margin: 6px 0 10px 0; }
        .md-body li { margin-bottom: 5px; }
        .md-body li::marker { color: #4285F4; }
        .md-body blockquote { border-left: 3px solid rgba(66,133,244,0.6); padding-left: 14px; margin: 10px 0; color: rgba(255,255,255,0.72); font-style: italic; }
        .md-body hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 14px 0; }
        .md-body table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 0.9em; }
        .md-body th, .md-body td { border: 1px solid rgba(255,255,255,0.12); padding: 7px 12px; text-align: left; }
        .md-body th { background: rgba(66,133,244,0.18); font-weight: 600; color: white; }
        .md-body td { color: rgba(255,255,255,0.85); }
        .md-body tr:nth-child(even) td { background: rgba(255,255,255,0.03); }

        /* Transparent chat input */
        .chat-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: white;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          padding: 6px 0;
          min-width: 0;
        }
        .chat-input::placeholder { color: rgba(255,255,255,0.35); }
        .chat-input:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* ===== SIDEBAR ===== */}
      <Box
        w="260px" display={{ base: 'none', md: 'flex' }} flexDir="column"
        bg="rgba(12, 18, 38, 0.95)" borderRight="1px solid rgba(255,255,255,0.06)"
        flexShrink={0}
      >
        {/* Header */}
        <Box p={5} borderBottom="1px solid rgba(255,255,255,0.06)">
          <HStack justify="space-between">
            <HStack gap={2}>
              <Box
                w="28px" h="28px" borderRadius="8px"
                background="linear-gradient(135deg, #4285F4, #7C4DFF)"
                display="flex" alignItems="center" justifyContent="center"
              >
                <Icon color="white" fontSize="12px"><FiZap /></Icon>
              </Box>
              <Text fontWeight="700" fontSize="13px" color="white">Research Agent</Text>
            </HStack>
            <Box
              as="button" className="logout-btn" cursor="pointer" border="none" bg="transparent"
              color="rgba(255,255,255,0.4)" fontSize="11px" fontWeight="500"
              onClick={onLogout} style={{ transition: 'color 0.2s' }} title="Logout"
            >
              <Icon fontSize="15px"><FiLogOut /></Icon>
            </Box>
          </HStack>
        </Box>

        {/* History label */}
        <Box px={4} pt={4} pb={2}>
          <Text fontSize="10px" fontWeight="700" color="rgba(255,255,255,0.3)" letterSpacing="1px" textTransform="uppercase">
            Chat History
          </Text>
        </Box>

        {/* History list */}
        <VStack gap={1} px={3} flex={1} overflowY="auto" align="stretch">
          {history.length === 0 ? (
            <Box px={2} py={6} textAlign="center">
              <Icon color="rgba(255,255,255,0.2)" fontSize="24px" display="block" margin="0 auto 8px"><FiMessageSquare /></Icon>
              <Text color="rgba(255,255,255,0.3)" fontSize="12px">Conversations appear here</Text>
            </Box>
          ) : history.map((item) => (
            <Box
              key={item.id} px={3} py={2.5} borderRadius="10px" cursor="pointer"
              bg={item.id === sessionId ? 'rgba(66,133,244,0.12)' : 'transparent'}
              border={item.id === sessionId ? '1px solid rgba(66,133,244,0.25)' : '1px solid transparent'}
              _hover={{ bg: 'rgba(255,255,255,0.04)' }}
              style={{ transition: 'all 0.15s' }}
            >
              <HStack justify="space-between" align="flex-start">
                <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
                  <Text fontSize="12px" fontWeight="500" color="rgba(255,255,255,0.8)" truncate>{item.title}</Text>
                  <Text fontSize="10px" color="rgba(255,255,255,0.35)">
                    {item.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} · {item.messageCount} msgs
                  </Text>
                </VStack>
                {item.id === sessionId && (
                  <Badge bg="rgba(66,133,244,0.3)" color="#90cdf4" borderRadius="full" px={2} py={0.5} fontSize="9px">Active</Badge>
                )}
              </HStack>
            </Box>
          ))}
        </VStack>

        <Box p={4} borderTop="1px solid rgba(255,255,255,0.06)">
          <Text fontSize="10px" color="rgba(255,255,255,0.2)" textAlign="center">LangChain · Gemini · MCP</Text>
        </Box>
      </Box>

      {/* ===== MAIN CHAT ===== */}
      <Flex flex={1} flexDir="column" overflow="hidden">
        {/* Header */}
        <Box
          px={6} py="14px"
          bg="rgba(12, 18, 38, 0.85)" backdropFilter="blur(10px)"
          borderBottom="1px solid rgba(255,255,255,0.06)" flexShrink={0}
        >
          <HStack justify="space-between">
            <HStack gap={3}>
              <Box
                w="38px" h="38px" borderRadius="12px"
                background="linear-gradient(135deg, #4285F4, #7C4DFF)"
                display="flex" alignItems="center" justifyContent="center"
                style={{ boxShadow: '0 4px 16px rgba(66,133,244,0.35)' }}
              >
                <Icon color="white" fontSize="18px"><FiZap /></Icon>
              </Box>
              <VStack align="flex-start" gap={0}>
                <Text fontWeight="700" fontSize="14px" color="white">Research Agent</Text>
                <HStack gap={1}>
                  <Box w="6px" h="6px" borderRadius="full" bg="#48bb78" style={{ boxShadow: '0 0 6px #48bb78' }} />
                  <Text fontSize="11px" color="rgba(255,255,255,0.5)">Online · Gemini Powered</Text>
                </HStack>
              </VStack>
            </HStack>
            <HStack gap={2}>
              <Box
                as="button" title="Clear chat" cursor="pointer" border="none" bg="transparent"
                color="rgba(255,255,255,0.4)" p="6px" borderRadius="8px"
                style={{ transition: 'all 0.15s' }}
                _hover={{ color: '#fc8181', bg: 'rgba(255,100,100,0.08)' }}
                onClick={() => setMessages([{
                  id: Date.now().toString(), role: 'assistant',
                  content: "Chat cleared! How can I help you?", timestamp: new Date(),
                }])}
              >
                <Icon fontSize="16px"><FiTrash2 /></Icon>
              </Box>
              <Box
                as="button" display={{ base: 'flex', md: 'none' }} title="Logout"
                cursor="pointer" border="none" bg="transparent"
                color="rgba(255,255,255,0.4)" p="6px" borderRadius="8px"
                onClick={onLogout}
              >
                <Icon fontSize="16px"><FiLogOut /></Icon>
              </Box>
            </HStack>
          </HStack>
        </Box>

        {/* Messages */}
        <VStack
          flex={1} overflowY="auto" px={{ base: 4, md: 6 }} py={6} gap={4} align="stretch"
          css={{
            '&::-webkit-scrollbar': { width: '5px' },
            '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: '3px' },
          }}
        >
          {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
          {isLoading && (
            <Flex style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <Box
                w="32px" h="32px" borderRadius="10px" flexShrink={0}
                background="linear-gradient(135deg, #4285F4, #7C4DFF)"
                display="flex" alignItems="center" justifyContent="center"
                mr="12px" mt="4px"
              >
                <Icon color="white" fontSize="14px"><FiZap /></Icon>
              </Box>
              <Box
                bg="rgba(255,255,255,0.06)" border="1px solid rgba(255,255,255,0.08)"
                px="16px" py="12px" borderRadius="18px 18px 18px 4px"
              >
                <TypingIndicator />
              </Box>
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </VStack>

        {/* File Preview */}
        {file && (
          <Box
            mx={6} mb={2} p={3}
            bg="rgba(66,133,244,0.08)" border="1px solid rgba(66,133,244,0.22)"
            borderRadius="14px" style={{ animation: 'fadeInUp 0.2s' }}
          >
            <HStack justify="space-between">
              <HStack gap={3}>
                {filePreviewUrl ? (
                  <Image src={filePreviewUrl} w="40px" h="40px" borderRadius="8px" objectFit="cover" />
                ) : (
                  <Box
                    w="40px" h="40px" bg="rgba(66,133,244,0.15)" borderRadius="8px"
                    display="flex" alignItems="center" justifyContent="center"
                  >
                    <Icon color="#4285F4" fontSize="18px">
                      {file.type.startsWith('image/') ? <FiImage /> : <FiFile />}
                    </Icon>
                  </Box>
                )}
                <VStack align="flex-start" gap={0}>
                  <Text fontSize="12px" fontWeight="600" color="white" truncate maxW="200px">{file.name}</Text>
                  <Text fontSize="10px" color="rgba(255,255,255,0.4)">
                    {(file.size / 1024).toFixed(1)} KB · {file.type || 'Unknown'}
                  </Text>
                </VStack>
              </HStack>
              <Box
                as="button" cursor="pointer" border="none" bg="transparent"
                color="rgba(255,255,255,0.5)" onClick={clearFile}
                _hover={{ color: '#fc8181' }}
              >
                <Icon fontSize="16px"><FiX /></Icon>
              </Box>
            </HStack>
          </Box>
        )}

        {/* Input Bar */}
        <Box px={6} pb={6} pt={2} bg="rgba(10,15,30,0.98)" flexShrink={0}>
          <HStack
            bg="rgba(255,255,255,0.05)"
            border="1px solid rgba(255,255,255,0.1)"
            borderRadius="18px" px={4} py={2} gap={3}
            style={{ transition: 'border 0.2s, box-shadow 0.2s' }}
            _focusWithin={{ border: '1px solid rgba(66,133,244,0.5)', boxShadow: '0 0 0 3px rgba(66,133,244,0.08)' }}
          >
            {/* File attach */}
            <Box
              as="button" id="file-attach-btn" title="Attach file (image, PDF, text)"
              cursor="pointer" border="none" bg="transparent"
              color={file ? '#4285F4' : 'rgba(255,255,255,0.4)'}
              p="6px" borderRadius="8px"
              _hover={{ color: '#4285F4', bg: 'rgba(66,133,244,0.1)' }}
              style={{ transition: 'all 0.15s', flexShrink: 0 }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon fontSize="18px"><FiPaperclip /></Icon>
            </Box>
            <input
              ref={fileInputRef} type="file"
              accept="image/*,.pdf,.txt,.md,.csv,.json,.docx"
              onChange={handleFileChange} style={{ display: 'none' }}
            />

            <input
              id="chat-input"
              className="chat-input"
              placeholder="Ask anything... or upload a file"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />

            {isLoading ? (
              <Spinner size="sm" color="#4285F4" />
            ) : (
              <Box
                as="button"
                id="send-btn"
                className="send-btn"
                title="Send (Enter)"
                cursor={!input.trim() && !file ? 'not-allowed' : 'pointer'}
                border="none"
                w="34px" h="34px" borderRadius="10px" flexShrink={0}
                background={input.trim() || file ? 'linear-gradient(135deg, #4285F4, #7C4DFF)' : 'rgba(255,255,255,0.08)'}
                color={input.trim() || file ? 'white' : 'rgba(255,255,255,0.3)'}
                display="flex" alignItems="center" justifyContent="center"
                style={{ transition: 'all 0.15s', boxShadow: input.trim() || file ? '0 4px 12px rgba(66,133,244,0.3)' : 'none' }}
                onClick={sendMessage}
                disabled={!input.trim() && !file}
              >
                <Icon fontSize="15px"><FiSend /></Icon>
              </Box>
            )}
          </HStack>
          <Text fontSize="10px" color="rgba(255,255,255,0.25)" textAlign="center" mt={2}>
            Accepts images, PDFs, text, CSV, JSON · Press Enter to send
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}
