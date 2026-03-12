<template>
  <q-page class="bg-primary flex flex-center q-pa-md">
    <q-card style="width: 500px; max-width: 95vw" class="bg-dark-card border-glass text-white shadow-24">
      <q-card-section class="text-center q-pa-xl">
        <q-avatar size="100px" class="q-mb-md bg-gold-gradient shadow-10">
          <q-icon name="person" color="white" size="64px" />
        </q-avatar>
        <div class="text-h5 text-weight-bolder text-white">Student Progress Report</div>
        <p class="text-grey-5 q-mt-sm">Secure Access for Parents</p>
      </q-card-section>

      <q-card-section class="q-px-xl q-pb-xl">
        <div class="column q-gutter-y-lg">
          <q-input
            outlined
            dark
            v-model="studentId"
            label="Enter Student ID / Registration No."
            bg-color="white-opacity"
            class="text-weight-bold"
          >
            <template v-slot:prepend>
              <q-icon name="badge" />
            </template>
          </q-input>

          <q-btn
            size="lg"
            class="full-width bg-gold-gradient text-white text-weight-bold shadow-5"
            label="View Report"
            no-caps
            @click="viewReport"
            :loading="loading"
          />
        </div>

        <div class="q-mt-xl text-center text-caption text-grey-7">
          Having trouble? Contact us on <a href="https://wa.me/94112345678" class="text-secondary">WhatsApp</a>
        </div>
      </q-card-section>
    </q-card>

    <!-- Report View (Expanded) -->
    <q-dialog v-model="showReport" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-primary text-white">
        <q-toolbar class="border-bottom-light q-py-md">
          <q-toolbar-title class="text-weight-bold">Progress Report: {{ studentId }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-pa-lg container">
          <div class="row q-col-gutter-lg justify-center">
            <!-- Stats -->
            <div class="col-12 col-md-4" v-for="stat in reportStats" :key="stat.label">
              <q-card class="bg-dark-card border-glass q-pa-lg text-center full-height">
                <q-icon :name="stat.icon" :color="stat.color" size="48px" />
                <div class="text-h4 text-weight-bolder q-mt-md">{{ stat.value }}</div>
                <div class="text-caption text-grey-5 uppercase tracking-widest q-mt-xs">{{ stat.label }}</div>
              </q-card>
            </div>

            <!-- Performance Chart -->
            <div class="col-12">
              <q-card class="bg-dark-card border-glass q-pa-lg">
                <div class="text-h6 text-weight-bold q-mb-md">Exam History</div>
                <apexchart type="line" height="300" :options="chartOptions" :series="chartSeries" />
              </q-card>
            </div>

            <!-- Teacher Feedback -->
            <div class="col-12">
              <q-card class="bg-dark-card border-glass q-pa-lg">
                <div class="text-h6 text-weight-bold q-mb-md row items-center">
                  <q-icon name="comment" color="secondary" class="q-mr-sm" />
                  Teacher's Remarks
                </div>
                <div class="q-pa-md bg-white-opacity rounded-borders italic text-grey-3">
                  "Exhibits great logic in Mathematics. Needs to focus a bit more on Physics derivations. Excellent attendance records this term!"
                </div>
              </q-card>
            </div>

            <!-- Parent Comment Section -->
            <div class="col-12">
              <q-card class="bg-dark-card border-glass q-pa-lg">
                <div class="text-h6 text-weight-bold q-mb-md">Send Feedback to Institute</div>
                <q-input
                  v-model="parentFeedback"
                  type="textarea"
                  outlined
                  dark
                  placeholder="Ask a question or leave a note for the teacher..."
                  bg-color="white-opacity"
                />
                <q-btn 
                  color="secondary" 
                  class="q-mt-md full-width" 
                  label="Send Message" 
                  icon="send" 
                  @click="sendFeedback" 
                  :loading="feedbackLoading"
                />
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import VueApexCharts from 'vue3-apexcharts'

const Apexchart = VueApexCharts
const $q = useQuasar()
const authStore = useAuthStore()
const router = useRouter()

const studentId = ref('')
const loading = ref(false)
const showReport = ref(false)
const parentFeedback = ref('')
const feedbackLoading = ref(false)

const reportStats = [
  { label: 'Attendance', value: '96%', icon: 'rule', color: 'green' },
  { label: 'Latest Score', value: '88/100', icon: 'assignment', color: 'blue' },
  { label: 'Grade Rank', value: '#5', icon: 'stars', color: 'gold' }
]

const chartOptions = {
  chart: { toolbar: { show: false }, background: 'transparent' },
  colors: ['#10b981'],
  stroke: { curve: 'smooth' },
  xaxis: { categories: ['Jan', 'Feb', 'Mar'], labels: { style: { colors: '#9e9e9e' } } },
  yaxis: { labels: { style: { colors: '#9e9e9e' } } },
  grid: { borderColor: 'rgba(255,255,255,0.05)' },
  theme: { mode: 'dark' }
}
const chartSeries = [{ name: 'Marks', data: [75, 82, 88] }]

onMounted(() => {
  if (authStore.isDemo) {
    studentId.value = 'ST-DEMO-001'
  }
})

const viewReport = () => {
  if (!studentId.value) {
    $q.notify({ type: 'warning', message: 'Please enter a Student ID' })
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    showReport.value = true
  }, 1000)
}

const sendFeedback = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('send parent feedback')
    return
  }
  if (!parentFeedback.value) return
  feedbackLoading.value = true
  setTimeout(() => {
    feedbackLoading.value = false
    $q.notify({ type: 'positive', message: 'Feedback sent! The teacher will be notified.' })
    parentFeedback.value = ''
  }, 1000)
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
.bg-white-opacity {
  background: rgba(255, 255, 255, 0.05);
}
.border-bottom-light {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.bg-gold-gradient {
  background: linear-gradient(135deg, #bf953f 0%, #b38728 100%);
}
.container {
  max-width: 900px;
  margin: 0 auto;
}
</style>
