<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg q-gutter-y-sm">
      <div class="col-12 col-sm-auto">
        <h1 class="text-h5 text-weight-bold q-my-none text-white">Attendance</h1>
        <p class="text-grey-6 q-mt-xs q-mb-none">Mark and track student attendance.</p>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <q-card class="no-shadow border-gray q-mb-lg bg-transparent">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="mark" label="Mark Attendance" icon="check_circle" class="text-grey-4" />
        <q-tab name="reports" label="Attendance Reports" icon="bar_chart" class="text-grey-4" />
        <q-tab name="absent" label="Absence Tracking" icon="warning" class="text-grey-4" />
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- TAB 1: MARK ATTENDANCE (Original Logic) -->
      <q-tab-panel name="mark" class="q-pa-none">
        <!-- Active Session Card -->
        <q-card class="no-shadow border-gray q-mb-lg bg-transparent">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold">Select Class Session</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-4">
                <q-select
                  outlined
                  v-model="selectedClass"
                  :options="classOptions"
                  option-label="name"
                  label="Select Class"
                  dense
                  @update:model-value="loadStudents"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-input
                  outlined
                  v-model="selectedDate"
                  type="date"
                  label="Date"
                  dense
                  @update:model-value="loadStudents"
                />
              </div>
              <div class="col-12 col-md-5 text-right" v-if="selectedClass">
                <q-chip color="blue-1" text-color="primary" icon="school">
                  {{ selectedClass.grade }}
                </q-chip>
                <q-chip color="green-1" text-color="green" icon="group">
                  {{ students.length }} Students
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div v-if="selectedClass" class="row q-col-gutter-lg">
          <!-- QR Scan Section -->
          <div class="col-12 col-md-4">
            <q-card 
              class="no-shadow border-gray text-center q-pa-lg h-full transition-all"
              :class="scanningState === 'success' ? 'bg-green-1' : scanningState === 'error' ? 'bg-red-1' : 'bg-transparent'"
            >
            <div class="scan-overlay-container q-mb-md">
              <div v-show="settingsStore.useCameraScan" class="relative-position q-mb-md" style="width: 100%; max-width: 300px; margin: 0 auto;">
                <div id="reader" style="border-radius: 12px; overflow: hidden;"></div>
                <q-btn 
                  round 
                  flat 
                  dense 
                  icon="close" 
                  color="white" 
                  class="absolute-top-right bg-red q-ma-xs z-top shadow-2" 
                  @click="toggleCamera"
                  style="width: 30px; height: 30px;"
                >
                  <q-tooltip>Close Camera</q-tooltip>
                </q-btn>
              </div>
                <q-icon 
                  v-show="!settingsStore.useCameraScan"
                  :name="scanningState === 'success' ? 'check_circle' : scanningState === 'error' ? 'error' : 'qr_code_scanner'" 
                  size="64px" 
                  :color="scanningState === 'success' ? 'green' : scanningState === 'error' ? 'red' : 'primary'" 
                />
                <div v-if="scanningState === 'idle' && !settingsStore.useCameraScan" class="scan-laser"></div>
              </div>
              
              <div class="text-h6 text-weight-bold">Attendance Scanner</div>
              <p class="text-caption text-grey-5">
                {{ settingsStore.useCameraScan ? 'Camera scanning active' : 'USB Scanner active. Just point and scan.' }}
              </p>

              <div class="row justify-center q-mb-md">
                <q-btn 
                  unelevated 
                  :color="settingsStore.useCameraScan ? 'primary' : 'grey-3'" 
                  :text-color="settingsStore.useCameraScan ? 'white' : 'grey-9'"
                  :icon="settingsStore.useCameraScan ? 'videocam' : 'videocam_off'" 
                  :label="settingsStore.useCameraScan ? 'Stop Camera' : 'Start Camera'" 
                  no-caps
                  @click="toggleCamera"
                />
              </div>

              <q-input
                v-if="!settingsStore.useCameraScan"
                ref="scanInput"
                outlined
                v-model="scanCode"
                placeholder="Scanner Active..."
                dense
                bg-color="white"
                @keyup.enter="handleScan"
                class="q-mt-md sticky-focus-input"
                :loading="processingScan"
              >
                <template v-slot:append>
                  <q-icon name="keyboard" color="grey-5" />
                </template>
              </q-input>

              <div v-if="lastScanned" class="q-mt-lg animate-pop">
                <div class="text-subtitle1 text-weight-bold text-green-9">
                  {{ lastScanned }}
                </div>
                <div class="text-caption text-green-8">Attendance Marked Successfully!</div>
              </div>
              
              <div v-if="scanningState === 'error'" class="q-mt-lg animate-pop">
                <div class="text-subtitle1 text-weight-bold text-red-9">
                  Student Not Found
                </div>
                <div class="text-caption text-red-8">Please check the ID card or class selection.</div>
              </div>
            </q-card>
          </div>

          <!-- Student List -->
          <div class="col-12 col-md-8">
            <q-card class="no-shadow border-gray bg-transparent">
              <q-toolbar class="bg-transparent q-pl-md q-pr-md border-bottom-light">
                <q-toolbar-title class="text-subtitle1">Class Roll Call</q-toolbar-title>
                <div class="row q-gutter-sm">
                  <q-btn
                    flat
                    round
                    dense
                    icon="sms"
                    color="blue"
                    @click="sendBulkSMS"
                  >
                    <q-tooltip>Send WhatsApp Alerts</q-tooltip>
                  </q-btn>
                  <q-btn flat round dense icon="done_all" color="primary" @click="markAllPresent">
                    <q-tooltip>Mark All Present</q-tooltip>
                  </q-btn>
                </div>
              </q-toolbar>

              <q-list separator>
                <div v-if="loading" class="q-pa-md text-center">
                  <q-spinner color="primary" size="2em" />
                </div>

                <div v-else-if="students.length === 0" class="q-pa-lg text-center text-grey">
                  No students enrolled in this class.
                </div>

                <q-item v-for="student in sortedStudents" :key="student.id" class="q-py-md item-transition" :class="student.justMarked ? 'bg-blue-1' : ''">
                  <q-item-section avatar>
                    <q-avatar color="indigo-1" text-color="primary" class="text-weight-bold">
                      {{ student.name.charAt(0) }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-weight-bold">{{ student.name }}</q-item-label>
                    <q-item-label caption :class="{ 'blur-text': authStore.isDemo }">REG: {{ String(student.id).padStart(5, '0') }} | {{ student.phone }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="row q-gutter-xs no-wrap">
                      <q-btn
                        :unelevated="student.attendance === 'Present'"
                        :outline="student.attendance !== 'Present'"
                        :color="student.attendance === 'Present' ? 'green' : 'grey-8'"
                        label="P"
                        size="sm"
                        class="status-btn"
                        @click="updateStatus(student, 'Present')"
                      />
                      <q-btn
                        :unelevated="student.attendance === 'Absent'"
                        :outline="student.attendance !== 'Absent'"
                        :color="student.attendance === 'Absent' ? 'red' : 'grey-8'"
                        label="A"
                        size="sm"
                        class="status-btn"
                        @click="updateStatus(student, 'Absent')"
                      />
                      <q-btn
                        :unelevated="student.attendance === 'Late'"
                        :outline="student.attendance !== 'Late'"
                        :color="student.attendance === 'Late' ? 'orange' : 'grey-8'"
                        label="L"
                        size="sm"
                        class="status-btn"
                        @click="updateStatus(student, 'Late')"
                      />
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
        <div v-else class="text-center q-pa-xl text-grey-8">
          <q-icon name="qr_code" size="80px" class="opacity-20" />
          <div class="text-h6 q-mt-md">Select a class to activate the Smart Scanner</div>
        </div>
      </q-tab-panel>

      <!-- TAB 2: REPORTS -->
      <q-tab-panel name="reports" class="q-pa-none">
        <div class="row q-col-gutter-lg">
          <!-- Summary Cards -->
          <div class="col-12 col-md-4">
            <q-card class="no-shadow border-gray bg-transparent q-pa-md text-center">
              <div class="text-subtitle2 text-grey-4">Average Attendance</div>
              <div class="text-h3 text-weight-bold text-primary q-mt-sm">{{ avgAttendance }}%</div>
              <div class="text-caption text-green q-mt-xs">
                <q-icon name="trending_up" /> +2.4% from last month
              </div>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="no-shadow border-gray bg-transparent q-pa-md text-center">
              <div class="text-subtitle2 text-grey-4">Total Sessions</div>
              <div class="text-h3 text-weight-bold text-white q-mt-sm">{{ totalSessions }}</div>
              <div class="text-caption text-grey q-mt-xs">This Month</div>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="no-shadow border-gray bg-transparent q-pa-md text-center">
              <div class="text-subtitle2 text-grey-4">Best Attendance Class</div>
              <div class="text-h4 text-weight-bold text-secondary q-mt-sm">Grade 10 - Maths</div>
              <div class="text-caption text-grey q-mt-xs">98% Turnout</div>
            </q-card>
          </div>

          <!-- Charts -->
          <div class="col-12 col-md-8">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="text-h6 q-mb-md">Attendance Trends (Last 7 Days)</div>
              <apexchart
                type="bar"
                height="300"
                :options="barChartOptions"
                :series="barChartSeries"
              ></apexchart>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="text-h6 q-mb-md">Overall Status</div>
              <apexchart
                type="donut"
                height="300"
                :options="donutChartOptions"
                :series="donutChartSeries"
              ></apexchart>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- TAB 3: ABSENCE TRACKING -->
      <q-tab-panel name="absent" class="q-pa-none">
        <q-banner rounded class="bg-red-9 text-white q-mb-lg border-red">
          <template v-slot:avatar>
            <q-icon name="warning" color="white" />
          </template>
          Showing students who have missed <strong>3 or more consecutive classes</strong>. Urgent
          follow-up recommended.
        </q-banner>

        <q-card class="no-shadow border-gray bg-transparent">
          <q-table :rows="atRiskStudents" :columns="riskColumns" row-key="id" flat class="bg-transparent">
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey">{{ props.row.class }}</div>
              </q-td>
            </template>
            <template v-slot:body-cell-consecutive="props">
              <q-td :props="props">
                <q-badge color="red" text-color="white" class="text-subtitle2 q-pa-xs">
                  {{ props.row.consecutive }} Classes
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="right">
                <q-btn
                  size="sm"
                  color="primary"
                  icon="phone"
                  label="Call Parent"
                  class="q-mr-sm"
                  :href="`tel:${props.row.parentPhone}`"
                />
                <q-btn
                  size="sm"
                  outline
                  color="grey-4"
                  icon="sms"
                  label="Send Warning"
                  @click="sendWarning(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth'
import VueApexCharts from 'vue3-apexcharts'
import { useN8nStore } from 'stores/n8n'
import { useSettingsStore } from 'stores/settings'
import { Html5QrcodeScanner } from 'html5-qrcode'

const n8nStore = useN8nStore()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const router = useRouter()

let html5QrcodeScanner = null

const Apexchart = VueApexCharts
const $q = useQuasar()
const tab = ref('mark')
const loading = ref(false)
const userOrgId = ref(null)

// --- MARK ATTENDANCE STATE ---
const classOptions = ref([])
const selectedClass = ref(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const students = ref([])
const scanCode = ref('')
const lastScanned = ref('')
const scanInput = ref(null)
const scanningState = ref('idle') // idle, success, error
const processingScan = ref(false)

// --- STATISTICS STATE ---
const avgAttendance = ref(0)
const totalSessions = ref(0)

// --- ALWAYS-ON FOCUS LOGIC ---
const handleGlobalClick = (e) => {
  // If the scanner tab is active and we have an input ref
  if (tab.value === 'mark' && scanInput.value && selectedClass.value) {
    // Don't steal focus if user is clicking on select or other interactive elements
    const isInteractive = e.target.closest('.q-select') || 
                         e.target.closest('.q-btn') || 
                         e.target.closest('.q-field--focused')
    
    if (!isInteractive) {
      setTimeout(() => {
        if (scanInput.value) scanInput.value.focus()
      }, 100)
    }
  }
}

// Sorted students: Present ones go to top, but let's keep it alphabetical for roll call
const sortedStudents = computed(() => {
  return [...students.value].sort((a, b) => a.name.localeCompare(b.name))
})

// --- REPORT CHARTS CONFIG ---
const barChartOptions = {
  chart: { type: 'bar', toolbar: { show: false } },
  plotOptions: { bar: { borderRadius: 4, horizontal: false, columnWidth: '55%' } },
  dataLabels: { enabled: false },
  xaxis: { 
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    labels: { style: { colors: '#9e9e9e' } }
  },
  yaxis: { labels: { style: { colors: '#9e9e9e' } } },
  colors: ['#3b82f6'],
}
const barChartSeries = [{ name: 'Present Students', data: [45, 52, 38, 24, 33, 65, 60] }]

const donutChartOptions = {
  labels: ['Present', 'Absent', 'Late'],
  colors: ['#22c55e', '#ef4444', '#f97316'],
  legend: { position: 'bottom', labels: { colors: '#9e9e9e' } },
  stroke: { show: false }
}
const donutChartSeries = [75, 15, 10]

// --- ABSENCE TRACKING STATE ---
const riskColumns = [
  { name: 'name', label: 'Student Name', field: 'name', align: 'left' },
  { name: 'consecutive', label: 'Consecutive Absence', field: 'consecutive', align: 'center' },
  { name: 'lastPresent', label: 'Last Seen', field: 'lastPresent', align: 'left' },
  { name: 'parentPhone', label: 'Parent Contact', field: 'parentPhone', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const atRiskStudents = ref([
  {
    id: 101,
    name: 'Kavindu Perera',
    class: 'Grade 10 - Maths',
    consecutive: 3,
    lastPresent: '2026-01-20',
    parentPhone: '0771234567',
  },
  {
    id: 102,
    name: 'Shehan Silva',
    class: 'Grade 11 - Science',
    consecutive: 4,
    lastPresent: '2026-01-15',
    parentPhone: '0719876543',
  },
  {
    id: 103,
    name: 'Nethmi Fernando',
    class: 'Grade 9 - English',
    consecutive: 3,
    lastPresent: '2026-01-22',
    parentPhone: '0705556667',
  },
])

// --- INIT ---
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single()
    if (profile) userOrgId.value = profile.org_id
  }
  await fetchClasses()
  await fetchStats()
  window.addEventListener('click', handleGlobalClick)

  if (settingsStore.useCameraScan) {
    startCamera()
  }
})

onUnmounted(() => {
  window.removeEventListener('click', handleGlobalClick)
  stopCamera()
})

const toggleCamera = () => {
  settingsStore.setCameraScanMode(!settingsStore.useCameraScan)
  if (settingsStore.useCameraScan) {
    startCamera()
  } else {
    stopCamera()
  }
}

// Auto-stop camera when switching away from the Mark Attendance tab
watch(tab, (newTab) => {
  if (newTab !== 'mark') {
    stopCamera()
  } else if (settingsStore.useCameraScan) {
    startCamera()
  }
})

const startCamera = () => {
  setTimeout(() => {
    if (!html5QrcodeScanner) {
      html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { 
          fps: 20, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          showTorchButtonIfSupported: true,
          rememberLastUsedCamera: true
        },
        /* verbose= */ false
      )
      html5QrcodeScanner.render(onScanSuccess, onScanFailure)
    }
  }, 100)
}

const stopCamera = () => {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(error => {
      console.error("Failed to clear scanner", error)
    })
    html5QrcodeScanner = null
  }
}

