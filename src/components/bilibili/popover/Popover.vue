<script setup>
import { ref, watch, nextTick } from 'vue';

const open = defineModel('open');
const props = defineProps({
  target: {
    required: true,
  },
  items: {
    type: Array,
    required: true,
    default: [],
  },
});
const emits = defineEmits(['cancel']);

const popoverRef = ref(null);
const offsetTop = ref(0);
const offsetLeft = ref(0);

const globalClose = (event) => {
  if (!popoverRef.value) return;
  if (!popoverRef.value.contains(event.target)) {
    open.value = false;
    emits('cancel');
  }
};
const globalResize = () => {
  const targetRect = props.target.getBoundingClientRect();
  const popoverRect = popoverRef.value.getBoundingClientRect();
  offsetTop.value = targetRect.bottom + 10;
  if (window.scrollY) offsetTop.value += window.scrollY;
  offsetLeft.value = targetRect.left + (targetRect.width - popoverRect.width) / 2;
  if (window.scrollX) offsetLeft.value += window.scrollX;
};

watch(
  () => open.value,
  () => {
    if (open.value) {
      document.addEventListener('click', globalClose);
      window.addEventListener('resize', globalResize);
      nextTick(() => globalResize());
    } else {
      document.removeEventListener('click', globalClose);
      window.removeEventListener('resize', globalResize);
    }
  }
);
watch(
  () => props.target,
  () => {
    if (open.value) {
      nextTick(() => globalResize());
    }
  }
);
</script>

<template>
  <div
    class="vui_popover vui_popover-is-bottom-end"
    data-popper-placement="bottom-end"
    :style="{
      'z-index': 10000,
      position: 'absolute',
      // inset: '0px 0px auto auto',
      top: '0px',
      left: '0px',
      margin: '0px',
      transform: `translate(${offsetLeft}px, ${offsetTop}px)`,
    }"
    ref="popoverRef"
    v-show="open"
  >
    <div class="vui_popover-content">
      <div data-v-831e1505="" class="menu-popover__panel" v-for="col in items">
        <div
          data-v-831e1505=""
          class="menu-popover__panel-item"
          v-for="row in col"
          v-html="row.$html"
          @click="row.$click"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vui_popover-content {
  display: flex;
}
.menu-popover__panel-item {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
