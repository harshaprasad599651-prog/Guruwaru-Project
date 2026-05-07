<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Teacher } from '../types/teacher'

interface Props {
  teachers: Teacher[]
}

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
</template>