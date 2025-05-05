<script setup>
import { ref } from 'vue';

const emits = defineEmits(['change']);

const selected = ref('mtime');

const handleSelect = (order) => {
  selected.value = order;
  emits('change', order);
};

defineExpose({
  reset: () => {
    selected.value = 'mtime';
  },
});
</script>

<template>
  <div v-bind="$attrs" class="radio-filter">
    <div
      :class="{
        'radio-filter__item': true,
        'radio-filter__item--active': selected === 'mtime',
      }"
      @click="handleSelect('mtime')"
    >
      <!---->
      最近收藏
    </div>
    <div
      :class="{
        'radio-filter__item': true,
        'radio-filter__item--active': selected === 'view',
      }"
      @click="handleSelect('view')"
    >
      <!---->
      最多播放
    </div>
    <div
      :class="{
        'radio-filter__item': true,
        'radio-filter__item--active': selected === 'pubtime',
      }"
      @click="handleSelect('pubtime')"
    >
      <!---->
      最近投稿
    </div>
  </div>
  <!---->
</template>

<style scoped></style>
