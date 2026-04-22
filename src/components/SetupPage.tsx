import {
  Box,
  Field,
  Input,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FiEye, FiEyeOff, FiZap, FiKey, FiCpu } from 'react-icons/fi'
import { Toaster } from '../ui/toaster'
import { toaster } from '../ui/toaster-instance'

const BACKEND_URL = 'https://Codemaster67-GoolgeLangchainAgent.hf.space'

const GOOGLE_MODELS = [
  // ── Gemini 2.5 (Current / Stable) ──────────────────────────
  { value: 'gemini-2.5-pro',        label: 'Gemini 2.5 Pro',        badge: 'Advanced 🧠' },
  { value: 'gemini-2.5-flash',      label: 'Gemini 2.5 Flash',      badge: 'Recommended ⚡' },
  { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite', badge: 'Fastest 🪶' },
  // ── Gemini 2.0 (Deprecated) ────────────────────────────────
  { value: 'gemini-2.0-flash',      label: 'Gemini 2.0 Flash',      badge: 'Deprecated ⚠️' },
  { value: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', badge: 'Deprecated ⚠️' },
  // ── Gemini 1.5 (Deprecated) ────────────────────────────────
  { value: 'gemini-1.5-pro',        label: 'Gemini 1.5 Pro',        badge: 'Deprecated ⚠️' },
  { value: 'gemini-1.5-flash',      label: 'Gemini 1.5 Flash',      badge: 'Deprecated ⚠️' },
  { value: 'gemini-1.5-flash-8b',   label: 'Gemini 1.5 Flash 8B',   badge: 'Deprecated ⚠️' },
]

interface SetupPageProps {
  onInitialized: () => void
}

export default function SetupPage({ onInitialized }: SetupPageProps) {
  const [apiKey, setApiKey] = useState('')
  const [modelName, setModelName] = useState('gemini-2.5-flash')
  const [showKey, setShowKey] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!apiKey.trim()) {
      toaster.create({ title: 'API Key Required', description: 'Please enter your Google API key.', type: 'warning' })
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('api_key', apiKey.trim())
      formData.append('model_name', modelName)
      const res = await fetch(`${BACKEND_URL}/initialize`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Initialization failed')
      toaster.create({ title: 'Agent Initialized!', description: data.message || `Agent ready with ${modelName}`, type: 'success' })
      onInitialized()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      toaster.create({ title: 'Initialization Failed', description: message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      bg="#0A0F1E"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <Toaster />
      {/* Background orbs */}
      <Box
        position="absolute" top="-10%" left="-10%" w="500px" h="500px" borderRadius="full"
        background="radial-gradient(circle, rgba(66,133,244,0.18) 0%, transparent 70%)"
        style={{ animation: 'floatOrb 6s ease-in-out infinite' }}
        pointerEvents="none"
      />
      <Box
        position="absolute" bottom="-10%" right="-5%" w="400px" h="400px" borderRadius="full"
        background="radial-gradient(circle, rgba(124,77,255,0.18) 0%, transparent 70%)"
        style={{ animation: 'floatOrb 8s ease-in-out infinite reverse' }}
        pointerEvents="none"
      />
      <Box
        position="absolute" top="40%" right="10%" w="300px" h="300px" borderRadius="full"
        background="radial-gradient(circle, rgba(0,201,177,0.12) 0%, transparent 70%)"
        style={{ animation: 'floatOrb 7s ease-in-out infinite' }}
        pointerEvents="none"
      />
      {/* Grid */}
      <Box
        position="absolute" inset={0}
        backgroundImage="linear-gradient(rgba(66,133,244,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(66,133,244,0.04) 1px, transparent 1px)"
        backgroundSize="40px 40px"
        pointerEvents="none"
      />

      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(66,133,244,0.2), 0 0 80px rgba(66,133,244,0.05); }
          50% { box-shadow: 0 0 50px rgba(66,133,244,0.4), 0 0 100px rgba(66,133,244,0.1); }
        }
        .setup-card {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        .launch-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 30px rgba(66,133,244,0.45) !important;
        }
        .launch-btn:active { transform: translateY(0) !important; }
        .api-input:focus { outline: none; }
      `}</style>

      {/* Card */}
      <form
        className="setup-card"
        onSubmit={handleSubmit}
        style={{
          width: 'min(95%, 480px)',
          background: 'rgba(15, 23, 42, 0.88)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(66,133,244,0.25)',
          borderRadius: '24px',
          padding: 'clamp(32px, 5vw, 40px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand */}
        <VStack gap={6} mb={8}>
          <Box
            w="72px" h="72px" borderRadius="16px"
            background="linear-gradient(135deg, #4285F4 0%, #7C4DFF 100%)"
            display="flex" alignItems="center" justifyContent="center"
            style={{ boxShadow: '0 8px 32px rgba(66,133,244,0.45)' }}
          >
            <Icon color="white" fontSize="28px"><FiZap /></Icon>
          </Box>
          <VStack gap={1}>
            <Heading
              fontSize="26px" fontWeight="800" letterSpacing="-0.5px"
              style={{ background: 'linear-gradient(135deg, #4285F4, #7C4DFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Research Agent
            </Heading>
            <Text color="rgba(255,255,255,0.5)" fontSize="13px" textAlign="center">
              Powered by Google Gemini + LangChain
            </Text>
          </VStack>
        </VStack>

        <VStack gap={5}>
          {/* API Key */}
          <Field.Root w="full">
            <Field.Label>
              <HStack gap={2} mb={1}>
                <Icon color="#4285F4" fontSize="14px"><FiKey /></Icon>
                <Text fontSize="13px" fontWeight="600" color="rgba(255,255,255,0.9)">Google API Key</Text>
              </HStack>
            </Field.Label>
            <Box position="relative" w="full">
              <Input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(255,255,255,0.1)"
                borderRadius="12px"
                color="white"
                fontSize="13px"
                h="44px"
                pr="44px"
                style={{
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
                _hover={{ border: '1px solid rgba(66,133,244,0.4)' }}
                _focus={{ border: '1px solid #4285F4', boxShadow: '0 0 0 3px rgba(66,133,244,0.12)' }}
              />
              <Box
                position="absolute" right="10px" top="50%" transform="translateY(-50%)"
                cursor="pointer" color="rgba(255,255,255,0.4)"
                onClick={() => setShowKey(!showKey)}
                _hover={{ color: 'white' }}
                zIndex={1}
              >
                {showKey ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </Box>
            </Box>
            <Field.HelperText color="rgba(255,255,255,0.35)" fontSize="11px" mt={1}>
              Get your key from{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#4285F4', textDecoration: 'none' }}
                onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#63b3ed')}
                onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#4285F4')}
              >
                Google AI Studio
              </a>
            </Field.HelperText>
          </Field.Root>

          {/* Model Select */}
          <Field.Root w="full">
            <Field.Label>
              <HStack gap={2} mb={1}>
                <Icon color="#7C4DFF" fontSize="14px"><FiCpu /></Icon>
                <Text fontSize="13px" fontWeight="600" color="rgba(255,255,255,0.9)">Select Model</Text>
              </HStack>
            </Field.Label>
            <select
              id="model-select"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '13px',
                height: '44px',
                padding: '0 16px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border 0.2s, box-shadow 0.2s',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff80' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 14px center',
              }}
            >
              {GOOGLE_MODELS.map((m) => (
                <option key={m.value} value={m.value} style={{ background: '#1a2035', color: 'white' }}>
                  {m.label} — {m.badge}
                </option>
              ))}
            </select>
          </Field.Root>

          {/* Submit */}
          <button
            type="submit"
            className="launch-btn"
            disabled={loading}
            style={{
              width: '100%',
              height: '48px',
              marginTop: '8px',
              borderRadius: '14px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, #4285F4 0%, #7C4DFF 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(66,133,244,0.3)',
            }}
          >
            {loading ? (
              <HStack gap={2}>
                <Spinner size="sm" color="white" />
                <Text color="white" fontSize="14px" fontWeight="700">Initializing Agent...</Text>
              </HStack>
            ) : (
              '🚀 Launch Agent'
            )}
          </button>
        </VStack>

        <Text color="rgba(255,255,255,0.25)" fontSize="11px" textAlign="center" mt={5}>
          Your API key is never stored — only used to initialize the agent session.
        </Text>
      </form>
    </Box>
  )
}
