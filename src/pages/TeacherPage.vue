<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Teacher } from '../types/teacher'
import { supabase } from '../supabase'

interface Props {
  teachers: Teacher[]
}

const props = defineProps<Props>()
const emit = defineEmits(['back', 'submit-teacher'])

const selectedMode = ref<'start' | 'login' | 'register'>('start')
const previewImage = ref('')
const imageFile = ref<File | null>(null)
const submitted = ref(false)
const submitting = ref(false)
const savingProfile = ref(false)

const loginUsername = ref('')
const loginPassword = ref('')
const loginError = ref('')
const loggedTeacher = ref<Teacher | null>(null)

const form = reactive({
  username: '',
  password: '',
  name: '',
  photoUrl: '',
  subject: '',
  grade: '',
  district: '',
  city: '',
  modes: [] as string[],
  fee: '',
  experience: '',
  qualification: '',
  phone: '',
  whatsapp: '',
  description: '',
})

const hasTeachers = computed(() => props.teachers.length > 0)

watch(
  () => props.teachers,
  (updatedTeachers) => {
    if (!loggedTeacher.value) return

    const updatedTeacher = updatedTeachers.find(
      teacher => teacher.id === loggedTeacher.value?.id
    )

    if (updatedTeacher) {
      loggedTeacher.value = updatedTeacher
    }
  },
  { deep: true }
)

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement

  if (target.files && target.files[0]) {
    const file = target.files[0]
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const submitForm = async () => {
  submitting.value = true

  let uploadedPhotoUrl = ''

  if (imageFile.value) {
    const fileExt = imageFile.value.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `teachers/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('teacher-images')
      .upload(filePath, imageFile.value)

    if (uploadError) {
      alert(uploadError.message)
      submitting.value = false
      return
    }

    const { data } = supabase.storage
      .from('teacher-images')
      .getPublicUrl(filePath)

    uploadedPhotoUrl = data.publicUrl
  }

    emit('submit-teacher', {
      id: Date.now(),
      ...form,
      photoUrl: uploadedPhotoUrl,
      status: 'pending',
      isActive: true,
      isFeatured: false,
      isPremium: false,
    })
      submitting.value = false
      submitted.value = true
    }

const teacherLogin = () => {
  const teacher = props.teachers.find(
    item =>
      item.username === loginUsername.value &&
      item.password === loginPassword.value
  )

  if (teacher) {
    loggedTeacher.value = teacher
    loginError.value = ''
  } else {
    loginError.value = 'Invalid username or password'
  }
}

const logoutTeacher = () => {
  loggedTeacher.value = null
  loginUsername.value = ''
  loginPassword.value = ''
  selectedMode.value = 'start'
}

const updateTeacherProfile = async () => {
  if (!loggedTeacher.value) return

  savingProfile.value = true

  const { error } = await supabase
    .from('teachers')
    .update({
      fee: loggedTeacher.value.fee,
      experience: loggedTeacher.value.experience,
      qualification: loggedTeacher.value.qualification,
      phone: loggedTeacher.value.phone,
      whatsapp: loggedTeacher.value.whatsapp,
      description: loggedTeacher.value.description,
    })
    .eq('id', loggedTeacher.value.id)

  savingProfile.value = false

  if (error) {
    alert(error.message)
    return
  }

  alert('Profile updated successfully!')
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-yellow-50 px-4 py-6">
    <div class="mx-auto max-w-5xl">

      <!-- Top -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-blue-700 md:text-4xl">
            Teacher Portal
          </h1>

          <p class="mt-2 text-gray-600">
            Register as a teacher or login to check your profile status.
          </p>
        </div>

        <button
          @click="emit('back')"
          class="w-fit rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      <!-- Start Selection -->
      <div
        v-if="selectedMode === 'start' && !loggedTeacher"
        class="rounded-3xl bg-white p-8 text-center shadow-xl"
      >
        <div class="text-6xl">👩‍🏫</div>

        <h2 class="mt-5 text-3xl font-extrabold text-gray-800">
          Welcome Teacher
        </h2>

        <p class="mx-auto mt-3 max-w-2xl text-gray-600">
          Create a new teacher profile or login using your username and password.
        </p>

        <div class="mt-8 grid gap-4 md:grid-cols-2">
          <button
            @click="selectedMode = 'register'"
            class="rounded-2xl bg-blue-600 px-8 py-5 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700"
          >
            Register as Teacher
          </button>

          <button
            @click="selectedMode = 'login'"
            class="rounded-2xl bg-yellow-400 px-8 py-5 text-lg font-bold text-gray-900 shadow-lg transition hover:bg-yellow-300"
          >
            Teacher Login
          </button>
        </div>
      </div>

      <!-- Login Form -->
      <div
        v-if="selectedMode === 'login' && !loggedTeacher"
        class="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h2 class="text-center text-3xl font-extrabold text-blue-700">
          Teacher Login
        </h2>

        <p class="mt-2 text-center text-gray-500">
          Login to view your submission status.
        </p>

        <input
          v-model="loginUsername"
          type="text"
          placeholder="Username"
          class="mt-8 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
        />

        <input
          v-model="loginPassword"
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

        <p
          v-if="!hasTeachers"
          class="mt-3 text-center text-sm text-gray-400"
        >
          No registered teachers yet. Please register first.
        </p>

        <button
          @click="teacherLogin"
          class="mt-6 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Login
        </button>

        <button
          @click="selectedMode = 'start'"
          class="mt-4 w-full rounded-2xl bg-gray-200 py-3 font-bold text-gray-700 transition hover:bg-gray-300"
        >
          Back
        </button>
      </div>

      <!-- Logged Teacher View -->
      <div
        v-if="loggedTeacher"
        class="rounded-3xl bg-white p-8 shadow-xl"
      >
        <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              v-if="loggedTeacher.photoUrl"
              :src="loggedTeacher.photoUrl"
              alt="Teacher photo"
              class="h-28 w-28 rounded-3xl object-cover shadow"
            />

            <div
              v-else
              class="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-100 text-5xl"
            >
              👨‍🏫
            </div>

            <div>
              <h2 class="text-3xl font-extrabold text-gray-800">
                {{ loggedTeacher.name }}
              </h2>

              <p class="mt-1 text-gray-600">
                {{ loggedTeacher.subject }} | {{ loggedTeacher.grade }}
              </p>

              <p class="text-gray-600">
                {{ loggedTeacher.city }}, {{ loggedTeacher.district }}
              </p>
            </div>
          </div>

          <button
            @click="logoutTeacher"
            class="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <!-- Pending -->
        <div
          v-if="loggedTeacher.status === 'pending'"
          class="mt-8 rounded-3xl border border-yellow-200 bg-yellow-50 p-8 text-center"
        >
          <div class="text-6xl">⏳</div>

          <h3 class="mt-4 text-3xl font-extrabold text-yellow-700">
            Waiting for Admin Approval
          </h3>

          <p class="mx-auto mt-3 max-w-2xl text-gray-600">
            Your teacher profile was submitted successfully. It will appear to students after admin approval.
          </p>
        </div>

        <!-- Approved Editable Profile -->
        <div
          v-else
          class="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8"
        >
          <h3 class="text-3xl font-extrabold text-green-700">
            ✅ Your Profile is Approved
          </h3>

          <p class="mt-2 text-gray-600">
            Your profile is visible to students if it is active.
          </p>

          <div class="mt-6 grid gap-4 md:grid-cols-2">

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Class Types
              </label>

              <div class="rounded-2xl bg-white p-4 text-gray-700">
                {{ loggedTeacher.modes.join(', ') }}
              </div>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Monthly Fee
              </label>

              <input
                v-model="loggedTeacher.fee"
                type="text"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Experience
              </label>

              <input
                v-model="loggedTeacher.experience"
                type="text"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Qualification
              </label>

              <input
                v-model="loggedTeacher.qualification"
                type="text"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                v-model="loggedTeacher.phone"
                type="text"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                WhatsApp
              </label>

              <input
                v-model="loggedTeacher.whatsapp"
                type="text"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

          </div>

          <div class="mt-5">
            <label class="mb-2 block font-semibold text-gray-700">
              About Classes
            </label>

            <textarea
              v-model="loggedTeacher.description"
              rows="6"
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            ></textarea>
          </div>

          <div
            class="mt-5 rounded-2xl p-4 font-bold"
            :class="loggedTeacher.isActive ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'"
          >
            Visibility:
            {{ loggedTeacher.isActive ? 'Active - Students can see your profile' : 'Deactivated - Students cannot see your profile' }}
          </div>

          <button
            @click="updateTeacherProfile"
            :disabled="savingProfile"
            class="mt-6 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
          >
            {{ savingProfile ? 'Saving...' : 'Save Profile Changes' }}
          </button>
        </div>
      </div>

      <!-- Register Form -->
      <div v-if="selectedMode === 'register' && !submitted">
        <div class="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          ⏳ After submitting, your profile will be marked as <b>Pending</b>. Admin must approve it before showing it to students.
        </div>

        <form
          @submit.prevent="submitForm"
          class="rounded-3xl border border-blue-100 bg-white p-5 shadow-xl md:p-8"
        >
          <div class="grid gap-6 md:grid-cols-2">

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Username *
              </label>

              <input
                v-model="form.username"
                required
                type="text"
                placeholder="Create username"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Password *
              </label>

              <input
                v-model="form.password"
                required
                type="password"
                placeholder="Create password"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Full Name *
              </label>

              <input
                v-model="form.name"
                required
                type="text"
                placeholder="Ex: Harsha Prasad"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-3 block font-semibold text-gray-700">
                Upload Profile Photo
              </label>

              <div class="rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50 p-6">
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="w-full rounded-xl bg-white p-3"
                />

                <div
                  v-if="previewImage"
                  class="mt-6 flex justify-center"
                >
                  <img
                    :src="previewImage"
                    alt="Preview"
                    class="h-40 w-40 rounded-3xl object-cover shadow-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Main Subject *
              </label>

              <select
                v-model="form.subject"
                required
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="">Select subject</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Combined Mathematics</option>
                <option>Mathematics</option>
                <option>Science</option>
                <option>ICT</option>
                <option>English</option>
                <option>Sinhala</option>
                <option>Commerce</option>
                <option>Accounting</option>
                <option>Economics</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Grade / Level *
              </label>

              <select
                v-model="form.grade"
                required
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="">Select grade</option>
                <option>Grade 1 - 5</option>
                <option>Grade 6 - 9</option>
                <option>Grade 10 - 11 O/L</option>
                <option>Advanced Level A/L</option>
                <option>University Level</option>
                <option>Professional Courses</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                District *
              </label>

              <select
                v-model="form.district"
                required
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              >
                <option value="">Select district</option>
                <option>Ampara</option>
                <option>Anuradhapura</option>
                <option>Badulla</option>
                <option>Batticaloa</option>
                <option>Colombo</option>
                <option>Galle</option>
                <option>Gampaha</option>
                <option>Hambantota</option>
                <option>Jaffna</option>
                <option>Kalutara</option>
                <option>Kandy</option>
                <option>Kegalle</option>
                <option>Kilinochchi</option>
                <option>Kurunegala</option>
                <option>Mannar</option>
                <option>Matale</option>
                <option>Matara</option>
                <option>Monaragala</option>
                <option>Mullaitivu</option>
                <option>Nuwara Eliya</option>
                <option>Polonnaruwa</option>
                <option>Puttalam</option>
                <option>Ratnapura</option>
                <option>Trincomalee</option>
                <option>Vavuniya</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                City / Area *
              </label>

              <input
                v-model="form.city"
                required
                type="text"
                placeholder="Ex: Nugegoda"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="mb-3 block font-semibold text-gray-700">
                Class Types *
              </label>

              <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50">
                  <input v-model="form.modes" required type="checkbox" value="Online" class="h-5 w-5 accent-blue-600" />
                  <span class="font-medium text-gray-700">💻 Online</span>
                </label>

                <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50">
                  <input v-model="form.modes" type="checkbox" value="Physical" class="h-5 w-5 accent-blue-600" />
                  <span class="font-medium text-gray-700">🏫 Physical</span>
                </label>

                <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50">
                  <input v-model="form.modes" type="checkbox" value="Home Visit" class="h-5 w-5 accent-blue-600" />
                  <span class="font-medium text-gray-700">🏠 Home Visit</span>
                </label>

                <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-300 bg-white px-4 py-4 transition hover:border-blue-400 hover:bg-blue-50">
                  <input v-model="form.modes" type="checkbox" value="Group Classes" class="h-5 w-5 accent-blue-600" />
                  <span class="font-medium text-gray-700">👨‍👩‍👧 Group Classes</span>
                </label>
              </div>
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Monthly Fee / Class Fee
              </label>

              <input
                v-model="form.fee"
                type="text"
                placeholder="Ex: Rs. 2500 per month"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Teaching Experience
              </label>

              <input
                v-model="form.experience"
                type="text"
                placeholder="Ex: 5 years"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Qualification
              </label>

              <input
                v-model="form.qualification"
                type="text"
                placeholder="Ex: BSc Engineering Undergraduate"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                Phone Number *
              </label>

              <input
                v-model="form.phone"
                required
                type="tel"
                placeholder="07XXXXXXXX"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>

            <div>
              <label class="mb-2 block font-semibold text-gray-700">
                WhatsApp Number
              </label>

              <input
                v-model="form.whatsapp"
                type="tel"
                placeholder="07XXXXXXXX"
                class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
              />
            </div>
          </div>

          <div class="mt-6">
            <label class="mb-2 block font-semibold text-gray-700">
              About Your Class *
            </label>

            <textarea
              v-model="form.description"
              required
              rows="6"
              placeholder="Write about your teaching style, class schedule, revision/paper classes, individual/group classes..."
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="mt-8 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {{ submitting ? 'Uploading...' : 'Submit Profile for Admin Approval' }}
          </button>

          <button
            type="button"
            @click="selectedMode = 'start'"
            class="mt-4 w-full rounded-2xl bg-gray-200 py-4 text-lg font-bold text-gray-700 transition hover:bg-gray-300"
          >
            Back
          </button>
        </form>
      </div>

      <!-- Submitted Screen -->
      <div
        v-if="submitted"
        class="rounded-3xl bg-white p-10 text-center shadow-2xl"
      >
        <div class="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-yellow-100 text-6xl shadow-lg">
          ⏳
        </div>

        <h2 class="mt-8 text-4xl font-extrabold text-yellow-600">
          Waiting for Approval
        </h2>

        <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Your teacher profile has been submitted successfully.
          You can login later using your username and password to check status.
        </p>

        <button
          @click="selectedMode = 'login'; submitted = false"
          class="mt-10 rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700"
        >
          Go to Teacher Login
        </button>
      </div>

    </div>
  </div>
</template>