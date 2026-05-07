<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import Home from './pages/Home.vue'
import StudentPage from './pages/StudentPage.vue'
import TeacherPage from './pages/TeacherPage.vue'
import AdminPage from './pages/AdminPage.vue'

import { supabase } from './supabase'
import type { Teacher } from './types/teacher'

const currentPage = ref('home')
const teachers = ref<Teacher[]>([])
const loading = ref(false)

const isAdminLoggedIn = ref(false)
const adminUsername = ref('')
const adminPassword = ref('')
const loginError = ref('')

const approvedActiveTeachers = computed(() =>
  teachers.value.filter(
    teacher => teacher.status === 'approved' && teacher.isActive
  )
)

const pendingTeachers = computed(() =>
  teachers.value.filter(teacher => teacher.status === 'pending')
)

const navigate = (page: string) => {
  currentPage.value = page
}

const mapDatabaseTeacher = (item: any): Teacher => {
  return {
    id: item.id,
    username: item.username,
    password: item.password,
    name: item.name,
    photoUrl: item.photo_url || '',
    subject: item.subject,
    grade: item.grade,
    district: item.district,
    city: item.city,
    modes: item.modes || [],
    fee: item.fee || '',
    experience: item.experience || '',
    qualification: item.qualification || '',
    phone: item.phone,
    whatsapp: item.whatsapp || '',
    description: item.description,
    status: item.status,
    isActive: item.is_active,
  }
}

const loadTeachers = async () => {
  loading.value = true

  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    alert(error.message)
    loading.value = false
    return
  }

  teachers.value = data.map(mapDatabaseTeacher)
  loading.value = false
}

const addTeacher = async (teacher: Teacher) => {
  const { error } = await supabase
    .from('teachers')
    .insert({
      id: teacher.id,
      username: teacher.username,
      password: teacher.password,
      name: teacher.name,
      photo_url: teacher.photoUrl,
      subject: teacher.subject,
      grade: teacher.grade,
      district: teacher.district,
      city: teacher.city,
      modes: teacher.modes,
      fee: teacher.fee,
      experience: teacher.experience,
      qualification: teacher.qualification,
      phone: teacher.phone,
      whatsapp: teacher.whatsapp,
      description: teacher.description,
      status: teacher.status,
      is_active: teacher.isActive,
    })

  if (error) {
    alert(error.message)
    return
  }

  await loadTeachers()
}

const approveTeacher = async (id: number) => {
  const { error } = await supabase
    .from('teachers')
    .update({
      status: 'approved',
      is_active: true,
    })
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  await loadTeachers()
}

const toggleTeacherActive = async (id: number) => {
  const teacher = teachers.value.find(item => item.id === id)

  if (!teacher) {
    return
  }

  const { error } = await supabase
    .from('teachers')
    .update({
      is_active: !teacher.isActive,
    })
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  await loadTeachers()
}

const deleteTeacher = async (id: number) => {
  const confirmed = confirm('Are you sure you want to delete this teacher?')

  if (!confirmed) {
    return
  }

  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id)

  if (error) {
    alert(error.message)
    return
  }

  await loadTeachers()
}

const adminLogin = () => {
  if (adminUsername.value === 'admin' && adminPassword.value === '1234') {
    isAdminLoggedIn.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Invalid username or password'
  }
}

const adminLogout = () => {
  isAdminLoggedIn.value = false
  adminUsername.value = ''
  adminPassword.value = ''
  loginError.value = ''
  currentPage.value = 'home'
}

onMounted(() => {
  loadTeachers()
})
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-yellow-50">

    <div
      v-if="loading"
      class="fixed right-4 top-4 z-50 rounded-full bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg"
    >
      Loading...
    </div>

    <Home
      v-if="currentPage === 'home'"
      @navigate="navigate"
    />

    <StudentPage
      v-if="currentPage === 'student'"
      :teachers="approvedActiveTeachers"
      @back="navigate('home')"
    />

    <TeacherPage
      v-if="currentPage === 'teacher'"
      :teachers="teachers"
      @back="navigate('home')"
      @submit-teacher="addTeacher"
    />

    <!-- Admin Login -->
    <div
      v-if="currentPage === 'admin' && !isAdminLoggedIn"
      class="flex min-h-screen items-center justify-center px-4"
    >
      <div class="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-xl">

        <h1 class="text-center text-3xl font-extrabold text-blue-700">
          Admin Login
        </h1>

        <p class="mt-2 text-center text-gray-500">
          Login to manage teacher approvals
        </p>

        <input
          v-model="adminUsername"
          type="text"
          placeholder="Username"
          class="mt-8 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <input
          v-model="adminPassword"
          type="password"
          placeholder="Password"
          class="mt-4 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <p
          v-if="loginError"
          class="mt-3 text-center font-semibold text-red-500"
        >
          {{ loginError }}
        </p>

        <button
          @click="adminLogin"
          class="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Login
        </button>

        <button
          @click="navigate('home')"
          class="mt-4 w-full rounded-2xl bg-gray-200 py-3 font-bold text-gray-700 transition hover:bg-gray-300"
        >
          Back to Home
        </button>

        <p class="mt-6 text-center text-sm text-gray-400">
          Demo login: admin / 1234
        </p>

      </div>
    </div>

    <AdminPage
      v-if="currentPage === 'admin' && isAdminLoggedIn"
      :pending-teachers="pendingTeachers"
      :all-teachers="teachers"
      @approve="approveTeacher"
      @toggle-active="toggleTeacherActive"
      @delete-teacher="deleteTeacher"
      @back="navigate('home')"
      @logout="adminLogout"
    />

  </div>
</template>