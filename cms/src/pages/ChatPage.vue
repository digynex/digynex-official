<template>
  <q-page class="chat-page flex flex-stretch no-scroll">
    <!-- Contacts Sidebar -->
    <div class="contacts-sidebar bg-dark-card border-glass-right flex column">
      <div class="q-pa-lg">
        <div class="text-h6 text-white text-weight-bold q-mb-md">Conversations</div>
        <q-input
          v-model="search"
          placeholder="Search leads..."
          dark
          outlined
          dense
          rounded
          class="bg-black-opacity"
        >
          <template v-slot:prepend>
            <q-icon name="search" size="xs" />
          </template>
        </q-input>
      </div>

      <q-scroll-area class="col">
        <div v-if="loadingContacts" class="flex flex-center q-pa-lg">
          <q-spinner-dots color="blue" size="40px" />
        </div>
        <q-list v-else dark>
          <q-item
            v-for="contact in filteredContacts"
            :key="contact.id"
            clickable
            v-ripple
            :active="activeContact?.id === contact.id"
            active-class="active-contact"
            @click="activeContact = contact"
            class="q-mx-sm rounded-borders q-mb-xs"
          >
            <q-item-section avatar>
              <q-avatar size="45px">
                <img :src="contact.avatar" />
                <q-badge
                  floating
                  rounded
                  :color="contact.online ? 'emerald' : 'grey'"
                  style="width: 12px; height: 12px"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold text-white">{{ contact.name }}</q-item-label>
              <q-item-label caption lines="1" class="text-grey-5">{{
                contact.lastMsg
              }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption text-grey-6">{{ contact.time }}</div>
              <q-badge v-if="contact.unread" color="blue" rounded label="1" class="q-mt-xs" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <!-- MAIN CHAT AREA -->
    <div class="chat-main col flex column bg-slate-50 relative-position">
      <div v-if="activeContact" class="full-height flex column">
        <!-- Chat Header -->
        <q-toolbar class="bg-dark-card border-glass-bottom text-white q-py-sm">
          <q-avatar size="40px" class="q-mr-md">
            <img :src="activeContact.avatar" />
          </q-avatar>
          <div>
            <div class="text-weight-bold">{{ activeContact.name }}</div>
            <div class="text-caption text-emerald">
              {{ activeContact.online ? 'Active Now' : 'Last seen 2h ago' }}
            </div>
          </div>
          <q-space />
          <q-btn flat round icon="videocam" color="grey-5" />
          <q-btn flat round icon="call" color="grey-5" />
          <q-btn flat round icon="more_vert" color="grey-5" />
        </q-toolbar>

        <!-- Messages Area -->
        <q-scroll-area ref="chatScroll" class="col q-pa-md bg-chat-pattern">
          <div v-if="loadingMessages" class="flex flex-center full-height">
            <q-spinner-dots color="primary" size="40px" />
          </div>
          <div v-else class="column q-gutter-y-md">
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="row"
              :class="msg.sent ? 'justify-end' : 'justify-start'"
            >
              <div
                class="message-bubble q-pa-md shadow-2"
                :class="
                  msg.sent
                    ? 'sent bg-emerald-gradient text-dark font-bold'
                    : 'received bg-dark-card border-glass text-white'
                "
              >
                <div v-html="msg.text"></div>
                <div class="text-right text-mini opacity-70 q-mt-xs">{{ msg.time }}</div>
              </div>
            </div>

            <!-- AI Typing Indicator -->
            <div v-if="generatingAi" class="row justify-start q-mb-md">
              <div
                class="message-bubble received q-pa-md bg-dark-card border-glass text-white shadow-1"
              >
                <div class="row items-center">
                  <q-spinner-dots size="20px" color="emerald" class="q-mr-sm" />
                  <span class="text-caption text-emerald">Nexus AI is strategizing...</span>
                </div>
              </div>
            </div>
          </div>
        </q-scroll-area>

        <!-- AI Suggestion Banner -->
        <div v-if="aiSuggestion && !newMessage" class="q-px-lg q-pt-sm">
          <div
            class="ai-suggestion-card bg-purple-1 border-purple-light q-pa-sm rounded-borders-10 flex items-center justify-between"
          >
            <div class="row items-center no-wrap overflow-hidden">
              <q-icon name="auto_awesome" color="purple-7" size="18px" class="q-mr-sm" />
              <div class="text-caption text-purple-9 text-italic ellipsis">
                AI Suggestion: "{{ aiSuggestion }}"
              </div>
            </div>
            <q-btn
              flat
              dense
              rounded
              color="purple-9"
              label="Use This"
              no-caps
              size="sm"
              @click="newMessage = aiSuggestion"
            />
          </div>
        </div>

        <!-- Input Area -->
        <div class="q-pa-md bg-dark-card border-top-light">
          <div class="row q-gutter-x-sm items-center no-wrap">
            <q-btn flat round icon="add_circle_outline" color="grey-7" />
            <q-input
              v-model="newMessage"
              placeholder="Type your strategic response..."
              outlined
              dense
              rounded
              class="col"
              @keyup.enter="sendMessage"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  dense
                  icon="auto_awesome"
                  :color="generatingAi ? 'emerald' : 'grey-5'"
                  @click="generateAiReply"
                  :loading="generatingAi"
                >
                  <q-tooltip>Generate Strategic Reply (Gemini AI)</q-tooltip>
                </q-btn>
              </template>
            </q-input>
            <q-btn
              unelevated
              round
              color="emerald"
              icon="send"
              class="bg-emerald-gradient text-dark"
              @click="sendMessage"
            />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="full-height flex flex-center column text-grey-5">
        <q-icon name="forum" size="100px" class="opacity-10" />
        <div class="text-h6 q-mt-md">Select a conversation to begin orchestration</div>
      </div>
    </div>

    <!-- INFO SIDEBAR (Right) -->
    <div v-if="activeContact" class="info-sidebar bg-white border-light-left gt-md flex column">
      <div class="q-pa-lg text-center">
        <q-avatar size="120px" class="q-mb-md shadow-10">
          <img :src="activeContact.avatar" />
        </q-avatar>
        <div class="text-h6 text-weight-bold text-dark">{{ activeContact.name }}</div>
        <q-chip color="blue-1" text-color="blue-9" class="q-mt-sm">Strategic Lead</q-chip>
      </div>

      <q-separator inset class="q-my-md" />

      <q-list class="q-px-md">
        <q-item-label header class="text-weight-bold text-uppercase" style="font-size: 11px"
          >Contact Details</q-item-label
        >
        <q-item>
          <q-item-section avatar><q-icon name="email" color="grey-7" /></q-item-section>
          <q-item-section>{{ activeContact.email || 'sarah@starlight.com' }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar><q-icon name="phone" color="grey-7" /></q-item-section>
          <q-item-section>+46 70 123 45 67</q-item-section>
        </q-item>

        <q-item-label header class="text-weight-bold text-uppercase q-mt-md" style="font-size: 11px"
          >Nexus Intelligence Control</q-item-label
        >

        <div class="q-px-sm">
          <q-card
            flat
            class="bg-blue-gradient text-white rounded-borders shadow-1 q-mb-sm overflow-hidden"
            style="border: 1px solid rgba(255, 255, 255, 0.1)"
          >
            <q-item dense class="q-py-sm">
              <q-item-section avatar side class="q-pr-sm">
                <q-icon name="auto_mode" color="white" size="18px" />
              </q-item-section>
              <q-item-section>
                <div class="text-caption text-weight-bold" style="font-size: 11px">Auto-Pilot</div>
                <div class="text-mini text-white opacity-80" style="font-size: 9px">
                  Auto-reply enabled
                </div>
              </q-item-section>
              <q-item-section side>
                <q-toggle v-model="autoPilot" color="white" dense keep-color />
              </q-item-section>
            </q-item>
          </q-card>
        </div>

        <q-btn
          outline
          color="deep-orange"
          label="Simulate Lead Message"
          class="full-width q-mt-md"
          icon="sensors"
          no-caps
          @click="simulateLeadMessage"
        >
          <q-tooltip>Simulate a message from this lead for testing</q-tooltip>
        </q-btn>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const search = ref('')
const newMessage = ref('')
const activeContact = ref(null)
const loadingContacts = ref(false)
const loadingMessages = ref(false)
const contacts = ref([])
const messages = ref([])
const generatingAi = ref(false)
const aiSuggestion = ref('')
const autoPilot = ref(false)
const chatScroll = ref(null)
const nexusAiContact = {
  id: 'nexus_ai',
  name: 'Nexus AI (Orchestrator)',
  avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
  email: 'ai@digynex.io',
  online: true,
  lastMsg: 'AI Core online & ready.',
  time: 'Active',
}
let messageSubscription = null

const scrollToBottom = () => {
  if (chatScroll.value) {
    chatScroll.value.setScrollPercentage('vertical', 1.0, 300)
  }
}

watch(
  messages,
  () => {
    nextTick(scrollToBottom)
  },
  { deep: true },
)

const filteredContacts = computed(() => {
  const allContacts = [nexusAiContact, ...contacts.value]
  if (!search.value) return allContacts
  const s = search.value.toLowerCase()
  return allContacts.filter(
    (c) => c.name.toLowerCase().includes(s) || (c.email && c.email.toLowerCase().includes(s)),
  )
})

const simulateLeadMessage = async () => {
  if (!activeContact.value) {
    $q.notify({ type: 'warning', message: 'Please select a contact first' })
    return
  }

  const testMsgs = [
    "I'm interested in the pricing.",
    'Do you have a support team?',
    'Can we jump on a call?',
    'How does the automation work?',
  ]
  const randomMsg = testMsgs[Math.floor(Math.random() * testMsgs.length)]

  // Special handling for Nexus AI (Mock)
  if (activeContact.value.id === 'nexus_ai') {
    messages.value.push({
      id: Date.now(),
      sent: false,
      text: randomMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    $q.notify({ type: 'info', message: 'Nexus Core signal simulated!', position: 'top' })
    return
  }

  const { error } = await supabase.from('messages').insert({
    lead_id: activeContact.value.id,
    content: randomMsg,
    is_from_lead: true,
  })

  if (error) {
    console.error('Simulation error:', error)
    $q.notify({ type: 'negative', message: 'Simulation failed: ' + error.message })
  } else {
    // Immediate Local Update for Simulator
    messages.value.push({
      id: Date.now(),
      sent: false,
      text: randomMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    $q.notify({ type: 'info', message: 'Customer message simulated!', position: 'top' })
  }
}

const generateAiReply = async (isAuto = false, customHistory = null) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return

  const targetMessages = customHistory || messages.value
  if (!activeContact.value || targetMessages.length === 0) return

  generatingAi.value = true
  try {
    const historyText = targetMessages
      .slice(-5)
      .map((m) => `${m.sent ? 'Nexus Assistant' : activeContact.value.name}: ${m.text}`)
      .join('\n')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a professional CMS assistant for DigyNex. Draft a helpful, concise response to the following chat history. Be natural, not overly robotic.\n\nHistory:\n${historyText}\n\nResponse:`,
                },
              ],
            },
          ],
        }),
      },
    )

    const data = await response.json()
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const draft = data.candidates[0].content.parts[0].text.trim()

      if (isAuto) {
        const { data: userData } = await supabase.auth.getUser()
        await supabase.from('messages').insert({
          lead_id: activeContact.value.id,
          sender_id: userData.user.id,
          content: draft,
          is_from_lead: false,
        })
        // Realtime will handle UI update
      } else {
        newMessage.value = draft
      }
    }
  } catch (error) {
    console.error('AI Suggestion Error:', error)
  }
  generatingAi.value = false
}

const triggerAiSuggestion = async (content) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) return

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give a very short (max 10 words) fast suggestion to reply to this message: "${content}"`,
                },
              ],
            },
          ],
        }),
      },
    )
    const data = await response.json()
    aiSuggestion.value = data.candidates[0].content.parts[0].text.trim()
  } catch {
    // Fail silently for background suggestions
  }
}

