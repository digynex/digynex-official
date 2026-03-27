import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

export const notificationsStore = ref([])
export const unreadCount = ref(0)

export const fetchNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  if (!error) {
    notificationsStore.value = data || []
    unreadCount.value = notificationsStore.value.filter(n => !n.is_read).length
  }
}

export const markAsRead = async (id) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id)

  if (!error) {
    fetchNotifications()
  }
}

export const addNotification = async (title, message, type = 'info', link = null) => {
  const { error } = await supabase
    .from('notifications')
    .insert({ title, message, type, link })

  if (!error) {
    fetchNotifications()
  }
}

/**
 * Audit Log Logic
 */
export const logActivity = async (entity_type, entity_id, action, details = {}, performed_by = 'System Admin') => {
  await supabase
    .from('activity_logs')
    .insert({
      entity_type,
      entity_id,
      action,
      details,
      performed_by
    })
}

// Initial Sync
onMounted(() => {
  fetchNotifications()
  
  // Realtime Subscription
  supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
        fetchNotifications()
    })
    .subscribe()
})