const onScanSuccess = (decodedText) => {
  scanCode.value = decodedText
  handleScan()
}

const onScanFailure = () => {
  // Silent fail - QR not in frame
}

const fetchStats = async () => {
  if (authStore.isDemo) {
    avgAttendance.value = 92
    totalSessions.value = 24
    return
  }
  if (!userOrgId.value) return

  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data: sessions } = await supabase
    .from('attendance')
    .select('date, status')
    .eq('org_id', userOrgId.value)
    .gte('date', firstDay)

  if (sessions && sessions.length > 0) {
    const sessionSet = new Set(sessions.map(s => s.date))
    totalSessions.value = sessionSet.size
    const presentCount = sessions.filter(s => s.status === 'Present').length
    avgAttendance.value = Math.round((presentCount / sessions.length) * 100)
  }
}

const fetchClasses = async () => {
  if (authStore.isDemo) {
    classOptions.value = [
      { id: 1, name: 'Grade 10 - Maths', grade: 'Grade 10' },
      { id: 2, name: 'Grade 11 - Science', grade: 'Grade 11' }
    ]
    return
  }
  if (!userOrgId.value) return
  const { data } = await supabase.from('classes')
    .select('*')
    .eq('status', 'Active')
    .eq('org_id', userOrgId.value)
  classOptions.value = data || []
}