const fetchContacts = async () => {
  loadingContacts.value = true
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching contacts:', error)
  } else {
    contacts.value = data.map((lead) => ({
      ...lead,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=random&color=fff`,
      lastMsg: 'Ongoing orchestration...',
      time: 'Just now',
      online: Math.random() > 0.5,
      unread: false,
    }))
  }
  loadingContacts.value = false
}

const handleNexusAiResponse = (content) => {
  generatingAi.value = true
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for strategy
  
  // Connect to the same powerful n8n AI Engine used in the public widgets
  fetch("https://n8n.digynex.se/webhook/f639f695-c06f-4bfa-8fcb-e971392f7966", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      message: content,
      sessionId: 'nexus-orchestrator-cms-' + ($q.localStorage.getItem('user_id') || 'unknown'),
      source: "cms-nexus-core",
      language: "en"
    })
  })
  .then(res => {
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return res.text();
  })
  .then(txt => {
    clearTimeout(timeoutId);
    let reply = "";
    try {
      const data = JSON.parse(txt);
      reply = data.output || data.message || txt;
    } catch {
      reply = txt || "Strategic core response received.";
    }
    
    messages.value.push({
      id: Date.now(),
      sent: false,
      text: reply,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  })
  .catch(err => {
    clearTimeout(timeoutId);
    console.error('Nexus AI Error:', err);
    messages.value.push({
      id: Date.now(),
      sent: false,
      text: "Nexus sync error. Please contact us via WhatsApp: <a href='https://wa.me/46790522874' target='_blank' style='color: #10b981; text-decoration: underline;'>wa.me/46790522874</a>",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  })
  .finally(() => {
    generatingAi.value = false
  })
}

const fetchMessages = async (leadId) => {
  if (!leadId) return
  loadingMessages.value = true
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
  } else {
    messages.value = data.map((m) => ({
      id: m.id,
      sent: !m.is_from_lead,
      text: m.content,
      time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }))
  }
  loadingMessages.value = false
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeContact.value) return

  const msgContent = newMessage.value
  newMessage.value = '' // Clear immediately for UX

  // Push locally for immediate feedback
  const clientSideMsg = {
    id: Date.now(),
    sent: true,
    text: msgContent,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
  messages.value.push(clientSideMsg)

  if (activeContact.value.id === 'nexus_ai') {
    handleNexusAiResponse(msgContent)
    return
  }

  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user.id

  const { error } = await supabase.from('messages').insert({
    lead_id: activeContact.value.id,
    sender_id: userId,
    content: msgContent,
    is_from_lead: false,
  })

  if (error) {
    $q.notify({ type: 'negative', message: 'Failed to sync message to cloud' })
  }
}

const subscribeToMessages = (leadId) => {
  if (messageSubscription) {
    supabase.removeChannel(messageSubscription)
  }

  console.log('Attaching realtime subscription for lead:', leadId)

  messageSubscription = supabase
    .channel(`messages:${leadId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `lead_id=eq.${leadId}`,
      },
      (payload) => {
        console.log('Realtime message received:', payload.new)
        const incomingMsg = {
          id: payload.new.id,
          sent: !payload.new.is_from_lead,
          text: payload.new.content,
          time: new Date(payload.new.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }

        // Prevent duplicate messages in UI
        if (!messages.value.find((m) => String(m.id) === String(incomingMsg.id))) {
          messages.value.push(incomingMsg)

          if (payload.new.is_from_lead) {
            triggerAiSuggestion(payload.new.content)

            if (autoPilot.value) {
              setTimeout(() => {
                generateAiReply(true)
              }, 1500)
            }
          }
        }
      },
    )
    .subscribe((status) => {
      console.log(`Subscription status for lead ${leadId}:`, status)
    })
}

watch(activeContact, (newContact) => {
  if (newContact) {
    if (newContact.id === 'nexus_ai') {
      messages.value = [
        {
          id: 1,
          sent: false,
          text: 'Nexus Core Online. How can I assist with your orchestration today?',
          time: 'System',
        },
      ]
      return
    }
    fetchMessages(newContact.id)
    subscribeToMessages(newContact.id)
  } else {
    if (messageSubscription) {
      supabase.removeChannel(messageSubscription)
      messageSubscription = null
    }
  }
})

onMounted(() => {
  fetchContacts()

  // If we came from Nexus Hub support, auto-select AI
  const params = new URLSearchParams(window.location.search)
  if (params.get('context') === 'support') {
    activeContact.value = nexusAiContact
  }
})

onUnmounted(() => {
  if (messageSubscription) {
    supabase.removeChannel(messageSubscription)
  }
})
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 60px);
}
.contacts-sidebar {
  width: 320px;
  background: #0f172a;
}
.chat-main {
  background: #f8fafc;
}
.info-sidebar {
  width: 300px;
  background: #080c14;
  color: white;
}
.border-glass-right {
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}
.border-glass-bottom {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.border-light-left {
  border-left: 1px solid rgba(255, 255, 255, 0.05);
}
.bg-black-opacity {
  background: rgba(0, 0, 0, 0.4);
}
.active-contact {
  background: rgba(16, 185, 129, 0.08) !important;
  border-left: 3px solid #10b981;
}
.bg-chat-pattern {
  background-color: #060910;
  background-image: url('https://www.transparenttextures.com/patterns/cubes.png');
}
.message-bubble {
  max-width: 70%;
  border-radius: 18px;
  font-size: 14px;
}
.sent {
  border-bottom-right-radius: 4px;
}
.received {
  border-bottom-left-radius: 4px;
}
.bg-emerald-gradient {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}
.text-mini {
  font-size: 10px;
}
.text-emerald {
  color: #10b981;
}
.bg-blue-50 {
  background: #eff6ff;
}
.border-top-light {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.ai-suggestion-card {
  border-radius: 12px;
  border: 1px dashed rgba(168, 85, 247, 0.3);
  background: #faf5ff;
}
.rounded-borders-10 {
  border-radius: 10px;
}
</style>
