<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Teacher } from '../types/teacher'

interface Props {
  teachers: Teacher[]
}
const selectedTeacher = ref<Teacher | null>(null)
const props = defineProps<Props>()
const emit = defineEmits(['back'])

const searchText = ref('')
const selectedDistrict = ref('')
const selectedSubject = ref('')
const selectedGrade = ref('')
const selectedMode = ref('')

const filteredTeachers = computed(() =>
  props.teachers.filter((teacher) => {
    const search = searchText.value.toLowerCase()

    const matchesSearch =
      teacher.name.toLowerCase().includes(search) ||
      teacher.subject.toLowerCase().includes(search) ||
      teacher.city.toLowerCase().includes(search) ||
      teacher.district.toLowerCase().includes(search)

    const matchesDistrict =
      selectedDistrict.value === '' || teacher.district === selectedDistrict.value

    const matchesSubject =
      selectedSubject.value === '' || teacher.subject === selectedSubject.value

    const matchesGrade =
      selectedGrade.value === '' || teacher.grade === selectedGrade.value

    const matchesMode =
      selectedMode.value === '' || teacher.modes.includes(selectedMode.value)

    return matchesSearch && matchesDistrict && matchesSubject && matchesGrade && matchesMode
  })
)

const resetFilters = () => {
  searchText.value = ''
  selectedDistrict.value = ''
  selectedSubject.value = ''
  selectedGrade.value = ''
  selectedMode.value = ''
}
const openTeacherProfile = (teacher: Teacher) => {
  selectedTeacher.value = teacher
}

const closeTeacherProfile = () => {
  selectedTeacher.value = null
}
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-yellow-50 px-4 py-6">

    <div class="mx-auto max-w-7xl">

      <div class="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-blue-700 md:text-4xl">
            Find Teachers
          </h1>

          <p class="mt-2 text-gray-600">
            Browse approved tuition teachers in Sri Lanka
          </p>
        </div>

        <button
          @click="emit('back')"
          class="w-fit rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>

      <!-- Search Filters -->
      <div class="mb-8 rounded-3xl bg-white p-5 shadow-lg">
        <div class="grid gap-4 md:grid-cols-3">

          <input
            v-model="searchText"
            type="text"
            placeholder="Search name, subject, city..."
            class="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />

          <select
            v-model="selectedSubject"
            class="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Subjects</option>
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

          <select
            v-model="selectedDistrict"
            class="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Districts</option>
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

          <select
            v-model="selectedGrade"
            class="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Grades</option>
            <option>Grade 1 - 5</option>
            <option>Grade 6 - 9</option>
            <option>Grade 10 - 11 O/L</option>
            <option>Advanced Level A/L</option>
            <option>University Level</option>
            <option>Professional Courses</option>
          </select>

          <select
            v-model="selectedMode"
            class="rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="">All Class Types</option>
            <option>Online</option>
            <option>Physical</option>
            <option>Home Visit</option>
            <option>Group Classes</option>
          </select>

          <button
            @click="resetFilters"
            class="rounded-2xl bg-gray-200 px-4 py-3 font-bold text-gray-700 transition hover:bg-gray-300"
          >
            Reset Filters
          </button>

        </div>

        <p class="mt-4 text-sm font-semibold text-gray-500">
          Showing {{ filteredTeachers.length }} teacher(s)
        </p>
      </div>

      <!-- Empty -->
      <div
        v-if="filteredTeachers.length === 0"
        class="rounded-3xl border border-blue-100 bg-white p-10 text-center shadow-lg"
      >
        <div class="text-6xl">🔍</div>

        <h2 class="mt-5 text-2xl font-extrabold text-gray-800">
          No Teachers Found
        </h2>

        <p class="mt-3 text-gray-600">
          Try changing your search or filter options.
        </p>
      </div>

      <!-- Teacher Grid -->
      <div
        v-else
        class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
          class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
        >
          <img
            v-if="teacher.photoUrl"
            :src="teacher.photoUrl"
            alt="Teacher photo"
            class="mb-5 h-24 w-24 rounded-3xl object-cover shadow"
          />

          <div
            v-else
            class="mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 text-4xl"
          >
            👨‍🏫
          </div>

          <h2 class="text-2xl font-bold text-gray-800">
            {{ teacher.name }}
          </h2>

          <div class="mt-4 space-y-2 text-gray-600">
            <p>
              📘 Subject:
              <span class="font-semibold text-gray-800">
                {{ teacher.subject }}
              </span>
            </p>

            <p>
              🎓 Grade:
              <span class="font-semibold text-gray-800">
                {{ teacher.grade }}
              </span>
            </p>

            <p>
              📍 Area:
              <span class="font-semibold text-gray-800">
                {{ teacher.city }}, {{ teacher.district }}
              </span>
            </p>

            <p>
              🏫 Class Types:
              <span class="font-semibold text-gray-800">
                {{ teacher.modes.join(', ') }}
              </span>
            </p>

            <p>
              💰 Fee (Rs. per month):
              <span class="font-semibold text-gray-800">
                {{ teacher.fee || 'Not mentioned' }}
              </span>
            </p>

            <p>
              ⭐ Experience(Years):
              <span class="font-semibold text-gray-800">
                {{ teacher.experience || 'Not mentioned' }}
              </span>
            </p>
          </div>

          <div class="mt-5 rounded-2xl bg-blue-50 p-4 text-sm text-gray-600">
            {{ teacher.description }}
          </div>

          <div class="mt-6 grid gap-3">

  <button
    @click="openTeacherProfile(teacher)"
    class="rounded-2xl bg-yellow-400 py-3 text-center font-bold text-gray-900 transition hover:bg-yellow-300"
  >
    View Full Profile
  </button>

  <a
    :href="`tel:${teacher.phone}`"
    class="rounded-2xl bg-blue-600 py-3 text-center font-bold text-white transition hover:bg-blue-700"
  >
    📞 Call Teacher
  </a>

  <a
    v-if="teacher.whatsapp"
    :href="`https://wa.me/94${teacher.whatsapp.slice(1)}`"
    target="_blank"
    class="rounded-2xl bg-green-500 py-3 text-center font-bold text-white transition hover:bg-green-600"
  >
    WhatsApp
  </a>