const loadStudents = async () => {
  if (authStore.isDemo) {
    students.value = [
      { id: 1, name: 'Lakshami Perera', phone: '077-1234567', attendance: 'Absent' },
      { id: 2, name: 'Saman Silva', phone: '071-7654321', attendance: 'Present' },
      { id: 3, name: 'Kavindi de Silva', phone: '070-8899001', attendance: 'Absent' }
    ]
    return
  }
  if (!selectedClass.value) return
  loading.value = true

  const { data: studentList } = await supabase
    .from('students')
    .select('*')
    .eq('grade', selectedClass.value.grade)
    .eq('status', 'Active')
    .eq('org_id', userOrgId.value)

  const { data: attendanceList } = await supabase
    .from('attendance')
    .select('*')
    .eq('class_id', selectedClass.value.id)
    .eq('date', selectedDate.value)
    .eq('org_id', userOrgId.value)

  if (!studentList || studentList.length === 0) {
    students.value = []
    loading.value = false
    return
  }

  students.value = studentList.map((stu) => {
    const record = attendanceList ? attendanceList.find((a) => a.student_id === stu.id) : null
    return {
      ...stu,
      attendance: record ? record.status : 'Absent',
    }
  })

  loading.value = false
  // Focus scanner if selecting class
  setTimeout(() => { if (scanInput.value) scanInput.value.focus() }, 500)
}

