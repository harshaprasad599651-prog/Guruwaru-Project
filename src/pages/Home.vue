<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'

const emit = defineEmits(['navigate'])
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

  </div>
</template>