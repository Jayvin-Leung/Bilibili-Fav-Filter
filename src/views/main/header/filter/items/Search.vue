<script setup>
import { ref, computed, watch } from 'vue';
import message from '@/components/bilibili/message';
import popover from '@/components/bilibili/popover';

const emits = defineEmits(['change']);

const selected = ref(0);
const textOfSelected = computed(() => {
  switch (selected.value) {
    case 0:
      return '当前';
    case 1:
      return '全部';
    default:
      return '';
  }
});
const keyword = ref('');

const handleShow = (event) => {
  event.stopPropagation();

  let button = null;
  let arrow = null;
  if (event.target.classList.contains('vui_button')) {
    button = event.target;
  } else {
    button = event.target.closest('.vui_button');
  }
  arrow = button.querySelector('.sic-BDC-arrow_expand_line');

  arrow.classList.add('revert');
  popover.open({
    target: button,
    items: [
      [
        {
          $html: '当前收藏夹',
          $click: () => {
            selected.value = 0;
          },
        },
        {
          $html: '全部收藏夹',
          $click: () => {
            selected.value = 1;
          },
        },
      ],
    ],
    $cancel: () => {
      arrow.classList.remove('revert');
    },
  });
};
const handleSearch = () => {
  if (!keyword.value) {
    message.info({ text: '请输入关键词' });
    return;
  }
  emits('change', selected.value, keyword.value);
};
const handleEnter = () => {
  handleSearch();
};
const handleClear = () => {
  keyword.value = '';
};

watch(
  () => keyword.value,
  (value, oldValue) => {
    if (!value && oldValue) {
      emits('change', 0, keyword.value);
    }
  }
);

defineExpose({
  reset: () => {
    selected.value = 0;
    keyword.value = '';
  },
});
</script>

<template>
  <div v-bind="$attrs" class="vui_input fav-list-header-filter__search">
    <div class="vui_input__prepend">
      <div data-v-831e1505="" v-bind="$attrs" class="menu-popover">
        <button v-bind="$attrs" class="vui_button" @click="handleShow">
          {{ textOfSelected }}
          <i
            v-bind="$attrs"
            class="vui_icon sic-BDC-arrow_expand_line"
            style="font-size: 12px"
          ></i>
        </button>
        <!---->
      </div>
    </div>

    <div class="vui_input-wrapper vui_input-wrapper--prepped">
      <!---->
      <input
        type="text"
        class="vui_input__input vui_input__input-resizable fav-list-header-filter__search"
        placeholder="请输入关键词"
        v-model="keyword"
        @keyup.enter="handleEnter"
      />
      <div class="vui_input__suffix">
        <div class="vui_input-clear" v-if="keyword" @click="handleClear">
          <svg
            class="vui_icon vui_input-clear-base__icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="M8 1.3333333333333333C4.318099999999999 1.3333333333333333 1.3333333333333333 4.318099999999999 1.3333333333333333 8C1.3333333333333333 11.681899999999999 4.318099999999999 14.666666666666666 8 14.666666666666666C11.681899999999999 14.666666666666666 14.666666666666666 11.681899999999999 14.666666666666666 8C14.666666666666666 4.318099999999999 11.681899999999999 1.3333333333333333 8 1.3333333333333333zM5.64258 6.3496C5.4473199999999995 6.1543399999999995 5.4473199999999995 5.837753333333333 5.64258 5.6424933333333325C5.837846666666666 5.447233333333333 6.154426666666667 5.447233333333333 6.349693333333333 5.6424933333333325L8 7.2928L9.650333333333332 5.6424933333333325C9.845566666666667 5.447233333333333 10.162166666666666 5.447233333333333 10.357433333333333 5.6424933333333325C10.552666666666667 5.837753333333333 10.552666666666667 6.1543399999999995 10.357433333333333 6.3496L8.7071 7.9999L10.357433333333333 9.650233333333333C10.552666666666667 9.845466666666667 10.552666666666667 10.162066666666666 10.357433333333333 10.357333333333333C10.162166666666666 10.5526 9.845566666666667 10.5526 9.650333333333332 10.357333333333333L8 8.706999999999999L6.349693333333333 10.357333333333333C6.154426666666667 10.5526 5.837846666666666 10.5526 5.64258 10.357333333333333C5.4473199999999995 10.162066666666666 5.4473199999999995 9.845466666666667 5.64258 9.650233333333333L7.2928999999999995 7.9999L5.64258 6.3496z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
        <i
          v-bind="$attrs"
          class="vui_icon sic-BDC-magnifier_search_line"
          style="font-size: 20px"
          @click="handleSearch"
        ></i>
        <!---->
      </div>
    </div>
    <!---->
  </div>
</template>

<style scoped></style>
