<template>
  <q-page class="q-pa-lg">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none text-white">Students</h1>
        <p class="text-grey-5 q-mt-xs q-mb-none">Manage student enrollments and details.</p>
      </div>
      <div class="row q-gutter-x-sm no-wrap items-center">
        <!-- Persistent Quick Search -->
        <q-input
          outlined
          v-model="searchQuery"
          placeholder="Search students..."
          dense
          bg-color="white"
          class="q-mr-sm"
          @keyup.enter="fetchStudents"
        >
          <template v-slot:append>
            <q-icon name="search" color="grey-5" />
          </template>
        </q-input>

        <q-btn outline icon="filter_list" label="Advanced Filter" no-caps @click="showFilters = !showFilters" :color="hasActiveFilters ? 'primary' : ''" />
        
        <q-btn
          unelevated
          icon="add"
          color="primary"
          label="New"
          no-caps
          @click="openAddDialog"
        />
        <q-btn
          unelevated
          color="secondary"
          icon="upload_file"
          label="Import"
          hide-label-sm
          no-caps
          @click="openImportDialog"
        />
        <q-btn
          outline
          color="primary"
          icon="download"
          label="Export"
          no-caps
          @click="exportStudents"
        />
      </div>
    </div>

    <!-- Advanced Filter Bar -->
    <q-slide-transition>
      <div v-show="showFilters" class="q-mb-lg">
        <q-card class="no-shadow border-gray bg-transparent q-pa-md">
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-3">
              <q-select
                outlined
                v-model="filterGrade"
                :options="['All Grades', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Grade 13']"
                label="Filter by Grade"
                dense
                bg-color="white"
                @update:model-value="fetchStudents"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                outlined
                v-model="filterStatus"
                :options="['All Status', 'Active', 'Inactive']"
                label="Status"
                dense
                bg-color="white"
                @update:model-value="fetchStudents"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn flat color="grey-5" label="Clear Filters" no-caps @click="resetFilters" />
            </div>
          </div>
        </q-card>
      </div>
    </q-slide-transition>

    <!-- Stats Row -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3">
        <q-card class="no-shadow border-gray q-pa-md bg-transparent">
          <div class="text-caption text-grey-5 text-uppercase text-weight-bold">Total Students</div>
          <div class="text-h4 text-weight-bold q-mt-xs text-white">{{ rows.length }}</div>
        </q-card>
      </div>
    </div>

    <!-- Students Table -->
    <q-card class="no-shadow border-gray bg-transparent">
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- Custom Name Column with Avatar -->
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" class="q-mr-sm" color="blue-1" text-color="primary">
                {{ props.row.name.charAt(0) }}
              </q-avatar>
              <div :class="{ 'blur-text': authStore.isDemo }">
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey-5">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <!-- Status Column -->
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

        <!-- Actions Column -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round dense icon="more_vert" color="grey-5">
              <q-menu class="text-dark">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="editStudent(props.row)">
                    <q-item-section>Edit Details</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="openIdCard(props.row)">
                    <q-item-section>Generate ID Card</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item
                    clickable
                    v-close-popup
                    class="text-red"
                    @click="deleteStudent(props.row.id)"
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

    <!-- Edit/Add Dialog -->
    <q-dialog v-model="editDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditMode ? 'Edit Student Details' : 'Add New Student' }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-y-md">
          <q-input outlined v-model="editingRow.name" label="Student Name" dense />
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
            v-model="editingRow.grade"
            :options="[
              'Grade 6',
              'Grade 7',
              'Grade 8',
              'Grade 9',
              'Grade 10',
              'Grade 11',
              'Grade 12',
              'Grade 13',
            ]"
            label="Grade"
            dense
          />

          <q-select
            outlined
            v-model="editingRow.status"
            :options="['Active', 'Inactive']"
            label="Status"
            dense
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            :label="isEditMode ? 'Save Changes' : 'Add Student'"
            color="primary"
            @click="saveStudent"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Import Dialog -->
    <q-dialog v-model="importDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Import Students from CSV</div>
          <div class="text-caption text-grey-6">
            Upload a CSV file with columns: Name, Email, Phone, Grade.
            <a href="#" class="text-primary cursor-pointer" @click.prevent="downloadTemplate"
              >Download Template</a
            >
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-y-md">
          <q-file
            outlined
            v-model="importFile"
            label="Select CSV File"
            accept=".csv"
            @update:model-value="handleFileUpload"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-separator />

          <div v-if="parsedStudents.length > 0">
            <div class="text-subtitle2 q-mb-sm">
              Preview ({{ parsedStudents.length }} students found)
            </div>
            <q-scroll-area style="height: 200px; border: 1px solid #ddd; border-radius: 4px">
              <q-list separator>
                <q-item v-for="(student, index) in parsedStudents" :key="index">
                  <q-item-section>
                    <q-item-label>{{ student.name }}</q-item-label>
                    <q-item-label caption>
                      {{ student.grade }} | {{ student.email }} | {{ student.phone }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      color="red"
                      @click="removeImportItem(index)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </div>
          <div v-else-if="importFile" class="text-center text-grey q-pa-md">
            No valid data found in file. Please checks your CSV format.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn
            unelevated
            label="Import Students"
            color="primary"
            :disable="parsedStudents.length === 0"
            :loading="loading"
            @click="confirmImport"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- ID Card Generation Dialog -->
    <q-dialog v-model="idCardDialog" class="id-card-dialog-container">
      <q-card style="min-width: 440px; border-radius: 16px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Student ID Card</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-py-md">
          <div class="text-caption text-grey-7 q-mb-sm">Choose ID Template:</div>
          <div class="row q-gutter-sm">
            <q-btn
              v-for="tpl in idTemplates"
              :key="tpl.value"
              unelevated
              :color="selectedTemplate === tpl.value ? 'primary' : 'grey-2'"
              :text-color="selectedTemplate === tpl.value ? 'white' : 'grey-8'"
              :label="tpl.label"
              no-caps
              dense
              class="q-px-md"
              @click="selectedTemplate = tpl.value"
            />
          </div>
        </q-card-section>

        <q-card-section class="flex flex-center q-py-lg bg-grey-1 id-card-print-section">
          <!-- ID CARD PRINT AREA -->
          <div id="print-area" class="print-area">
            <div :class="['id-card-container shadow-10', `id-tpl-${selectedTemplate}`]">
              <!-- TEMPLATE 1: STANDARD -->
              <template v-if="selectedTemplate === 'standard'">
                <div class="id-left">
                  <div class="photo-container">
                    <img
                      v-if="selectedStudentForID?.photo_url"
                      :src="selectedStudentForID.photo_url"
                      class="student-photo"
                    />
                    <div v-else class="photo-fallback flex flex-center">
                      {{ selectedStudentForID?.name.charAt(0) }}
                    </div>
                  </div>
                  <div class="text-weight-bold text-center student-name">
                    {{ selectedStudentForID?.name }}
                  </div>
                  <div class="text-center student-grade">
                    {{ selectedStudentForID?.grade }}
                  </div>
                </div>
                <div class="id-right">
                  <div class="institute-info">
                    <div class="text-h6 text-primary text-weight-bolder" style="line-height: 1">DIGYNEX</div>
                    <div class="text-caption text-grey-8" style="font-size: 8px; letter-spacing: 1px;">EDUCATION ECOSYSTEM</div>
                  </div>
                  <div class="student-details q-mt-md">
                    <div class="detail-item">
                      <div class="label">ID NUMBER</div>
                      <div class="value">{{ String(selectedStudentForID?.id).padStart(5, '0') }}</div>
                    </div>
                    <div class="detail-item q-mt-xs">
                      <div class="label">PARENT CONTACT</div>
                      <div class="value">{{ selectedStudentForID?.phone }}</div>
                    </div>
                  </div>
                  <div class="flex justify-end q-mt-auto">
                    <qrcode-vue 
                      :value="`STUDENT_ID:${selectedStudentForID?.id}\nNAME:${selectedStudentForID?.name}\nGRADE:${selectedStudentForID?.grade}`" 
                      :size="75" 
                      level="H" 
                    />
                  </div>
                </div>
              </template>

              <!-- TEMPLATE 2: UNIVERSITY (Premium Dark) -->
              <template v-else-if="selectedTemplate === 'university'">
                <div class="id-full-dark">
                  <div class="id-header">
                    <div class="header-logo">DIGYNEX</div>
                    <div class="header-tag">MASTER PORTAL</div>
                  </div>
                  <div class="row items-center q-px-lg q-mt-md">
                    <div class="col-4">
                      <div class="photo-container-uni">
                         <img
                          v-if="selectedStudentForID?.photo_url"
                          :src="selectedStudentForID.photo_url"
                          class="student-photo"
                        />
                        <div v-else class="photo-fallback-uni flex flex-center">
                          {{ selectedStudentForID?.name.charAt(0) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-8 q-pl-md">
                      <div class="text-h6 text-white text-weight-bold student-name-uni">{{ selectedStudentForID?.name }}</div>
                      <div class="text-caption text-blue-2">{{ selectedStudentForID?.grade }}</div>
                    </div>
                  </div>
                  <div class="row items-end q-px-lg q-mt-md justify-between">
                    <div>
                      <div class="text-caption text-grey-4" style="font-size: 8px">ID REF</div>
                      <div class="text-white text-weight-bold">#{{ String(selectedStudentForID?.id).padStart(5, '0') }}</div>
                    </div>
                    <div class="qr-bg-white">
                      <qrcode-vue 
                        :value="`STUDENT_ID:${selectedStudentForID?.id}\nNAME:${selectedStudentForID?.name}\nGRADE:${selectedStudentForID?.grade}`" 
                        :size="60" 
                        level="H" 
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- TEMPLATE 3: SIMPLE (Minimalist) -->
              <template v-else>
                <div class="id-simple">
                  <div class="simple-stripe"></div>
                  <div class="row full-height">
                    <div class="col-4 flex flex-center">
                      <div class="photo-container-simple">
                        <img
                          v-if="selectedStudentForID?.photo_url"
                          :src="selectedStudentForID.photo_url"
                          class="student-photo"
                        />
                        <div v-else class="photo-fallback-simple flex flex-center">
                          {{ selectedStudentForID?.name.charAt(0) }}
                        </div>
                      </div>
                    </div>
                    <div class="col-5 q-pa-md flex column justify-center">
                      <div class="text-subtitle1 text-weight-bold text-dark">{{ selectedStudentForID?.name }}</div>
                      <div class="text-caption text-grey-7">{{ selectedStudentForID?.grade }}</div>
                      <div class="text-caption text-primary text-weight-bold q-mt-sm">DIGYNEX LMS</div>
                    </div>
                    <div class="col-3 q-pa-md flex flex-center">
                      <qrcode-vue 
                        :value="`STUDENT_ID:${selectedStudentForID?.id}\nNAME:${selectedStudentForID?.name}\nGRADE:${selectedStudentForID?.grade}`" 
                        :size="80" 
                        level="H" 
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps />
          <q-btn unelevated icon="share" color="secondary" label="WhatsApp" class="q-px-md" no-caps @click="shareOnWhatsApp" />
          <q-btn unelevated icon="print" color="primary" label="Print ID Card" class="q-px-md" no-caps @click="printIDCard" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useQuasar, exportFile } from 'quasar'
import { supabase } from 'boot/supabase'
import { useAuthStore } from 'stores/auth'
import { useRouter, useRoute } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import { useSettingsStore } from 'stores/settings'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const settingsStore = useSettingsStore()

const editDialog = ref(false)
const importDialog = ref(false)
const idCardDialog = ref(false)
const editingRow = ref({})
const isEditMode = ref(false)
const loading = ref(false)

const importFile = ref(null)
const parsedStudents = ref([])
const selectedStudentForID = ref(null)
const selectedTemplate = ref('standard')

// --- ADVANCED FILTERS ---
const showFilters = ref(false)
const searchQuery = ref(route.query.q || '')
const filterGrade = ref('All Grades')
const filterStatus = ref('All Status')

const hasActiveFilters = computed(() => {
  return filterGrade.value !== 'All Grades' || filterStatus.value !== 'All Status' || searchQuery.value !== ''
})

const resetFilters = () => {
  filterGrade.value = 'All Grades'
  filterStatus.value = 'All Status'
  searchQuery.value = ''
  fetchStudents()
}
const idTemplates = [
  { label: 'Standard', value: 'standard' },
  { label: 'University', value: 'university' },
  { label: 'Simple', value: 'simple' },
]

const shareOnWhatsApp = () => {
  $q.notify({ type: 'info', message: 'Generating Image for WhatsApp sharing...' })
  // In a real scenario, we'd use html-to-image or similar and send to n8n
}

const planType = computed(() => authStore.profile?.plan_type || 'free')

const openIdCard = (student) => {
  selectedStudentForID.value = student
  idCardDialog.value = true
}

const printIDCard = async () => {
  if (window.electronAPI) {
    try {
      await window.electronAPI.silentPrint({
        deviceName: settingsStore.printerName,
        printBackground: true
      })
    } catch (err) {
      console.error('Silent print failed:', err)
      window.print()
    }
  } else {
    window.print()
  }
}

const columns = [
  { name: 'name', label: 'Student Name', align: 'left', field: 'name', headerClasses: 'text-grey-4', sortable: true },
  { name: 'grade', align: 'left', label: 'Grade', field: 'grade', sortable: true },
  { name: 'phone', align: 'left', label: 'Contact', field: 'phone' },
  { name: 'status', align: 'left', label: 'Status', field: 'status', sortable: true },
  { name: 'actions', align: 'right', label: '', field: 'actions' },
]

const rows = ref([])

const fetchStudents = async () => {
  if (authStore.isDemo) {
    rows.value = [
      { id: 1, name: 'Lakshami Perera', email: 'lakshami@demo.com', phone: '077-1234567', grade: 'Grade 10', status: 'Active' },
      { id: 2, name: 'Saman Silva', email: 'saman@demo.com', phone: '071-7654321', grade: 'Grade 11', status: 'Active' },
      { id: 3, name: 'Kavindi de Silva', email: 'kavindi@demo.com', phone: '070-8899001', grade: 'Grade 10', status: 'Inactive' },
      { id: 4, name: 'Amila Rajapaksa', email: 'amila@demo.com', phone: '075-1122334', grade: 'Grade 12', status: 'Active' },
      { id: 5, name: 'Ruwan Dissnayake', email: 'ruwan@demo.com', phone: '076-4455667', grade: 'Grade 9', status: 'Active' }
    ]
    return
  }

  if (!authStore.userOrgId) return

  loading.value = true
  try {
    let query = supabase.from('students')
      .select('*')
      .eq('org_id', authStore.userOrgId)
      .order('created_at', { ascending: false })

    // Search Filter
    if (searchQuery.value) {
      query = query.ilike('name', `%${searchQuery.value}%`)
    }

    // Grade Filter
    if (filterGrade.value !== 'All Grades') {
      query = query.eq('grade', filterGrade.value)
    }

    // Status Filter
    if (filterStatus.value !== 'All Status') {
      query = query.eq('status', filterStatus.value)
    }

    const { data, error } = await query

    if (error) throw error
    rows.value = data
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error fetching students: ' + error.message })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!authStore.user) {
    await authStore.initialize()
  }
  await fetchStudents()
})

watch(
  () => [route.query.q, authStore.userOrgId],
  async () => {
    await fetchStudents()
  },
)

const openAddDialog = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('add new students')
    return
  }
  // Check Limit
  if (planType.value === 'free' && rows.value.length >= 10) {
    $q.dialog({
      title: 'Plan Limit Reached',
      message:
        'You have reached the maximum of 10 students allowed on the Free plan. Upgrade to Growth or Pro.',
      ok: { label: 'Upgrade Now', color: 'secondary', push: true },
      cancel: true,
    }).onOk(() => {
      router.push('/subscription')
    })
    return
  }

  if (planType.value === 'growth' && rows.value.length >= 100) {
    $q.dialog({
      title: 'Growth Limit Reached',
      message:
        'You have reached the maximum of 100 students allowed on the Growth plan. Upgrade to Pro for unlimited access.',
      ok: { label: 'Upgrade to Pro', color: 'emerald', push: true },
      cancel: true,
    }).onOk(() => {
      router.push('/subscription')
    })
    return
  }

  editingRow.value = { status: 'Active' }
  isEditMode.value = false
  editDialog.value = true
}