const updateStatus = async (student, status) => {
  if (authStore.isDemo) {
    student.attendance = status
    showRegisterPrompt('mark attendance and sync with DB')
    return
  }
  student.attendance = status
  
  const { error } = await supabase.from('attendance').upsert(
    {
      class_id: selectedClass.value.id,
      student_id: student.id,
      date: selectedDate.value,
      status: status,
      org_id: userOrgId.value,
    },
    { onConflict: 'class_id, student_id, date' },
  )

  if (error) {
    $q.notify({ type: 'warning', message: 'DB Sync failed, saved locally' })
  }
}

const markAllPresent = async () => {
  $q.dialog({
    title: 'Confirm',
    message: 'Mark everyone in this class as Present?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    students.value.forEach((s) => updateStatus(s, 'Present'))
    $q.notify({ type: 'positive', message: 'All marked Present!' })
  })
}

const announceStudent = (name) => {
  if (!name || authStore.isDemo) return // Skip voice for demo if requested, but let's keep it if they want to see it work
  const msg = new SpeechSynthesisUtterance()
  msg.text = `Welcome ${name}`
  msg.rate = 1.0
  msg.pitch = 1.0
  msg.volume = 0.8
  window.speechSynthesis.speak(msg)
}

const handleScan = async () => {
  if (!scanCode.value || processingScan.value) return
  
  processingScan.value = true
  scanningState.value = 'idle'
  
  // Extract ID from QR (Assuming simple ID or STUDENT_ID:X format)
  let studentId = scanCode.value
  if (scanCode.value.includes('STUDENT_ID:')) {
    studentId = scanCode.value.split('STUDENT_ID:')[1].split('\n')[0]
  }
  
  const idValue = parseInt(studentId)
  const student = students.value.find((s) => s.id === idValue)

  if (student) {
    await updateStatus(student, 'Present')
    lastScanned.value = student.name
    student.justMarked = true
    scanningState.value = 'success'
    
    // Smart Voice Welcome
    announceStudent(student.name)

    // Play a subtle success sound or vibrate if possible
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(100)
    }

    // Reset flags
    setTimeout(() => {
      student.justMarked = false
      lastScanned.value = ''
      scanningState.value = 'idle'
    }, 3000)
  } else {
    scanningState.value = 'error'
    $q.notify({ 
      type: 'negative', 
      message: `Invalid ID: ${scanCode.value.substring(0, 15)}...`,
      caption: 'Please use a valid Student ID card.',
      position: 'bottom'
    })
    setTimeout(() => { scanningState.value = 'idle' }, 3000)
  }
  
  scanCode.value = ''
  processingScan.value = false
  if (scanInput.value) scanInput.value.focus()
}

