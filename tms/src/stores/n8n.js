import { defineStore } from 'pinia'
import axios from 'axios'

export const useN8nStore = defineStore('n8n', {
  state: () => ({
    webhookUrl: 'https://n8n.digynex.se/webhook/tms-automation', // Base UI Webhook
    attendanceWebhook: 'https://n8n.digynex.se/webhook/attendance-alert',
    feeReminderWebhook: 'https://n8n.digynex.se/webhook/fee-reminders',
    payoutInvoiceWebhook: 'https://n8n.digynex.se/webhook/payout-invoice',
  }),

  actions: {
    async triggerAttendanceAlert(student, session) {
      if (!student.phone && !student.parent_phone) return

      try {
        await axios.post(this.attendanceWebhook, {
          type: 'ATTENDANCE_ALERT',
          student_name: student.name,
          parent_phone: student.parent_phone || student.phone,
          status: student.attendance,
          class_name: session.class_name,
          date: session.date,
          time: new Date().toLocaleTimeString(),
          org_id: session.org_id
        })
        return true
      } catch (error) {
        console.error('n8n Attendance Alert Failed:', error)
        return false
      }
    },

    async triggerFeeReminder(student, period) {
      if (!student.phone && !student.parent_phone) return

      try {
        await axios.post(this.feeReminderWebhook, {
          type: 'FEE_REMINDER',
          student_name: student.name,
          parent_phone: student.parent_phone || student.phone,
          amount_due: student.balance || 0,
          period: period,
          org_id: student.org_id
        })
        return true
      } catch (error) {
        console.error('n8n Fee Reminder Failed:', error)
        return false
      }
    },

    async triggerPayoutInvoice(payout) {
      try {
        await axios.post(this.payoutInvoiceWebhook, {
          type: 'PAYOUT_INVOICE',
          tutor_name: payout.tutor_name,
          tutor_email: payout.tutor_email,
          amount: payout.amount,
          period: payout.period_month,
          org_id: payout.org_id
        })
        return true
      } catch (error) {
        console.error('n8n Payout Invoice Failed:', error)
        return false
      }
    }
  }
})