const editStudent = (row) => {
  if (authStore.isDemo) {
    showRegisterPrompt('edit student details')
    return
  }
  editingRow.value = { ...row }
  isEditMode.value = true
  editDialog.value = true
}

const saveStudent = async () => {
  loading.value = true
  try {
    const studentData = { ...editingRow.value }
    // Remove ID if it's new (let DB generate it) or keep it for update
    if (!isEditMode.value) delete studentData.id

    // Assign User ID and Org ID for Multi-tenancy
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      studentData.user_id = user.id
      if (authStore.userOrgId) studentData.org_id = authStore.userOrgId
    }

    const { error } = await supabase.from('students').upsert(studentData).select()

    if (error) throw error

    $q.notify({ type: 'positive', message: isEditMode.value ? 'Student updated' : 'Student added' })
    await fetchStudents() // Refresh list
    editDialog.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error saving student: ' + error.message })
  } finally {
    loading.value = false
  }
}

const deleteStudent = (id) => {
  if (authStore.isDemo) {
    showRegisterPrompt('delete students')
    return
  }
  $q.dialog({
    title: 'Confirm Deletion',
    message: 'Are you sure you want to remove this student? This action cannot be undone.',
    cancel: true,
    persistent: true,
    ok: { label: 'Delete', color: 'negative', flat: true },
  }).onOk(async () => {
    try {
      const { error } = await supabase.from('students').delete().eq('id', id)
      if (error) throw error

      $q.notify({ type: 'positive', message: 'Student removed successfully', icon: 'delete' })
      await fetchStudents() // Refresh list
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Error deleting student: ' + error.message })
    }
  })
}