const sendBulkSMS = async () => {
  $q.loading.show({ message: 'Syncing with n8n Digital Postman...' })
  
  let successCount = 0
  for (const student of students.value) {
    if (student.attendance === 'Present') {
      const ok = await n8nStore.triggerAttendanceAlert(student, {
        class_name: selectedClass.value.name,
        date: selectedDate.value,
        org_id: userOrgId.value
      })
      if (ok) successCount++
    }
  }

  $q.loading.hide()
  $q.notify({
    type: 'positive',
    message: `${successCount} WhatsApp Alerts dispatched successfully!`,
    icon: 'done_all'
  })
}

const sendWarning = (student) => {
  if (authStore.isDemo) {
    showRegisterPrompt('send absence warnings')
    return
  }
  $q.notify({
    type: 'negative',
    message: `Warning sent to ${student.name}'s parent.`,
    icon: 'send',
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

<style lang="scss">
.border-gray {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
body.body--light .border-gray {
  border: 1px solid #eaecf0;
}
.border-bottom-light {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.h-full {
  height: 100%;
}
.border-red {
  border: 1px solid #ef4444;
}

.status-btn {
  width: 32px;
  min-width: 32px;
}

.scan-overlay-container {
  position: relative;
  display: inline-block;
  padding: 10px;
}

.scan-laser {
  position: absolute;
  top: 10px;
  left: 10%;
  width: 80%;
  height: 2px;
  background: red;
  box-shadow: 0 0 10px red;
  animation: laser-move 2s infinite ease-in-out;
}

@keyframes laser-move {
  0% { top: 10px; }
  50% { top: 90%; }
  100% { top: 10px; }
}

.animate-pop {
  animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.item-transition {
  transition: background-color 0.5s ease;
}

.transition-all {
  transition: all 0.3s ease;
}

.opacity-20 {
  opacity: 0.2;
}

/* Ensure the focused input is visible/distinct but fits theme */
.sticky-focus-input .q-field__native {
  font-weight: bold;
  letter-spacing: 2px;
}

@media (max-width: 600px) {
  .q-page {
    padding: 16px !important;
  }
}
.blur-text {
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
}
</style>
