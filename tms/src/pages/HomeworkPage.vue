<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="col-12 col-md-auto">
        <h1 class="text-h4 text-weight-bolder text-white q-my-none">Homework Tracker</h1>
        <p class="text-grey-5 q-mt-sm">Track assignment submissions via QR or Manual entry.</p>
      </div>
      <div class="col-12 col-md-auto">
        <q-btn
          color="secondary"
          icon="add"
          label="New Assignment"
          no-caps
          @click="openAddDialog"
          class="shadow-2 hover-scale"
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Active Assignments -->
      <div class="col-12 col-md-8">
        <q-card class="bg-dark-card border-glass border-radius-lg">
          <q-toolbar class="q-px-lg q-py-md">
            <q-toolbar-title class="text-white text-weight-bold">Live Assignments</q-toolbar-title>
          </q-toolbar>
          <q-list separator>
            <q-item v-for="hw in homeworks" :key="hw.id" class="q-py-md">
              <q-item-section avatar>
                <q-avatar color="blue-9" text-color="white" icon="menu_book" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-weight-bold text-subtitle1">{{ hw.title }}</q-item-label>
                <q-item-label caption class="text-grey-5">
                  {{ hw.className }} • Due: {{ hw.dueDate }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row items-center q-gutter-md">
                  <div class="text-right">
                    <div class="text-white text-weight-bold">{{ hw.submitted }}/{{ hw.total }}</div>
                    <div class="text-caption text-grey-5">Submitted</div>
                  </div>
                  <q-btn outline color="secondary" label="Scan Submissions" icon="qr_code_scanner" @click="handleScanAction(hw)" />
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 col-md-4">
        <q-card class="bg-dark-card border-glass border-radius-lg q-pa-lg text-center">
          <q-icon name="auto_awesome" color="gold" size="48px" class="q-mb-md" />
          <div class="text-h6 text-white text-weight-bold">Star of the Month</div>
          <p class="text-grey-5 text-caption q-mt-sm">Based on top assignment scores & attendance.</p>
          
          <q-avatar size="80px" class="q-mt-md bg-gold-gradient border-glass">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="text-subtitle1 text-white text-weight-bold q-mt-md" :class="{ 'blur-text': authStore.isDemo }">Lakshami Perera</div>
          <div class="text-caption text-gold font-bold">Grade 10 - Maths</div>
          
          <q-btn 
            unelevated 
            class="full-width q-mt-xl bg-gold-gradient text-white" 
            label="Generate Star Poster" 
            icon="share"
            @click="handlePosterAction"
          />
        </q-card>
      </div>
    </div>

    <!-- QR Scan Dialog -->
    <q-dialog v-model="scanDialog" persistent>
      <q-card style="width: 400px; max-width: 90vw" class="bg-dark-card border-glass text-white">
        <q-toolbar>
          <q-toolbar-title>Scanning Submissions</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section class="text-center">
          <div id="hw-reader" style="width: 100%; border-radius: 12px; overflow: hidden;"></div>
          <div class="q-mt-md text-subtitle1">{{ currentAssignment?.title }}</div>
          <div v-if="lastScannedName" class="q-mt-md text-green-4 text-weight-bold animate-pop">
            Verified: {{ lastScannedName }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import { Html5QrcodeScanner } from 'html5-qrcode'

const $q = useQuasar()
const authStore = useAuthStore()
const router = useRouter()
const scanDialog = ref(false)
const showAddDialog = ref(false)
const currentAssignment = ref(null)
const lastScannedName = ref('')

const homeworks = ref([
  { id: 1, title: 'Algebra Worksheet 01', className: 'Grade 10 Maths', dueDate: '2026-03-15', submitted: 45, total: 50 },
  { id: 2, title: 'Physics Vectors Lab', className: 'Grade 11 Physics', dueDate: '2026-03-18', submitted: 12, total: 35 },
])

const startScanning = (hw) => {
  currentAssignment.value = hw
  scanDialog.value = true
  lastScannedName.value = ''
  
  setTimeout(() => {
    const scanner = new Html5QrcodeScanner("hw-reader", { fps: 10, qrbox: 250 })
    scanner.render((decodedText) => {
      // Mock logic: assuming QR contains Student Name
      lastScannedName.value = decodedText
      $q.notify({ type: 'positive', message: `Submission recorded for ${decodedText}` })
      
      // Here you would trigger n8n to log the submission
      
      setTimeout(() => { lastScannedName.value = '' }, 2000)
    })
  }, 500)
}

const openAddDialog = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('create new assignments')
    return
  }
  showAddDialog.value = true
}

const handleScanAction = (hw) => {
  if (authStore.isDemo) {
    showRegisterPrompt('scan submissions')
    return
  }
  startScanning(hw)
}

const handlePosterAction = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('generate star posters')
    return
  }
  generateStarPoster()
}

const generateStarPoster = () => {
  $q.notify({
    type: 'positive',
    message: 'Data sent to n8n! Star Poster will be generated shortly.',
    icon: 'rocket_launch'
  })
}

const showRegisterPrompt = (feature) => {
  $q.dialog({
    title: 'Demo Mode Limitation',
    message: `To ${feature}, please register for a full account.`,
    ok: { label: 'Register Now', color: 'secondary' },
    cancel: { flat: true, label: 'Later' }
  }).onOk(() => {
    router.push('/register')
  })
}
</script>

<style scoped>
.bg-dark-card {
  background: #0f172a !important;
}
.border-glass {
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.border-radius-lg {
  border-radius: 16px;
}
.bg-gold-gradient {
  background: linear-gradient(135deg, #bf953f 0%, #b38728 100%);
}
.text-gold {
  color: #bf953f;
}
.hover-scale:hover {
  transform: scale(1.02);
}
.animate-pop {
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.blur-text {
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
}
</style>
