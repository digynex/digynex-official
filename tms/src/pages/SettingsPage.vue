<template>
  <q-page class="q-pa-lg">
    <div class="row items-center justify-between q-mb-lg">
      <div class="col">
        <h1 class="text-h5 text-weight-bold q-my-none text-dark">System Settings</h1>
        <p class="text-grey-6 q-mt-xs q-mb-none">
          Configure your application preferences and system defaults.
        </p>
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Settings Navigation -->
      <div class="col-12 col-md-3">
        <q-card class="no-shadow border-gray">
          <q-tabs
            v-model="tab"
            vertical
            class="text-grey-7"
            active-color="primary"
            active-bg-color="blue-1"
            indicator-color="primary"
            align="left"
          >
            <q-tab name="general" icon="tune" label="General" class="justify-start q-pl-md" />
            <q-tab
              name="subscription"
              icon="star"
              label="Subscription"
              class="justify-start q-pl-md"
            />
            <q-tab
              name="notifications"
              icon="notifications"
              label="Notifications"
              class="justify-start q-pl-md"
            />
            <q-tab name="security" icon="security" label="Security" class="justify-start q-pl-md" />
            <q-tab
              name="data"
              icon="cloud_download"
              label="Data Management"
              class="justify-start q-pl-md"
            />
            <q-tab name="audit" icon="history" label="Audit Logs" class="justify-start q-pl-md" />
            <q-tab name="team" icon="groups" label="Team Members" class="justify-start q-pl-md" />
            <q-tab name="devices" icon="print" label="Devices & Hardware" class="justify-start q-pl-md" />
          </q-tabs>
        </q-card>
      </div>

      <!-- Settings Content -->
      <div class="col-12 col-md-9">
        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="fade"
          transition-next="fade"
          class="bg-transparent"
        >
          <!-- General System Settings -->
          <q-tab-panel name="general" class="q-pa-none">
            <q-card class="no-shadow border-gray q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Institute Information</div>
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input outlined v-model="general.name" label="Institute Name" dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined v-model="general.email" label="Contact Email" dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input outlined v-model="general.phone" label="Main Phone Number" dense />
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      outlined
                      v-model="general.currency"
                      :options="['SEK', 'LKR', 'USD']"
                      label="Currency"
                      dense
                      @update:model-value="updateCurrency"
                    />
                  </div>
                </div>
              </q-card-section>
              <q-card-actions align="right" class="q-pa-md">
                <q-btn
                  unelevated
                  color="primary"
                  label="Save Changes"
                  no-caps
                  :loading="saving"
                  @click="saveGeneralSettings"
                />
              </q-card-actions>
            </q-card>

            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Appearance</div>
                <div class="row items-center justify-between q-py-sm">
                  <div>
                    <div class="text-subtitle2">Dark Mode</div>
                    <div class="text-caption text-grey-6">
                      Switch between light and dark themes.
                    </div>
                  </div>
                  <q-toggle v-model="general.darkMode" color="primary" />
                </div>
                <q-separator spaced />
                <div class="row items-center justify-between q-py-sm">
                  <div>
                    <div class="text-subtitle2">Compact Sidebar</div>
                    <div class="text-caption text-grey-6">Show icons only in sidebar.</div>
                  </div>
                  <q-toggle v-model="general.compactSidebar" color="primary" />
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Subscription / Upgrade Plan -->
          <q-tab-panel name="subscription" class="q-pa-none">
            <q-card class="no-shadow border-gray q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold">Current Plan</div>
                <div class="q-mt-sm row items-center">
                  <q-badge color="grey-7" class="q-px-sm q-py-xs text-body2">FREE TIER</q-badge>
                  <div class="text-caption text-grey-6 q-ml-md">Valid until: Forever</div>
                </div>
              </q-card-section>
            </q-card>

            <div class="row q-col-gutter-md">
              <!-- Free Plan -->
              <div class="col-12 col-md-6">
                <q-card class="no-shadow border-gray h-full">
                  <q-card-section class="q-pa-lg">
                    <div class="text-h5 text-weight-bold">Free</div>
                    <div class="text-h4 text-primary q-my-md">
                      {{ currencyStore.format(0) }} <span class="text-body1 text-grey">/mo</span>
                    </div>
                    <q-separator class="q-my-md" />
                    <q-list dense>
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green" /></q-item-section
                        ><q-item-section>Unlimited Students</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green" /></q-item-section
                        ><q-item-section>Basic Attendance Marking</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green" /></q-item-section
                        ><q-item-section>Manual Payments</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar><q-icon name="close" color="grey" /></q-item-section
                        ><q-item-section class="text-grey"
                          >SMS Notifications</q-item-section
                        ></q-item
                      >
                      <q-item
                        ><q-item-section avatar><q-icon name="close" color="grey" /></q-item-section
                        ><q-item-section class="text-grey">Cloud Backup</q-item-section></q-item
                      >
                    </q-list>
                  </q-card-section>
                  <q-card-actions class="q-pa-lg">
                    <q-btn outline class="full-width" label="Current Plan" disable color="grey" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Pro Plan -->
              <div class="col-12 col-md-6">
                <q-card
                  class="no-shadow border-gray bg-primary text-white h-full relative-position"
                >
                  <q-badge color="orange" floating class="q-pa-xs">POPULAR</q-badge>
                  <q-card-section class="q-pa-lg">
                    <div class="text-h5 text-weight-bold">Pro</div>
                    <div class="text-h4 text-white q-my-md">
                      {{ currencyStore.format(currencyStore.proPrice) }}
                      <span class="text-body1 text-blue-2">/mo</span>
                    </div>
                    <q-separator color="blue-4" class="q-my-md" />
                    <q-list dense dark>
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green-2" /></q-item-section
                        ><q-item-section>Everything in Free</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green-2" /></q-item-section
                        ><q-item-section>Real-time SMS Alerts</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green-2" /></q-item-section
                        ><q-item-section>Automated Email Reports</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green-2" /></q-item-section
                        ><q-item-section>Daily Cloud Backups</q-item-section></q-item
                      >
                      <q-item
                        ><q-item-section avatar
                          ><q-icon name="check" color="green-2" /></q-item-section
                        ><q-item-section>Advanced Analytics</q-item-section></q-item
                      >
                    </q-list>
                  </q-card-section>
                  <q-card-actions class="q-pa-lg">
                    <q-btn
                      unelevated
                      class="full-width bg-white text-primary text-weight-bold"
                      label="Upgrade Now"
                    />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </q-tab-panel>

          <!-- Notifications Settings -->
          <q-tab-panel name="notifications" class="q-pa-none">
            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Email Notifications</div>
                <div
                  class="q-banner bg-orange-1 text-orange-9 q-pa-sm rounded-borders q-mb-md flex items-center"
                >
                  <q-icon name="lock" size="sm" class="q-mr-sm" />
                  Upgrade to Pro to enable automated email notifications.
                </div>
                <q-list>
                  <q-item tag="label" v-ripple class="opacity-50">
                    <q-item-section>
                      <q-item-label
                        >New Student Registration
                        <q-badge color="orange" align="top">PRO</q-badge></q-item-label
                      >
                      <q-item-label caption>Receive email when a new student applies.</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle color="primary" v-model="notifications.newStudent" disable />
                    </q-item-section>
                  </q-item>

                  <q-separator spaced />

                  <q-item tag="label" v-ripple class="opacity-50">
                    <q-item-section>
                      <q-item-label
                        >Payment Confirmation
                        <q-badge color="orange" align="top">PRO</q-badge></q-item-label
                      >
                      <q-item-label caption>Receive email for successful payments.</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle color="primary" v-model="notifications.payments" disable />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">SMS Notifications</div>
                <div
                  class="q-banner bg-orange-1 text-orange-9 q-pa-sm rounded-borders q-mb-md flex items-center"
                >
                  <q-icon name="lock" size="sm" class="q-mr-sm" />
                  Upgrade to Pro to enable SMS alerts.
                </div>
                <q-list>
                  <q-item tag="label" v-ripple class="opacity-50">
                    <q-item-section>
                      <q-item-label
                        >Attendance SMS
                        <q-badge color="orange" align="top">PRO</q-badge></q-item-label
                      >
                      <q-item-label caption
                        >Send SMS to parents when student is absent.</q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-toggle color="primary" v-model="notifications.smsAttendance" disable />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Security Placeholder -->
          <q-tab-panel name="security" class="q-pa-none">
            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Security Preferences</div>
                <q-banner class="bg-blue-1 text-primary rounded-borders q-mb-md">
                  <template v-slot:avatar>
                    <q-icon name="shield" size="md" />
                  </template>
                  Two-Factor Authentication (2FA) adds an extra layer of security to your account.
                  <template v-slot:action>
                    <q-btn flat label="Enable 2FA" />
                  </template>
                </q-banner>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Audit Logs -->
          <q-tab-panel name="audit" class="q-pa-none">
            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Audit Logs</div>
                <p class="text-grey-7">
                  Track all important system activities and security events.
                </p>
              </q-card-section>
              <q-table :rows="auditRows" :columns="auditColumns" row-key="id" flat>
                <template v-slot:body-cell-severity="props">
                  <q-td :props="props">
                    <q-badge :color="props.row.severity === 'High' ? 'red' : 'green'">
                      {{ props.row.severity }}
                    </q-badge>
                  </q-td>
                </template>
              </q-table>
            </q-card>
          </q-tab-panel>

          <!-- Data Management -->
          <q-tab-panel name="data" class="q-pa-none">
            <q-card class="no-shadow border-gray q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Data Backup & Export</div>

                <div
                  class="q-banner bg-orange-1 text-orange-9 q-pa-sm rounded-borders q-mb-md flex items-center q-mt-md"
                >
                  <q-icon name="lock" size="sm" class="q-mr-sm" />
                  <span class="text-weight-bold">Automated Cloud Backup</span> is available on the
                  Pro Plan.
                  <q-btn
                    flat
                    dense
                    label="Upgrade"
                    class="q-ml-sm"
                    size="sm"
                    @click="tab = 'subscription'"
                  />
                </div>

                <p class="text-grey-7 q-mb-none">
                  Manual exports are always free. You can export your data tables as CSV files for
                  local safekeeping.
                </p>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <div class="text-subtitle1 text-weight-bold q-mb-md">Export Data Tables</div>
                <div class="row q-gutter-md">
                  <q-btn
                    outline
                    icon="school"
                    label="Export Students"
                    color="primary"
                    @click="exportData('students')"
                    :loading="exporting === 'students'"
                  />
                  <q-btn
                    outline
                    icon="payments"
                    label="Export Payments"
                    color="green"
                    @click="exportData('payments')"
                    :loading="exporting === 'payments'"
                  />
                  <q-btn
                    outline
                    icon="co_present"
                    label="Export Tutors"
                    color="orange"
                    @click="exportData('tutors')"
                    :loading="exporting === 'tutors'"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <!-- Team Placeholder -->
          <q-tab-panel name="team" class="q-pa-none">
            <q-card class="no-shadow border-gray flex flex-center column q-pa-xl">
              <q-icon name="groups" size="60px" color="grey-4" />
              <div class="text-h6 text-grey-7 q-mt-md">Team Management coming soon</div>
            </q-card>
          </q-tab-panel>

          <!-- Devices & Hardware -->
          <q-tab-panel name="devices" class="q-pa-none">
            <q-card class="no-shadow border-gray q-mb-md">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Thermal Printer Settings</div>
                <p class="text-grey-7">Specify the system name of your thermal printer for silent printing.</p>
                <div class="row q-col-gutter-md items-center">
                  <div class="col-12 col-md-6">
                    <q-select 
                      v-if="isElectron"
                      outlined 
                      v-model="deviceSettings.printerName" 
                      :options="printerOptions"
                      label="Select Thermal Printer" 
                      dense 
                    >
                      <template v-slot:prepend>
                        <q-icon name="print" />
                      </template>
                    </q-select>
                    <q-input 
                      v-else
                      outlined 
                      v-model="deviceSettings.printerName" 
                      label="Printer System Name (e.g. POS-80)" 
                      placeholder="Enter printer name exactly as in Windows"
                      dense 
                    >
                      <template v-slot:prepend>
                        <q-icon name="print" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-md-6">
                    <div class="text-caption text-grey-6">
                      {{ isElectron ? 'Select your primary printer for silent receipt printing.' : 'In Browser, please specify your printer name. List available in Desktop App.' }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card class="no-shadow border-gray">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-sm">Scanning Preferences</div>
                <div class="row items-center justify-between q-py-sm">
                  <div>
                    <div class="text-subtitle2">Enable Camera Scanning</div>
                    <div class="text-caption text-grey-6">
                      Use laptop/mobile camera to scan QR codes for attendance.
                    </div>
                  </div>
                  <q-toggle v-model="deviceSettings.useCameraScan" color="primary" />
                </div>
              </q-card-section>
              <q-card-actions align="right" class="q-pa-md">
                <q-btn
                  unelevated
                  color="primary"
                  label="Update Device Settings"
                  no-caps
                  @click="saveDeviceSettings"
                />
              </q-card-actions>
            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from 'boot/supabase'
import { exportFile, useQuasar } from 'quasar'
import { useCurrencyStore } from 'stores/currency'
import { useSettingsStore } from 'stores/settings'

const $q = useQuasar()
const currencyStore = useCurrencyStore()
const settingsStore = useSettingsStore()
const exporting = ref('')
const saving = ref(false)

const tab = ref('general')

const isElectron = ref(window && window.process && window.process.type)
const printerOptions = ref([])

const deviceSettings = ref({
  printerName: settingsStore.printerName,
  useCameraScan: settingsStore.useCameraScan
})

const fetchPrinters = async () => {
  if (isElectron.value && window.myAPI && window.myAPI.getPrinters) {
    try {
      const printers = await window.myAPI.getPrinters()
      printerOptions.value = printers.map(p => p.name)
    } catch (e) {
      console.error('Failed to fetch printers', e)
    }
  }
}

const general = ref({
  name: '',
  email: '',
  phone: '',
  currency: currencyStore.currency,
  darkMode: false,
  compactSidebar: false,
})

const saveDeviceSettings = () => {
  settingsStore.setPrinterName(deviceSettings.value.printerName)
  settingsStore.setCameraScanMode(deviceSettings.value.useCameraScan)
  $q.notify({
    type: 'positive',
    message: 'Hardware preferences saved!',
    position: 'top'
  })
}

onMounted(async () => {
  await fetchPrinters()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    general.value.email = user.email
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (profile) {
      general.value.name = profile.name || ''
      if (profile.country_code) {
        currencyStore.setCountryCode(profile.country_code)
        general.value.currency = currencyStore.currency
      }
    }
  }
})

