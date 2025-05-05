<script setup>
import { ref, computed, watch } from 'vue';

const selected = defineModel('selected');
const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: [],
  },
  isSelf: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['batchAction']);

const isClickSelectAllBtn = ref(false);
const checked = computed(() => {
  if (props.list.length > 0) {
    return selected.value.length === props.list.length;
  } else {
    return isClickSelectAllBtn.value;
  }
});

const handleSelect = (event) => {
  event.preventDefault();
  event.stopPropagation();
  if (checked.value) {
    if (props.list.length > 0) {
      selected.value = [];
    } else {
      isClickSelectAllBtn.value = false;
    }
  } else {
    if (props.list.length > 0) {
      selected.value = [];
      selected.value = props.list.map((media) => {
        return `${media.id}:${media.type}`;
      });
    } else {
      isClickSelectAllBtn.value = true;
    }
  }
};
const handleClean = (event) => {
  event.stopPropagation();
  emits('batchAction', { type: 'clean' });
};
const handleDel = (event) => {
  event.stopPropagation();
  emits('batchAction', { type: 'del' });
};
const handleCopy = (event) => {
  event.stopPropagation();
  emits('batchAction', { type: 'copy' });
};
const handleMove = (event) => {
  event.stopPropagation();
  emits('batchAction', { type: 'move' });
};

watch(
  () => props.list,
  () => {
    isClickSelectAllBtn.value = false;
  }
);
</script>

<template>
  <div v-bind="$attrs" class="fav-list-header-filter">
    <div v-bind="$attrs" class="fav-list-header-filter__left">
      <label
        v-bind="$attrs"
        role="checkbox"
        :class="{ vui_checkbox: true, 'vui_checkbox--checked': checked }"
        @click="handleSelect"
      >
        <span class="vui_checkbox--input">
          <input type="checkbox" class="vui_checkbox--input-original" :value="checked" />
          <span class="vui_checkbox--input-box"></span>
        </span>
        <span class="vui_checkbox--label">全选</span>
      </label>
      <div v-bind="$attrs" class="selected">已选择 {{ selected.length }} 个视频</div>
    </div>
    <div v-bind="$attrs" class="fav-list-header-filter__right">
      <button
        v-bind="$attrs"
        class="vui_button action-btn"
        @click="handleClean"
        v-if="isSelf"
      >
        <i
          v-bind="$attrs"
          class="vui_icon sic-BDC-brush_clear_line"
          style="font-size: 16px"
        ></i>
        清除失效内容
      </button>
      <button
        v-bind="$attrs"
        class="vui_button action-btn"
        @click="handleDel"
        v-if="isSelf"
      >
        <i
          v-bind="$attrs"
          class="vui_icon sic-BDC-star_favorite_off_line"
          style="font-size: 16px"
        ></i>
        取消收藏
      </button>
      <button v-bind="$attrs" class="vui_button action-btn" @click="handleCopy">
        <i v-bind="$attrs" class="vui_icon sic-BDC-copy_line" style="font-size: 16px"></i>
        复制至
      </button>
      <button
        v-bind="$attrs"
        class="vui_button action-btn"
        @click="handleMove"
        v-if="isSelf"
      >
        <i
          v-bind="$attrs"
          class="vui_icon sic-fsp-folder_add_line"
          style="font-size: 16px"
        ></i>
        移动至
      </button>
    </div>
  </div>
</template>

<style scoped></style>
