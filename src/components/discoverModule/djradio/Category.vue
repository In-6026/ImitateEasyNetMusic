
<script setup lang="ts">
import useCurrentInstance from '@/hooks/useCurrentInstance'
import { reactive } from 'vue'
const $route = useCurrentInstance()?.$route
let name = $route?.name
let query = $route?.query
let data = reactive({
  name,
  query,
})
</script>
<template>
  <h3>name: {{ data.name }}</h3>
  <h3>query: {{ JSON.stringify(data.query) }}</h3>
</template>
<style scoped>
</style>