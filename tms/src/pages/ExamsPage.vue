<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none text-white">Exam & Results</h1>
        <p class="text-grey-6 q-mt-xs q-mb-none">Schedule exams and enter marks.</p>
      </div>
      <div>
        <q-btn
          unelevated
          icon="add"
          color="primary"
          label="New Exam"
          no-caps
          @click="newExamDialog = true"
        />
      </div>
    </div>

    <!-- Exam List -->
    <q-card class="no-shadow border-gray q-mb-lg">
      <q-card-section>
        <div class="text-subtitle1 text-weight-bold">Scheduled Exams</div>
      </q-card-section>

      <q-table :rows="exams" :columns="examColumns" row-key="id" flat bordered>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="props.row.released_at ? 'green' : 'grey-7'"
              :label="props.row.released_at ? 'Released' : 'Draft'"
              outline
            />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <div class="row q-gutter-xs">
              <q-btn flat round dense icon="edit" color="blue" @click="enterMarks(props.row)">
                <q-tooltip>Enter Marks</q-tooltip>
              </q-btn>
              <q-btn flat round dense icon="delete" color="red" @click="deleteExam(props.row.id)" />
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Marks Entry Dialog -->
    <q-dialog
      v-model="marksDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-toolbar class="bg-primary text-white">
          <q-btn flat round dense icon="arrow_back" v-close-popup />
          <q-toolbar-title>Enter Marks: {{ selectedExam?.name }}</q-toolbar-title>
          <q-btn 
            flat 
            label="Release results" 
            icon="send" 
            class="q-mr-sm"
            @click="releaseResults" 
            :loading="releasingResults"
          >
            <q-tooltip>Notify parents via WhatsApp</q-tooltip>
          </q-btn>
          <q-btn flat label="Save All" @click="saveResults" :loading="savingResults" />
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-lg justify-center">
            <div class="col-12 col-md-8">
              <div v-if="loadingStudents" class="text-center q-pa-lg">
                <q-spinner size="3em" color="primary" />
              </div>

              <q-list separator bordered class="rounded-borders" v-else>
                <q-item class="bg-grey-2 text-weight-bold">
                  <q-item-section>Student Name</q-item-section>
                  <q-item-section style="max-width: 150px">Marks</q-item-section>
                  <q-item-section side>Grade</q-item-section>
                  <q-item-section class="q-ml-md">Teacher's Note / Remarks</q-item-section>
                </q-item>

                <q-item v-for="stu in studentResults" :key="stu.student_id">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ stu.student_name }}</q-item-label>
                    <q-item-label caption>{{ stu.student_id }}</q-item-label>
                  </q-item-section>

                  <q-item-section style="max-width: 150px">
                    <q-input
                      dense
                      outlined
                      v-model.number="stu.marks"
                      type="number"
                      placeholder="Score"
                      :max="selectedExam?.total_marks"
                      @update:model-value="(val) => calculateGrade(stu, val)"
                    />
                  </q-item-section>

                  <q-item-section side>
                    <q-badge :color="getGradeColor(stu.grade)" class="text-subtitle2 q-pa-xs" style="width: 30px; text-align: center">
                      {{ stu.grade || '-' }}
                    </q-badge>
                  </q-item-section>

                  <q-item-section class="q-ml-md">
                    <q-input
                      dense
                      outlined
                      v-model="stu.remarks"
                      placeholder="Add a personal note..."
                      autogrow
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- New Exam Dialog -->
    <q-dialog v-model="newExamDialog">
      <q-card style="min-width: 400px">
        <q-card-section><div class="text-h6">Schedule New Exam</div></q-card-section>
        <q-card-section class="q-pt-none q-gutter-y-md">
          <q-input outlined v-model="examForm.name" label="Exam Name (e.g. Term Test 1)" dense />
          <q-select
            outlined
            v-model="examForm.class_id"
            :options="classOptions"
            option-label="name"
            option-value="id"
            label="Class"
            dense
            emit-value
            map-options
          />
          <q-input outlined v-model="examForm.date" type="date" label="Date" dense />
          <q-input
            outlined
            v-model="examForm.total_marks"
            type="number"
            label="Total Marks"
            dense
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            unelevated
            label="Create"
            color="primary"
            @click="createExam"
            :loading="creatingExam"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'boot/supabase'
