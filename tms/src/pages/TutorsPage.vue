<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none text-white">Tutor Management</h1>
        <p class="text-grey-5 q-mt-xs q-mb-none">
          Manage tutors, track performance, and handle commission payments.
        </p>
      </div>
      <div class="q-gutter-x-sm" v-if="tab === 'tutors'">
        <q-btn
          unelevated
          icon="add"
          color="primary"
          label="New Tutor"
          no-caps
          @click="openAddDialog"
        />
      </div>
    </div>

    <!-- Navigation Tabs -->
    <q-card class="no-shadow border-gray q-mb-lg">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="overview" label="Dashboard & Overview" class="text-grey-4" />
        <q-tab name="payments" label="Commission Payments" class="text-grey-4" />
        <q-tab name="tutors" label="All Tutors" class="text-grey-4" />
      </q-tabs>
    </q-card>

    <q-tab-panels v-model="tab" animated class="bg-transparent">
      <!-- DASHBOARD / OVERVIEW TAB -->
      <q-tab-panel name="overview" class="q-pa-none">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-md-3">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                    Active Tutors
                  </div>
                  <div class="text-h4 text-weight-bold text-white q-mt-xs">
                    {{ activeTutorsCount }}
                  </div>
                </div>
                <q-avatar color="blue-1" text-color="blue-8" icon="school" />
              </div>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                    Pending Payouts
                  </div>
                  <div class="text-h4 text-weight-bold text-orange-9 q-mt-xs">
                    {{ currencyStore.format(totalPendingPayouts) }}
                  </div>
                </div>
                <q-avatar color="orange-1" text-color="orange-8" icon="payments" />
              </div>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                    Paid This Month
                  </div>
                  <div class="text-h4 text-weight-bold text-green-9 q-mt-xs">
                    {{ currencyStore.format(totalPaidMonth) }}
                  </div>
                </div>
                <q-avatar color="green-1" text-color="green-8" icon="check_circle" />
              </div>
            </q-card>
          </div>
          <div class="col-12 col-md-3">
            <q-card class="no-shadow border-gray q-pa-md bg-transparent">
              <div class="row items-center justify-between">
                <div>
                  <div class="text-caption text-grey-6 text-uppercase text-weight-bold">
                    Top Performer
                  </div>
                  <div class="text-h6 text-weight-bold text-white q-mt-xs ellipsis">
                    {{ topPerformer.tutorName || 'N/A' }}
                  </div>
                </div>
                <q-avatar color="purple-1" text-color="purple-8" icon="star" />
              </div>
            </q-card>
          </div>
        </div>

        <!-- Payout Analytics & Recent History -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-card class="no-shadow border-gray bg-transparent q-pa-md">
              <div class="text-h6 q-mb-md">Monthly Payout Trends</div>
              <apexchart
                type="area"
                height="300"
                :options="chartOptions"
                :series="chartSeries"
              ></apexchart>
            </q-card>
          </div>
          <div class="col-12 col-md-4">
            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6">Recent Payouts</div>
              </q-card-section>
              <q-table
                :rows="payoutHistory"
                :columns="payoutHistoryColumns"
                row-key="id"
                flat
                hide-bottom
              >
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                      :color="props.row.status === 'Completed' ? 'green-1' : 'orange-1'"
                      :text-color="props.row.status === 'Completed' ? 'green-9' : 'orange-9'"
                      dense
                      class="text-weight-bold"
                    >
                      {{ props.row.status }}
                    </q-chip>
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </div>
        </div>
      </q-tab-panel>

      <!-- PAYMENTS TAB -->
      <q-tab-panel name="payments" class="q-pa-none">
        <q-card class="no-shadow border-gray">
          <q-card-section class="q-pb-none">
            <div class="row items-center justify-between">
              <div class="text-h6">Calculate & Process Commissions</div>
              <div class="text-subtitle2 text-grey-6">Current Month: February 2026</div>
            </div>
          </q-card-section>

          <q-table
            :rows="tutorPayments"
            :columns="paymentColumns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
            class="q-mt-md"
          >
            <template v-slot:body-cell-tutorName="props">
              <q-td :props="props">
                <div class="row items-center">
                  <q-avatar size="32px" class="q-mr-sm" color="grey-2" text-color="primary">
                    {{ props.row.tutorName.charAt(0) }}
                  </q-avatar>
                  <div class="text-weight-medium">{{ props.row.tutorName }}</div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  v-if="props.row.status === 'Paid'"
                  color="green-1"
                  text-color="green-9"
                  label="Paid"
                  class="q-pa-xs text-weight-bold"
                />
                <q-badge
                  v-else
                  color="orange-1"
                  text-color="orange-9"
                  label="Pending"
                  class="q-pa-xs text-weight-bold"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="right">
                <q-btn
                  v-if="props.row.status === 'Pending'"
                  unelevated
                  size="sm"
                  color="primary"
                  label="Pay Now"
                  @click="processPayment(props.row)"
                />
                <q-btn v-else flat size="sm" color="grey" label="View Receipt" dense />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>

      <!-- ALL TUTORS TAB (Original View) -->
      <q-tab-panel name="tutors" class="q-pa-none">
        <q-card class="no-shadow border-gray">
          <q-table
            :rows="rows"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="row items-center no-wrap">
                  <q-avatar size="32px" class="q-mr-sm" color="purple-1" text-color="purple">
                    {{ props.row.name.charAt(0) }}
                  </q-avatar>
                  <div>
                    <div class="text-weight-bold">{{ props.row.name }}</div>
                    <div class="text-caption text-grey-5">{{ props.row.email }}</div>
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-subjects="props">
              <q-td :props="props">
                <div class="q-gutter-xs">
                  <q-badge
                    v-for="sub in props.row.subjects"
                    :key="sub"
                    color="grey-2"
                    text-color="grey-9"
                    class="q-px-sm"
                  >
                    {{ sub }}
                  </q-badge>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-commission="props">
              <q-td :props="props">
                <q-badge color="blue-1" text-color="blue-9" class="text-weight-bold">
                  {{ props.row.commission }}%
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.status === 'Active' ? 'green-2' : 'red-2'"
                  :text-color="props.row.status === 'Active' ? 'green-9' : 'red-9'"
                  class="q-px-sm q-py-xs text-weight-bold"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn flat round dense icon="more_vert" color="grey-5">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup @click="editTutor(props.row)">
                        <q-item-section>Edit Details</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        clickable
                        v-close-popup
                        class="text-red"
                        @click="deleteTutor(props.row.id)"
                      >
                        <q-item-section>Delete</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <!-- Edit/Add Tutor Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditMode ? 'Edit Tutor Details' : 'Add New Tutor' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-y-md">
          <q-input outlined v-model="editingRow.name" label="Tutor Name" dense />
          <q-input outlined v-model="editingRow.email" label="Email Address" dense />
          <q-input
            outlined
            v-model="editingRow.phone"
            label="Phone Number"
            mask="###-#######"
            dense
          />

          <q-select
            outlined
            v-model="editingRow.subjects"
            :options="[
              'Mathematics',
              'Physics',
              'Chemistry',
              'Biology',
              'English',
              'History',
              'ICT',
            ]"
            label="Subjects"
            multiple
            use-chips
            dense
          />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model.number="editingRow.commission"
                label="Commission (%)"
                type="number"
                dense
                hint="Percentage of class fees"
              />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="editingRow.status"
                :options="['Active', 'Inactive']"
                label="Status"
                dense
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            :label="isEditMode ? 'Save Changes' : 'Add Tutor'"
            color="primary"
            @click="saveTutor"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Payment Confirmation Dialog -->
    <q-dialog v-model="paymentConfirmDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Confirm Payout</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          Are you sure you want to process a payment of
          <span class="text-weight-bold text-primary">{{
            currencyStore.format(selectedPayment?.payableAmount)
          }}</span>
          to {{ selectedPayment?.tutorName }}?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            label="Confirm Pay"
            color="primary"
            unelevated
            @click="confirmPayment"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useCurrencyStore } from 'stores/currency'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth'
