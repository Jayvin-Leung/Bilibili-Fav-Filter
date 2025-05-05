<script setup>
import { computed } from 'vue';

const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  currPage: {
    type: Number,
    required: true,
  },
  pageSize: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(['change']);

const totalPage = computed(() => Math.ceil(props.total / props.pageSize));
const hasPrev = computed(() => totalPage.value > 1 && props.currPage !== 1);
const hasNext = computed(() => totalPage.value > 1 && props.currPage !== totalPage.value);
const pages = computed(() => {
  const maxVisiblePages = 9;
  const _pages = [];

  if (totalPage.value <= maxVisiblePages) {
    // 如果总页数不超过最大可见页数，显示所有页码
    for (let i = 1; i <= totalPage.value; i++) {
      _pages.push(i);
    }
  } else {
    // 总页数超过最大可见页数
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    // 始终显示第一页
    _pages.push(1);

    // 计算左侧和右侧需要显示的页码
    let startPage, endPage;

    if (props.currPage <= halfVisiblePages + 1) {
      // 当前页靠近左侧，显示前 maxVisiblePages - 2 页（留一个位置给最后的...）
      startPage = 2;
      endPage = maxVisiblePages - 2;
      for (let i = startPage; i <= endPage; i++) {
        _pages.push(i);
      }
      _pages.push({ text: '...', to: props.currPage + 5 });
      _pages.push(totalPage.value);
    } else if (props.currPage >= totalPage.value - halfVisiblePages) {
      // 当前页靠近右侧，显示后 maxVisiblePages - 2 页（留一个位置给前面的...）
      _pages.push({ text: '...', to: props.currPage - 5 });
      startPage = totalPage.value - (maxVisiblePages - 3);
      endPage = totalPage.value - 1;
      for (let i = startPage; i <= endPage; i++) {
        _pages.push(i);
      }
      _pages.push(totalPage.value);
    } else {
      // 当前页在中间，显示当前页附近的页码
      _pages.push({ text: '...', to: props.currPage - 5 });
      startPage = props.currPage - Math.floor((maxVisiblePages - 4) / 2);
      endPage = props.currPage + Math.floor((maxVisiblePages - 4) / 2);

      for (let i = startPage; i <= endPage; i++) {
        _pages.push(i);
      }

      _pages.push({ text: '...', to: props.currPage + 5 });
      _pages.push(totalPage.value);
    }
  }

  return _pages;
});

const jump = (to) => {
  emits('change', to);
};
const handleEnter = (event) => {
  const to = Number(event.target.value);
  if (Number.isInteger(to) && to >= 1 && to <= totalPage.value) {
    jump(to);
  }
  event.target.value = '';
};
</script>

<template>
  <div
    v-bind="$attrs"
    class="vui_pagenation vui_pagenation--jump card-pagenation"
    v-if="totalPage > 1"
  >
    <div class="vui_pagenation--btns">
      <button
        :class="{
          vui_button: true,
          'vui_pagenation--btn': true,
          'vui_pagenation--btn-side': true,
          'vui_button--disabled': !hasPrev,
        }"
        @click="jump(currPage - 1)"
      >
        上一页
      </button>
      <!---->
      <button
        v-for="page in pages"
        :class="{
          vui_button: true,
          'vui_button--no-transition': true,
          'vui_pagenation--btn': true,
          'vui_pagenation--btn-num': true,
          'vui_button--active': currPage === page,
          'vui_button--active-blue': currPage === page,
        }"
        @click="jump(typeof page === 'object' ? page.to : page)"
      >
        {{ typeof page === 'object' ? page.text : page }}
      </button>
      <button
        :class="{
          vui_button: true,
          'vui_pagenation--btn': true,
          'vui_pagenation--btn-side': true,
          'vui_button--disabled': !hasNext,
        }"
        @click="jump(currPage + 1)"
      >
        下一页
      </button>
    </div>
    <div class="vui_pagenation-go">
      <span class="vui_pagenation-go__count">
        共 {{ totalPage }} 页 / {{ total }} 个，跳至
      </span>
      <div class="vui_input">
        <!---->
        <div class="vui_input-wrapper">
          <!---->
          <input
            type="number"
            class="vui_input__input vui_input__input-resizable"
            @keyup.enter="handleEnter"
          />
          <!---->
        </div>
        <!---->
      </div>
      <span class="vui_pagenation-go__page">页</span>
    </div>
  </div>
</template>

<style scoped></style>
