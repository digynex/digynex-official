<template>
  <header class="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 flex-shrink-0 transition-all duration-300">
        <div class="flex items-center gap-4">
          <button class="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors" @click="$emit('toggleMenu')">
            <Menu class="w-5 h-5" />
          </button>
          <div class="hidden sm:block">
             <h1 class="text-xl font-black text-slate-800 tracking-tight">Q1 Executive Outlook</h1>
             <p class="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Decision Intelligence Platform</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 sm:gap-6">
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold border border-emerald-100/50 shadow-sm cursor-default transition-all hover:bg-emerald-100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live (Updated 2m ago)
          </div>

          <div class="flex items-center gap-2 sm:gap-4">
            <button @click="$emit('triggerToast', 'Action Engine: 0 critical notifications active.')" class="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200 group">
              <Bell class="w-5 h-5 group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
              <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button @click="$emit('triggerToast', 'Compiling PDF Executive Export. This will take a few seconds in Production.')" class="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg shadow-slate-900/20 active:scale-95">
              <Download class="w-4 h-4" /> Export
            </button>
          </div>
        </div>
  </header>
</template>

<script setup>
import { Menu, Bell, Download } from 'lucide-vue-next'

defineEmits(['toggleMenu', 'triggerToast'])
</script>