import VueApexCharts from 'vue3-apexcharts'
import { useN8nStore } from 'stores/n8n'

const Apexchart = VueApexCharts
const n8nStore = useN8nStore()

const $q = useQuasar()
const currencyStore = useCurrencyStore()
const authStore = useAuthStore()
const tab = ref('overview')
const loading = ref(false)

// --- LIST OF TUTORS ---
const editDialog = ref(false)
const editingRow = ref({})
const isEditMode = ref(false)

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Tutor Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  { name: 'subjects', align: 'left', label: 'Subjects', field: 'subjects' },
  { name: 'phone', align: 'left', label: 'Contact', field: 'phone' },
  {
    name: 'commission',
    align: 'center',
    label: 'Commission',
    field: 'commission',
    sortable: true,
  },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const rows = ref([])

const fetchTutors = async () => {
  if (!authStore.userOrgId) return

  loading.value = true
  try {
    const { data, error } = await supabase
      .from('tutors')
      .select('*')
      .eq('org_id', authStore.userOrgId)
      .order('created_at', { ascending: false })

    if (error) throw error
    rows.value = data
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error fetching tutors: ' + error.message })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.initialize()
  }
  await fetchTutors()
  await fetchPaymentOverview()
})


watch(() => authStore.userOrgId, async () => {
  await fetchTutors()
  await fetchPaymentOverview()
})

