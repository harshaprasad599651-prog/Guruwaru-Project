<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import type { Teacher } from '../types/teacher'

interface Props {
  teachers: Teacher[]
}

const props = defineProps<Props>()
const emit = defineEmits(['navigate'])

const featuredTeachers = computed(() =>
  props.teachers.filter(
    teacher => teacher.isFeatured || teacher.isPremium
  ).slice(0, 3)
)
</script>

<template>
  <div>

    <AppHeader />

    <section class="relative overflow-hidden">

      <!-- Background -->
      <div
        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600')] bg-cover bg-center opacity-10"
      ></div>

      <div class="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <!-- Badge -->
        <div class="mb-6 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700 shadow">
          🇱🇰 Find Trusted Tuition Teachers Across Sri Lanka
        </div>

        <!-- Title -->
        <h1 class="max-w-4xl text-5xl font-extrabold leading-tight text-gray-800 md:text-7xl">
          Welcome to
          <span class="text-blue-600">
            Guruwaru
          </span>
        </h1>

        <!-- Subtitle -->
        <p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
          Sri Lanka’s modern platform for students to find the best tuition teachers and for teachers to grow their classes.
        </p>

        <!-- Buttons -->
        <div class="mt-12 flex flex-col gap-5 md:flex-row">

          <!-- Student -->
          <button
            @click="emit('navigate', 'student')"
            class="rounded-2xl bg-blue-600 px-10 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700"
          >
            👨‍🎓 I am a Student
          </button>

          <!-- Teacher -->
          <button
            @click="emit('navigate', 'teacher')"
            class="rounded-2xl bg-yellow-400 px-10 py-5 text-lg font-bold text-gray-900 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-yellow-300"
          >
            👩‍🏫 I am a Teacher
          </button>

        </div>

        <!-- Admin -->
        <button
          @click="emit('navigate', 'admin')"
          class="mt-10 text-sm font-semibold text-gray-500 underline transition hover:text-blue-600"
        >
          Admin Panel
        </button>

      </div>

    </section>
    <!-- Featured Teachers -->
<section
  v-if="featuredTeachers.length > 0"
  class="mt-16 w-full"
>
  <h2 class="text-3xl font-extrabold text-gray-800">
    Featured Teachers
  </h2>

  <p class="mt-2 text-gray-600">
    Top highlighted teachers on Guruwaru
  </p>

  <div class="mt-8 grid gap-6 md:grid-cols-3">
    <div
      v-for="teacher in featuredTeachers"
      :key="teacher.id"
      class="rounded-3xl border bg-white p-6 text-left shadow-xl"
      :class="teacher.isPremium ? 'border-yellow-300 bg-yellow-50' : 'border-blue-200 bg-blue-50'"
    >
      <div class="mb-4 flex gap-2">
        <span
          v-if="teacher.isPremium"
          class="rounded-full bg-yellow-400 px-3 py-1 text-xs font-extrabold text-gray-900"
        >
          👑 Premium
        </span>

        <span
          v-if="teacher.isFeatured"
          class="rounded-full bg-blue-600 px-3 py-1 text-xs font-extrabold text-white"
        >
          ⭐ Featured
        </span>
      </div>

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

      <h3 class="mt-4 text-xl font-bold text-gray-800">
        {{ teacher.name }}
      </h3>

      <p class="mt-2 text-blue-700 font-semibold">
        {{ teacher.subject }}
      </p>

      <p class="mt-1 text-gray-600">
        📍 {{ teacher.city }}, {{ teacher.district }}
      </p>

      <button
        @click="emit('navigate', 'student')"
        class="mt-5 w-full rounded-2xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
      >
        View Teacher
      </button>
    </div>
  </div>
</section>

  </div>
</template>