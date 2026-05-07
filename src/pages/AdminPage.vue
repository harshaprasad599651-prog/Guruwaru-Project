<script setup lang="ts">
import type { Teacher } from '../types/teacher'

interface Props {
  pendingTeachers: Teacher[]
  allTeachers: Teacher[]
}

defineProps<Props>()

const emit = defineEmits([
  'back',
  'logout',
  'approve',
  'toggle-active',
  'delete-teacher',
])
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-blue-50 via-white to-yellow-50 px-4 py-6">

    <div class="mx-auto max-w-7xl">

      <!-- Top -->
      <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 class="text-3xl font-extrabold text-blue-700 md:text-4xl">
            Admin Panel
          </h1>

          <p class="mt-2 text-gray-600">
            Approve, deactivate, and delete teacher profiles
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="emit('back')"
            class="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            ← Back
          </button>

          <button
            @click="emit('logout')"
            class="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

      </div>

      <!-- Pending Section -->
      <section class="mb-10">
        <h2 class="mb-4 text-2xl font-extrabold text-yellow-700">
          Pending Submissions
        </h2>

        <div
          v-if="pendingTeachers.length === 0"
          class="rounded-3xl border border-yellow-100 bg-white p-8 text-center text-gray-500 shadow"
        >
          No pending teacher submissions.
        </div>

        <div class="grid gap-6">
          <div
            v-for="teacher in pendingTeachers"
            :key="teacher.id"
            class="rounded-3xl border border-yellow-200 bg-white p-6 shadow-lg"
          >
            <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  v-if="teacher.photoUrl"
                  :src="teacher.photoUrl"
                  alt="Teacher photo"
                  class="h-24 w-24 rounded-3xl object-cover shadow"
                />

                <div
                  v-else
                  class="flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 text-4xl"
                >
                  👨‍🏫
                </div>

                <div>
                  <h3 class="text-2xl font-bold text-gray-800">
                    {{ teacher.name }}
                  </h3>

                  <p class="mt-1 text-gray-600">
                    📘 {{ teacher.subject }} | 🎓 {{ teacher.grade }}
                  </p>

                  <p class="text-gray-600">
                    📍 {{ teacher.city }}, {{ teacher.district }}
                  </p>

                  <p class="text-gray-600">
                    🏫 {{ teacher.modes.join(', ') }}
                  </p>

                  <p class="text-gray-600">
                    📞 {{ teacher.phone }}
                  </p>
                </div>
              </div>

              <button
                @click="emit('approve', teacher.id)"
                class="rounded-2xl bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
              >
                ✅ Approve
              </button>

            </div>
          </div>
        </div>
      </section>

      <!-- All Teachers Section -->
      <section>
        <h2 class="mb-4 text-2xl font-extrabold text-blue-700">
          All Teachers
        </h2>

        <div
          v-if="allTeachers.length === 0"
          class="rounded-3xl border border-blue-100 bg-white p-8 text-center text-gray-500 shadow"
        >
          No teachers added yet.
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="teacher in allTeachers"
            :key="teacher.id"
            class="rounded-3xl border border-blue-100 bg-white p-6 shadow-lg"
          >
            <div class="flex items-center gap-4">
              <img
                v-if="teacher.photoUrl"
                :src="teacher.photoUrl"
                alt="Teacher photo"
                class="h-20 w-20 rounded-3xl object-cover shadow"
              />

              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-3xl"
              >
                👨‍🏫
              </div>

              <div>
                <h3 class="text-xl font-bold text-gray-800">
                  {{ teacher.name }}
                </h3>

                <p class="text-sm text-gray-500">
                  {{ teacher.subject }}
                </p>
              </div>
            </div>

            <div class="mt-5 space-y-2 text-sm text-gray-600">
              <p>🎓 {{ teacher.grade }}</p>
              <p>📍 {{ teacher.city }}, {{ teacher.district }}</p>
              <p>💰 {{ teacher.fee || 'Fee not added' }}</p>
              <p>📞 {{ teacher.phone }}</p>

              <p>
                Status:
                <span
                  :class="teacher.status === 'approved'
                    ? 'text-green-600 font-bold'
                    : 'text-yellow-600 font-bold'"
                >
                  {{ teacher.status }}
                </span>
              </p>

              <p>
                Visibility:
                <span
                  :class="teacher.isActive
                    ? 'text-green-600 font-bold'
                    : 'text-red-600 font-bold'"
                >
                  {{ teacher.isActive ? 'Active' : 'Deactivated' }}
                </span>
              </p>
            </div>

            <div class="mt-6 flex flex-col gap-3">
              <button
                v-if="teacher.status === 'pending'"
                @click="emit('approve', teacher.id)"
                class="rounded-2xl bg-green-500 py-3 font-bold text-white transition hover:bg-green-600"
              >
                Approve
              </button>

              <button
                @click="emit('toggle-active', teacher.id)"
                class="rounded-2xl py-3 font-bold text-white transition"
                :class="teacher.isActive
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-blue-500 hover:bg-blue-600'"
              >
                {{ teacher.isActive ? 'Deactivate' : 'Activate' }}
              </button>

              <button
                @click="emit('delete-teacher', teacher.id)"
                class="rounded-2xl bg-red-500 py-3 font-bold text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>

  </div>
</template>