import { useN8nStore } from 'stores/n8n'

const n8nStore = useN8nStore()
const $q = useQuasar()
const exams = ref([])
const classOptions = ref([])
const userOrgId = ref(null)

const newExamDialog = ref(false)
const marksDialog = ref(false)
const selectedExam = ref(null)

const creatingExam = ref(false)
const loadingStudents = ref(false)
const savingResults = ref(false)
const releasingResults = ref(false)

const studentResults = ref([]) // Local state for marks entry

const examForm = ref({
  name: '',
  class_id: null,
  date: new Date().toISOString().slice(0, 10),
  total_marks: 100,
})

const examColumns = [
  { name: 'name', label: 'Exam Name', field: 'name', align: 'left', sortable: true },
  { name: 'class', label: 'Class', field: (row) => row.classes?.name, align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { 
    name: 'status', 
    label: 'Status', 
    field: (row) => row.released_at ? 'Released' : 'Draft', 
    align: 'center' 
  },
  { name: 'actions', label: '', field: 'actions', align: 'right' },
]

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('org_id').eq('id', user.id).single()
    if (profile) userOrgId.value = profile.org_id
  }
  fetchExams()
  fetchClasses()
})

const fetchExams = async () => {
  if (!userOrgId.value) return
  const { data } = await supabase
    .from('exams')
    .select('*, classes(name)')
    .eq('org_id', userOrgId.value)
    .order('date', { ascending: false })
  if (data) exams.value = data
}

const fetchClasses = async () => {
  if (!userOrgId.value) return
  const { data } = await supabase.from('classes')
    .select('id, name, grade')
    .eq('status', 'Active')
    .eq('org_id', userOrgId.value)
  if (data) classOptions.value = data
}