// --- PAYMENTS & DASHBOARD LOGIC ---
const paymentConfirmDialog = ref(false)
const selectedPayment = ref(null)
const tutorPayments = ref([])
const payoutHistory = ref([])

const fetchPaymentOverview = async () => {
  if (!authStore.userOrgId) return
  
  loading.value = true
  try {
    // 1. Get current month range
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    // 2. Fetch all tutors for org
    const { data: tutors } = await supabase
      .from('tutors')
      .select('id, name, commission')
      .eq('org_id', authStore.userOrgId)

    // 3. Fetch all classes for org
    const { data: classes } = await supabase
      .from('classes')
      .select('id, tutor_id')
      .eq('org_id', authStore.userOrgId)

    // 4. Fetch all payments for this month
    const { data: payments } = await supabase
      .from('payments')
      .select('class_id, amount')
      .eq('org_id', authStore.userOrgId)
      .gte('payment_date', firstDay)

    // 5. Fetch recent payouts
    const { data: payouts } = await supabase
      .from('tutor_payouts')
      .select('*')
      .eq('org_id', authStore.userOrgId)
      .order('payout_date', { ascending: false })
      .limit(10)

    payoutHistory.value = payouts.map(p => ({
      ...p,
      tutor: tutors.find(t => t.id === p.tutor_id)?.name || 'Unknown Tutor'
    }))

    // 6. Calculate per-tutor stats
    const processedPayments = tutors.map(tutor => {
      // Find classes for this tutor
      const tutorClasses = classes.filter(c => c.tutor_id === tutor.id).map(c => c.id)
      
      // Sum payments for these classes
      const tutorPaymentsList = payments.filter(p => tutorClasses.includes(p.class_id))
      const totalCollected = tutorPaymentsList.reduce((sum, p) => sum + Number(p.amount), 0)
      const totalClasses = new Set(tutorPaymentsList.map(p => p.class_id)).size
      
      const commissionRate = tutor.commission || 60
      const payableAmount = (totalCollected * commissionRate) / 100

      // Check if already paid this month
      const isPaid = payouts.some(p => p.tutor_id === tutor.id && p.period_month === periodMonth)

      return {
        id: tutor.id,
        tutorId: tutor.id,
        tutorName: tutor.name,
        totalClasses,
        totalCollected,
        commissionRate,
        payableAmount,
        status: isPaid ? 'Paid' : 'Pending'
      }
    })

    tutorPayments.value = processedPayments
  } catch (error) {
    console.error('Error fetching layout:', error)
  } finally {
    loading.value = false
  }
}