</div>
        </div>
      </div>

    </div>

  </div>
  <!-- Teacher Profile Modal -->
<div
  v-if="selectedTeacher"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
>

  <div class="max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8">

    <!-- Top -->
    <div class="flex items-start justify-between gap-4">

      <div class="flex items-center gap-4">

        <img
          v-if="selectedTeacher.photoUrl"
          :src="selectedTeacher.photoUrl"
          alt="Teacher photo"
          class="h-28 w-28 rounded-3xl object-cover shadow-lg"
        />

        <div
          v-else
          class="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-100 text-5xl"
        >
          👨‍🏫
        </div>

        <div>
          <h2 class="text-3xl font-extrabold text-gray-800">
            {{ selectedTeacher.name }}
          </h2>

          <p class="mt-2 text-lg font-semibold text-blue-600">
            {{ selectedTeacher.subject }}
          </p>

          <p class="text-gray-500">
            {{ selectedTeacher.grade }}
          </p>
        </div>

      </div>

      <button
        @click="closeTeacherProfile"
        class="rounded-xl bg-red-100 px-4 py-2 font-bold text-red-600 transition hover:bg-red-200"
      >
        ✕
      </button>

    </div>

    <!-- Details -->
    <div class="mt-8 grid gap-5 md:grid-cols-2">

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          District
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          {{ selectedTeacher.district }}
        </p>
      </div>

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          City / Area
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          {{ selectedTeacher.city }}
        </p>
      </div>

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          Class Types
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          {{ selectedTeacher.modes.join(', ') }}
        </p>
      </div>

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          Monthly Fee
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          Rs. {{ selectedTeacher.fee || 'Not mentioned' }}
        </p>
      </div>

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          Experience
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          {{ selectedTeacher.experience || 'Not mentioned' }} years
        </p>
      </div>

      <div class="rounded-2xl bg-blue-50 p-5">
        <p class="text-sm font-semibold text-gray-500">
          Qualification
        </p>

        <p class="mt-1 text-lg font-bold text-gray-800">
          {{ selectedTeacher.qualification || 'Not mentioned' }}
        </p>
      </div>

    </div>

    <!-- Description -->
    <div class="mt-8 rounded-3xl bg-gray-50 p-6">
      <h3 class="text-xl font-extrabold text-gray-800">
        About Classes
      </h3>

      <p class="mt-4 leading-relaxed text-gray-600">
        {{ selectedTeacher.description }}
      </p>
    </div>

    <!-- Contact -->
    <div class="mt-8 grid gap-4 md:grid-cols-2">

      <a
        :href="`tel:${selectedTeacher.phone}`"
        class="rounded-2xl bg-blue-600 py-4 text-center text-lg font-bold text-white transition hover:bg-blue-700"
      >
        📞 Call Teacher
      </a>

      <a
        v-if="selectedTeacher.whatsapp"
        :href="`https://wa.me/94${selectedTeacher.whatsapp.slice(1)}`"
        target="_blank"
        class="rounded-2xl bg-green-500 py-4 text-center text-lg font-bold text-white transition hover:bg-green-600"
      >
        WhatsApp
      </a>

    </div>

  </div>

</div>
</template>