// --- BULK IMPORT LOGIC ---
const openImportDialog = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('import student data')
    return
  }
  importFile.value = null
  parsedStudents.value = []
  importDialog.value = true
}

const downloadTemplate = () => {
  const content =
    'Name,Email,Phone,Grade\nJohn Doe,john@example.com,0771234567,Grade 10\nJane Smith,jane@example.com,0717654321,Grade 11'
  const status = exportFile('student_import_template.csv', content, 'text/csv')
  if (status === true) {
    $q.notify({ type: 'positive', message: 'Template downloaded. Please fill and upload.' })
  } else {
    $q.notify({ type: 'negative', message: 'Browser denied file download...' })
  }
}

const handleFileUpload = (file) => {
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    parseCSV(text)
  }
  reader.readAsText(file)
}

const parseCSV = (text) => {
  // Simple CSV Parser (Handles comma sep, assumes no commas in values for simplicity first, or standard quotes)
  const lines = text.split(/\r\n|\n/).filter((line) => line.trim() !== '')
  if (lines.length < 2) return

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''))

  const students = []

  for (let i = 1; i < lines.length; i++) {
    // Simple split by comma (NOTE: Doesn't handle commas inside quotes well without regex, but sufficient for simple data)
    const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''))

    if (values.length < headers.length) continue

    const student = {}
    headers.forEach((header, index) => {
      if (header.includes('name')) student.name = values[index]
      if (header.includes('email')) student.email = values[index]
      if (header.includes('phone')) student.phone = values[index]
      if (header.includes('grade')) student.grade = values[index]
    })
    student.status = 'Active' // Default status
    if (student.name) students.push(student)
  }

  parsedStudents.value = students
}