const paymentColumns = [
  { name: 'tutorName', label: 'Tutor', field: 'tutorName', align: 'left', sortable: true },
  { name: 'totalClasses', label: 'Classes Taught', field: 'totalClasses', align: 'center' },
  {
    label: `Fees Collected (${currencyStore.currency})`,
    field: 'totalCollected',
    format: (val) => currencyStore.format(val),
    align: 'right',
  },
  {
    name: 'commissionRate',
    label: 'Rate',
    field: (val) => val.commissionRate + '%',
    align: 'center',
  },
  {
    name: 'payableAmount',
    label: `Net Payable (${currencyStore.currency})`,
    field: 'payableAmount',
    format: (val) => currencyStore.format(val),
    align: 'right',
    style: 'font-weight: bold; color: var(--q-primary)',
  },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const payoutHistoryColumns = [
  { name: 'payout_date', label: 'Date', field: 'payout_date', align: 'left' },
  { name: 'tutor', label: 'Tutor', field: 'tutor', align: 'left' },
  {
    name: 'amount',
    label: 'Amount',
    field: 'amount',
    align: 'right',
    format: (val) => currencyStore.format(val),
  },
  { name: 'status', label: 'Status', field: 'status', align: 'right' },
]

// Computed Metrics
const activeTutorsCount = computed(() => rows.value.filter((r) => r.status === 'Active').length)
const totalPendingPayouts = computed(() =>
  tutorPayments.value
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.payableAmount, 0),
)
const totalPaidMonth = computed(() =>
  tutorPayments.value
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.payableAmount, 0),
)
// Chart Logic
const chartOptions = {
  chart: { toolbar: { show: false }, background: 'transparent' },
  stroke: { curve: 'smooth', width: 2 },
  colors: ['#3b82f6'],
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 }
  },
  xaxis: { 
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    labels: { style: { colors: '#9e9e9e' } }
  },
  yaxis: { labels: { style: { colors: '#9e9e9e' } } },
  grid: { borderColor: 'rgba(255,255,255,0.05)' },
  theme: { mode: 'dark' }
}

const chartSeries = computed(() => [{
  name: 'Total Payouts',
  data: [45000, 52000, 38000, 65000, 48000, 72000, totalPaidMonth.value || 0]
}])

const topPerformer = computed(() => {
  const sorted = [...tutorPayments.value].sort((a, b) => b.totalCollected - a.totalCollected)
  return sorted[0] || {}
})

const processPayment = (payment) => {
  selectedPayment.value = payment
  paymentConfirmDialog.value = true
}

const confirmPayment = async () => {
  if (selectedPayment.value) {
    const now = new Date()
    const periodMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    try {
      const { error } = await supabase.from('tutor_payouts').insert({
        tutor_id: selectedPayment.value.tutorId,
        amount: selectedPayment.value.payableAmount,
        period_month: periodMonth,
        org_id: authStore.userOrgId
      })

      if (error) throw error

      $q.notify({
        type: 'positive',
        message: `Payment of ${currencyStore.format(selectedPayment.value.payableAmount)} recorded!`,
      })
      
      // Trigger n8n Digital Invoice Dispatch
      await n8nStore.triggerPayoutInvoice({
        tutor_name: selectedPayment.value.tutorName,
        amount: selectedPayment.value.payableAmount,
        period_month: periodMonth,
        org_id: authStore.userOrgId
      })

      await fetchPaymentOverview()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error processing payout: ' + error.message })
    }
  }
}

// --- TUTOR CRUD ACTIONS ---
const openAddDialog = () => {
  editingRow.value = { status: 'Active', subjects: [], commission: 60 } // Default values
  isEditMode.value = false
  editDialog.value = true
}

const editTutor = (row) => {
  editingRow.value = JSON.parse(JSON.stringify(row)) // Deep copy
  isEditMode.value = true
  editDialog.value = true
}

const saveTutor = async () => {
  try {
    const tutorData = { ...editingRow.value }
    if (!isEditMode.value) delete tutorData.id

    if (authStore.userOrgId) tutorData.org_id = authStore.userOrgId

    const { error } = await supabase.from('tutors').upsert(tutorData).select()

    if (error) throw error

    $q.notify({
      type: 'positive',
      message: isEditMode.value ? 'Tutor updated' : 'Tutor added',
    })
    fetchTutors()
    editDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error saving tutor: ' + error.message })
  }
}

const deleteTutor = (id) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to remove this tutor?',
    cancel: true,
    persistent: true,
    ok: {
      label: 'Delete',
      color: 'negative',
      flat: true,
    },
  }).onOk(async () => {
    try {
      const { error } = await supabase.from('tutors').delete().eq('id', id)
      if (error) throw error
      $q.notify({ type: 'positive', message: 'Tutor removed', icon: 'delete' })
      fetchTutors()
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error deleting: ' + error.message })
    }
  })
}
</script>

<style lang="scss" scoped>
.border-gray {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
body.body--light .border-gray {
  border: 1px solid #eaecf0;
}
</style>