const updateCurrency = (curr) => {
  let countryCode = 'US'
  if (curr === 'SEK') countryCode = 'SE'
  if (curr === 'LKR') countryCode = 'LK'
  currencyStore.setCountryCode(countryCode)
}

const saveGeneralSettings = async () => {
  saving.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let countryCode = 'US'
    if (general.value.currency === 'SEK') countryCode = 'SE'
    if (general.value.currency === 'LKR') countryCode = 'LK'

    const { error } = await supabase
      .from('profiles')
      .update({
        country_code: countryCode,
        name: general.value.name,
      })
      .eq('id', user.id)

    if (error) throw error

    currencyStore.setCountryCode(countryCode)

    $q.notify({
      type: 'positive',
      message: 'System settings synchronized successfully.',
      icon: 'sync'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to save settings: ' + error.message
    })
  } finally {
    saving.value = false
  }
}

const notifications = ref({
  newStudent: true,
  payments: true,
  updates: false,
})

// --- AUDIT LOGS ---
const auditColumns = [
  { name: 'date', label: 'Date & Time', field: 'date', align: 'left', sortable: true },
  { name: 'user', label: 'User', field: 'user', align: 'left', sortable: true },
  { name: 'action', label: 'Action', field: 'action', align: 'left' },
  { name: 'details', label: 'Details', field: 'details', align: 'left' },
  { name: 'severity', label: 'Severity', field: 'severity', align: 'center' },
]
const auditRows = ref([
  {
    id: 1,
    date: '2026-02-10 08:30 AM',
    user: 'Admin User',
    action: 'Login',
    details: 'Successful login from IP 192.168.1.5',
    severity: 'Low',
  },
  {
    id: 2,
    date: '2026-02-10 09:15 AM',
    user: 'Admin User',
    action: 'Create Student',
    details: 'Added new student: Kasun Perera',
    severity: 'Normal',
  },
  {
    id: 3,
    date: '2026-02-10 09:45 AM',
    user: 'Manager',
    action: 'Payment',
    details: `Collected ${currencyStore.format(2500)} from Kasun Perera`,
    severity: 'Normal',
  },
  {
    id: 4,
    date: '2026-02-09 02:00 PM',
    user: 'Admin User',
    action: 'Delete Class',
    details: 'Deleted Grade 9 Science Class',
    severity: 'High',
  },
])

const exportData = async (table) => {
  exporting.value = table
  try {
    const { data, error } = await supabase.from(table).select('*')
    if (error) throw error

    if (!data || data.length === 0) {
      $q.notify({ type: 'warning', message: 'No data to export' })
      exporting.value = ''
      return
    }

    // Convert to CSV
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((fieldName) => {
            let val = row[fieldName] === null ? '' : row[fieldName]
            // Escape quotes and wrap in quotes if contains comma
            if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
              val = `"${val.replace(/"/g, '""')}"`
            }
            return val
          })
          .join(','),
      ),
    ].join('\r\n')

    const status = exportFile(
      `${table}_export_${new Date().toISOString().slice(0, 10)}.csv`,
      csvContent,
      'text/csv',
    )

    if (status === true) {
      $q.notify({ type: 'positive', message: 'Export successful' })
    } else {
      $q.notify({ type: 'negative', message: 'Browser denied file download' })
    }
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Export failed: ' + e.message })
  }
  exporting.value = ''
}
</script>

<style lang="scss" scoped>
.border-gray {
  border: 1px solid #eaecf0;
}
</style>