const confirmImport = async () => {
  if (parsedStudents.value.length === 0) return

  loading.value = true

  // Simulating API Call / Supabase Insert
  // In real scenario: const { error } = await supabase.from('students').insert(parsedStudents.value)

  // For now, push to local state
  let newIdStart = Math.max(0, ...rows.value.map((r) => r.id)) + 1

  const newRows = parsedStudents.value.map((s, index) => ({
    id: newIdStart + index,
    ...s,
  }))

  rows.value.push(...newRows)

  loading.value = false
  importDialog.value = false
  $q.notify({
    type: 'positive',
    message: `Successfully imported ${newRows.length} students`,
  })
  parsedStudents.value = []
  importFile.value = null
}

const removeImportItem = (index) => {
  parsedStudents.value.splice(index, 1)
}

const exportStudents = () => {
  if (authStore.isDemo) {
    showRegisterPrompt('export student lists')
    return
  }
  const content = [
    'Name,Email,Phone,Grade,Status',
    ...rows.value.map(
      (r) => `"${r.name}","${r.email || ''}","${r.phone || ''}","${r.grade || ''}","${r.status}"`,
    ),
  ].join('\n')

  const status = exportFile('students_export.csv', content, 'text/csv')
  if (!status) {
    $q.notify({ type: 'negative', message: 'Browser denied file download...' })
  }
}
const showRegisterPrompt = (feature) => {
  $q.dialog({
    title: 'Demo Mode Limitation',
    message: `To ${feature}, please register for a full account. It's free to get started!`,
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
body.body--light .border-left-red {
  border-left: 4px solid #ef4444;
}

.blur-text {
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
}
/* ID Card Tool - Premium Styles */
.id-card-container {
  width: 450px;
  height: 260px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  border: 1px solid rgba(0,0,0,0.05);
}

.id-card-container::after {
  content: '';
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.05) 50%, transparent 55%);
  transform: rotate(30deg);
  pointer-events: none;
}

/* Template 1: Standard */
.id-tpl-standard .id-left {
  width: 40%;
  background: #1976d2 !important;
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%) !important;
  color: white; padding: 20px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.id-tpl-standard .photo-container {
  width: 110px; height: 110px; border-radius: 50%; border: 4px solid white;
  background: rgba(255,255,255,0.2); overflow: hidden; margin-bottom: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
.id-tpl-standard .student-photo {
  width: 100%; height: 100%; object-fit: cover;
}
.id-tpl-standard .photo-fallback {
  width: 100%; height: 100%; font-size: 42px; font-weight: bold;
  background: rgba(0,0,0,0.1);
}
.id-tpl-standard .student-name { font-size: 16px; font-weight: 800; line-height: 1.2; text-transform: uppercase; }
.id-tpl-standard .student-grade { font-size: 13px; opacity: 0.9; margin-top: 4px; }
.id-tpl-standard .id-right { width: 60%; padding: 25px; display: flex; flex-direction: column; background: white; }
.id-tpl-standard .detail-item .label { font-size: 9px; color: #757575; font-weight: 800; letter-spacing: 0.5px; }
.id-tpl-standard .detail-item .value { font-size: 14px; font-weight: 700; color: #1a1a1a; }

/* Template 2: University */
.id-tpl-university { background: #0a0f1c !important; -webkit-print-color-adjust: exact; }
.id-tpl-university .id-full-dark { width: 100%; height: 100%; position: relative; }
.id-tpl-university .id-header {
  height: 55px;
  background: #1e293b !important;
  background: linear-gradient(90deg, #1e293b 0%, #0f172a 100%) !important;
  display: flex; align-items: center; justify-content: space-between; padding: 0 25px;
}
.id-tpl-university .header-logo { color: #f8fafc; font-weight: 900; letter-spacing: 3px; font-size: 18px; }
.id-tpl-university .header-tag { font-size: 10px; color: #3b82f6; font-weight: bold; }
.id-tpl-university .photo-container-uni {
  width: 90px; height: 90px; border-radius: 14px; border: 3px solid #3b82f6; overflow: hidden;
}
.id-tpl-university .photo-fallback-uni { width: 100%; height: 100%; background: #1e293b; color: white; font-size: 32px; }
.id-tpl-university .qr-bg-white { background: white; padding: 6px; border-radius: 8px; }

/* Template 3: Simple */
.id-tpl-simple .simple-stripe {
  position: absolute; left: 0; top: 0; width: 8px; height: 100%; background: #1976d2 !important; -webkit-print-color-adjust: exact;
}
.id-tpl-simple .photo-container-simple {
  width: 100px; height: 100px; border-radius: 10px; background: #f0f4f8; overflow: hidden;
}
.id-tpl-simple .photo-fallback-simple { width: 100%; height: 100%; color: #1976d2; font-size: 36px; }

@media print {
  /* 🛑 NUCLEAR OPTION: Hide EVERYTHING */
  #q-app, 
  .q-layout, 
  .q-header, 
  .q-footer, 
  .q-drawer, 
  .q-page-container,
  .q-dialog__backdrop,
  .q-notifications,
  .q-card-actions,
  .id-card-dialog-container .q-card-section:not(.id-card-print-section),
  .q-btn,
  header, 
  aside,
  footer,
  [class*="chat"], [class*="bubble"], [class*="widget"] {
    display: none !important;
    opacity: 0 !important;
  }

  body, html {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    height: auto !important;
  }

  /* 🎯 ISOLATE ONLY THE PRINT SECTION */
  .id-card-dialog-container {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    display: block !important;
  }

  .id-card-dialog-container .q-dialog__inner {
    padding: 0 !important;
    display: block !important;
    background: white !important;
  }

  .id-card-dialog-container .q-card {
    box-shadow: none !important;
    border: none !important;
    background: white !important;
    display: block !important;
    width: 100% !important;
  }

  .id-card-print-section {
    background: white !important;
    padding: 20mm 0 !important; /* Center on page for many printers */
    display: flex !important;
    justify-content: center !important;
    align-items: flex-start !important;
    visibility: visible !important;
  }

  #print-area {
    display: block !important;
    visibility: visible !important;
    margin: 0 auto !important;
    width: 450px !important;
    background: white !important;
  }

  /* Ensure card itself is clean */
  .id-card-container {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  .id-left, .id-right, .id-full-dark, .id-simple, .row {
    display: flex !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
