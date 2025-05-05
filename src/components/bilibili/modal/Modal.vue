<script setup>
import { ref, watch } from 'vue';

const open = defineModel('open');
const props = defineProps({
  wrapClassName: {
    type: String,
    required: false,
    default: '',
  },
  title: {
    required: false,
    default: '',
  },
  okText: {
    required: false,
    default: '',
  },
  cancelText: {
    required: false,
    default: '',
  },
});
const emits = defineEmits(['ok', 'cancel', 'close']);

const modalRef = ref(null);

const ok = () => {
  emits('ok');
};
const cancel = () => {
  open.value = false;
  emits('cancel');
};
const close = () => {
  open.value = false;
  emits('close');
};
const globalClose = (event) => {
  if (!modalRef.value) return;
  if (!modalRef.value.contains(event.target)) {
    close();
  }
};

watch(
  () => open.value,
  () => {
    if (open.value) {
      document.addEventListener('click', globalClose);
    } else {
      document.removeEventListener('click', globalClose);
    }
  }
);
</script>

<template>
  <div class="vui_dialog--root" v-show="open">
    <div class="vui_dialog--mask"></div>
    <div class="vui_dialog--wrapper">
      <div :class="`vui_dialog--content ${wrapClassName}`" ref="modalRef">
        <div class="vui_dialog--close" @click="close">
          <svg
            class="vui_icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="20"
            height="20"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M4.106275 4.108583333333334C4.350341666666667 3.8645000000000005 4.746083333333333 3.8645000000000005 4.9901583333333335 4.108583333333334L9.998666666666667 9.117125L15.008583333333334 4.107216666666667C15.252625 3.8631333333333338 15.648375000000001 3.8631333333333338 15.892458333333334 4.107216666666667C16.136541666666666 4.351291666666667 16.136541666666666 4.747025000000001 15.892458333333334 4.9911L10.882541666666667 10.001000000000001L15.891375 15.009791666666667C16.135458333333332 15.253874999999999 16.135458333333332 15.649625 15.891375 15.893708333333334C15.647291666666668 16.13775 15.251541666666668 16.13775 15.0075 15.893708333333334L9.998666666666667 10.884875000000001L4.991233333333334 15.892333333333333C4.747158333333333 16.13641666666667 4.351425 16.13641666666667 4.10735 15.892333333333333C3.8632750000000002 15.648249999999999 3.8632750000000002 15.252541666666666 4.10735 15.008458333333333L9.114791666666667 10.001000000000001L4.106275 4.992466666666667C3.8621916666666665 4.7483916666666675 3.8621916666666665 4.352658333333333 4.106275 4.108583333333334z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <div class="vui_dialog--header">
          <div class="vui_dialog--title">
            {{ title }}
          </div>
        </div>
        <div class="vui_dialog--body">
          <slot />
        </div>
        <div class="vui_dialog--footer">
          <button
            class="vui_button vui_dialog--btn vui_dialog--btn-cancel"
            @click="cancel"
            v-if="cancelText"
          >
            {{ cancelText || '取消' }}
          </button>
          <button
            class="vui_button vui_button--blue vui_dialog--btn vui_dialog--btn-confirm"
            @click="ok"
            v-if="okText"
          >
            {{ okText || '确定' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
