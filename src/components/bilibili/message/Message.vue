<script setup>
const open = defineModel('open');
const props = defineProps({
  text: {
    required: false,
    default: '',
  },
});
</script>

<template>
  <template v-if="open">
    <div class="vui_toast--wrapper">
      <div class="vui_toast">{{ text }}</div>
    </div>
  </template>
</template>

<style scoped></style>