const createExam = async () => {
  creatingExam.value = true
  const examData = { ...examForm.value, org_id: userOrgId.value }
  const { error } = await supabase.from('exams').insert([examData])
  if (error) {
    $q.notify({ type: 'negative', message: error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Exam scheduled' })
    fetchExams()
    newExamDialog.value = false
    // Reset
    examForm.value = {
      name: '',
      class_id: null,
      date: new Date().toISOString().slice(0, 10),
      total_marks: 100,
    }
  }
  creatingExam.value = false
}

const enterMarks = async (exam) => {
  selectedExam.value = exam
  marksDialog.value = true
  loadingStudents.value = true

  // 1. Get Students for Class
  const classInfo = classOptions.value.find((c) => c.id === exam.class_id)
  if (!classInfo) {
    loadingStudents.value = false
    return
  }

  const { data: students } = await supabase
    .from('students')
    .select('id, name')
    .eq('grade', classInfo.grade)
    .eq('status', 'Active')
    .eq('org_id', userOrgId.value)

  // 2. Get Existing Marks
  const { data: results } = await supabase.from('exam_results')
    .select('*')
    .eq('exam_id', exam.id)
    .eq('org_id', userOrgId.value)

  // 3. Merge
  studentResults.value = students.map((s) => {
    const res = results ? results.find((r) => r.student_id === s.id) : null
    return {
      student_id: s.id,
      student_name: s.name,
      marks: res ? res.marks : null,
      grade: res ? res.grade : null,
      remarks: res ? res.remarks : '',
      result_id: res ? res.id : null,
    }
  })

  loadingStudents.value = false
}

const calculateGrade = (student, marks) => {
  if (marks === null || marks === '') {
    student.grade = null
    return
  }
  const m = Number(marks)
  const total = selectedExam.value.total_marks || 100
  const percentage = (m / total) * 100

  if (percentage >= 75) student.grade = 'A'
  else if (percentage >= 65) student.grade = 'B'
  else if (percentage >= 50) student.grade = 'C'
  else if (percentage >= 35) student.grade = 'S'
  else student.grade = 'W'
}

const getGradeColor = (grade) => {
  switch (grade) {
    case 'A':
      return 'green'
    case 'B':
      return 'blue'
    case 'C':
      return 'orange'
    case 'S':
      return 'grey-7'
    case 'W':
      return 'red'
    default:
      return 'grey-4'
  }
}

const saveResults = async () => {
  savingResults.value = true

  const upsertData = studentResults.value
    .filter((s) => s.marks !== null && s.marks !== '')
    .map((s) => ({
      exam_id: selectedExam.value.id,
      student_id: s.student_id,
      marks: s.marks,
      grade: s.grade,
      remarks: s.remarks,
      org_id: userOrgId.value
    }))

  if (upsertData.length === 0) {
    savingResults.value = false
    return
  }

  const { error } = await supabase
    .from('exam_results')
    .upsert(upsertData, { onConflict: 'exam_id, student_id' })

  if (error) {
    $q.notify({ type: 'negative', message: error.message })
  } else {
    $q.notify({ type: 'positive', message: 'Results saved successfully' })
    marksDialog.value = false
  }
  savingResults.value = false
}

const releaseResults = async () => {
  if (!selectedExam.value || studentResults.value.length === 0) return

  $q.dialog({
    title: 'Release Results',
    message: `Are you sure you want to send WhatsApp reports for "${selectedExam.value.name}" to all parents?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    releasingResults.value = true
    try {
      // 1. Get Exam Month range
      const examDate = new Date(selectedExam.value.date)
      const year = examDate.getFullYear()
      const month = examDate.getMonth()
      const startOfMonth = new Date(year, month, 1).toISOString()
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).toISOString()

      // 2. Fetch Attendance Stats for this month & class
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('org_id', userOrgId.value)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      const { data: studentsInfo } = await supabase
        .from('students')
        .select('id, parent_phone, phone')
        .eq('org_id', userOrgId.value)
        .in('id', studentResults.value.map(s => s.student_id))

      // 3. Process Data for n8n
      const reports = studentResults.value.map(res => {
        const studentAtt = attendanceData?.filter(a => a.student_id === res.student_id) || []
        const studentInfo = studentsInfo?.find(s => s.id === res.student_id)
        
        return {
          student_name: res.student_name,
          parent_phone: studentInfo?.parent_phone || studentInfo?.phone || '',
          marks: res.marks,
          grade: res.grade,
          remarks: res.remarks,
          exam_total: selectedExam.value.total_marks,
          attendance: {
            present: studentAtt.filter(a => a.status === 'Present').length,
            late: studentAtt.filter(a => a.status === 'Late').length,
            absent: studentAtt.filter(a => a.status === 'Absent').length
          }
        }
      })

      // 4. Trigger n8n
      const success = await n8nStore.triggerPerformanceReport({
        exam_name: selectedExam.value.name,
        month: examDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
        students: reports,
        org_id: userOrgId.value
      })

      if (success) {
        // Update exam as released
        await supabase
          .from('exams')
          .update({ released_at: new Date().toISOString() })
          .eq('id', selectedExam.value.id)
        
        $q.notify({ type: 'positive', message: 'Performance reports dispatched to n8n!' })
        fetchExams() // Refresh list
        marksDialog.value = false
      } else {
        throw new Error('Webhook rejected the request')
      }
    } catch (error) {
      console.error('Release failed:', error)
      $q.notify({ type: 'negative', message: 'Failed to release: ' + error.message })
    } finally {
      releasingResults.value = false
    }
  })
}

const deleteExam = (id) => {
  if (!confirm('Delete this exam and all its results?')) return
  supabase
    .from('exams')
    .delete()
    .eq('id', id)
    .then(({ error }) => {
      if (!error) {
        fetchExams()
        $q.notify('Deleted')
      }
    })
}
</script>

<style lang="scss" scoped>
.border-gray {
  border: 1px solid #eaecf0;
}
</style>
