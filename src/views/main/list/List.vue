<script setup>
import dateUtil from '@/utils/dateUtil';
import {
  add as addToviewApi,
  del as delToviewApi,
} from '@/service/bilibili/api/history/toview';

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
  isShowBatch: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const emits = defineEmits(['action']);

let timerId = null;
let dropdown = null;

const mouseenterCard = (event) => {
  event.target
    .querySelector('.bili-card-dropdown')
    ?.classList.add('bili-card-dropdown--visible');
};
const mouseleaveCard = (event) => {
  event.target
    .querySelector('.bili-card-dropdown')
    ?.classList.remove('bili-card-dropdown--visible');
};
const mouseenterCover = (event) => {
  event.target
    .querySelector('.bili-card-watch-later')
    ?.classList.add('bili-card-watch-later--visible');
};
const mouseleaveCover = (event) => {
  event.target
    .querySelector('.bili-card-watch-later')
    ?.classList.remove('bili-card-watch-later--visible');
};
const mouseenterDropdown = (event) => {
  timerId && clearTimeout(timerId);
  if (dropdown && dropdown !== event.target) {
    dropdown
      .closest('.items__item')
      ?.querySelector('.bili-card-dropdown-popper')
      ?.classList.remove('visible');
  }
  event.target
    .closest('.items__item')
    ?.querySelector('.bili-card-dropdown-popper')
    ?.classList.add('visible');
};
const mouseleaveDropdown = (event) => {
  timerId = setTimeout(() => {
    event.target
      .closest('.items__item')
      ?.querySelector('.bili-card-dropdown-popper')
      ?.classList.remove('visible');
  }, 200);
  dropdown = event.target;
};
const mouseenterPopper = (event) => {
  event.target.classList.add('visible');
  timerId && clearTimeout(timerId);
};
const mouseleavePopper = (event) => {
  event.target.classList.remove('visible');
};
const handleSelect = (media, event) => {
  event.stopPropagation();

  const value = `${media.id}:${media.type}`;
  if (selected.value.includes(value)) {
    selected.value.splice(selected.value.indexOf(value), 1);
  } else {
    selected.value.push(value);
  }
};
const handleWatchLater = (media, event) => {
  event.stopPropagation();

  const bvid = media.bvid;
  if (media.toview) {
    delToviewApi({ bvid }, () => {
      media.toview = false;
    });
  } else {
    addToviewApi({ bvid }, () => {
      media.toview = true;
    });
  }
};
const handleDel = (media, event) => {
  event.stopPropagation();
  emits('action', { type: 'del', resources: `${media.id}:${media.type}` });
};
const handleCopy = (media, event) => {
  event.stopPropagation();
  emits('action', { type: 'copy', resources: `${media.id}:${media.type}` });
};
const handleMove = (media, event) => {
  event.stopPropagation();
  emits('action', { type: 'move', resources: `${media.id}:${media.type}` });
};
</script>

<template>
  <div v-bind="$attrs" class="items__item" v-for="item in list">
    <div
      v-bind="$attrs"
      class="bili-video-card"
      @mouseenter="mouseenterCard"
      @mouseleave="mouseleaveCard"
    >
      <div class="bili-video-card__wrap">
        <div
          class="bili-video-card__cover"
          @mouseenter="mouseenterCover"
          @mouseleave="mouseleaveCover"
        >
          <a
            class="bili-cover-card"
            :href="`https://www.bilibili.com/video/${item.bvid}?spm_id_from=333.1387.favlist.content.click`"
            target="_blank"
          >
            <div class="bili-cover-card__thumbnail">
              <img
                :src="item.cover.slice(item.cover.indexOf('//')) + '@672w_378h_1c.avif'"
                class=""
                :alt="item.title"
                onload="typeof window.bmgCmptOnload === 'function' &amp;&amp; window.bmgCmptOnload(this)"
                onerror="typeof window.bmgCmptOnerror === 'function' &amp;&amp; window.bmgCmptOnerror(this)"
              />
            </div>
            <div class="bili-cover-card__tags" v-if="item.type === 24">
              <div class="bili-cover-card__tag">
                <span>{{ item.ogv?.type_name }}</span>
              </div>
            </div>
            <div class="bili-cover-card__stats">
              <div class="bili-cover-card__stat" v-if="item.type !== 24">
                <i class="sic-BDC-playdata_square_line"></i>
                <span>{{ item.cnt_info.view_text_1 }}</span>
              </div>
              <div class="bili-cover-card__stat" v-if="item.type !== 24">
                <i class="sic-BDC-danmu_square_line"></i>
                <span>
                  {{
                    item.cnt_info.danmaku < 10000
                      ? item.cnt_info.danmaku
                      : (item.cnt_info.danmaku / 10000).toFixed(1) + '万'
                  }}
                </span>
              </div>
              <div class="bili-cover-card__stat">
                <span>
                  {{
                    item.duration < 3600
                      ? dateUtil.formatSeconds[1](item.duration)
                      : dateUtil.formatSeconds[0](item.duration)
                  }}
                </span>
              </div>
            </div>
          </a>
          <div class="bili-card-watch-later">
            <div
              class="bili-card-watch-later__btn"
              @click="(event) => handleWatchLater(item, event)"
            >
              <i
                :class="
                  item.toview ? 'sic-BDC-checkmark_line' : 'sic-BDC-arrow_play_next_line'
                "
                style="font-variation-settings: 'strk' 1.5"
              ></i>
            </div>
            <span class="bili-card-watch-later__tip">
              {{ item.toview ? '移除' : '稍后再看' }}
            </span>
          </div>
          <div
            :class="{
              'bili-card-checkbox': true,
              'bili-card-checkbox--visible': isShowBatch,
              'bili-card-checkbox--checked': selected.includes(`${item.id}:${item.type}`),
            }"
          >
            <div class="bili-card-checkbox__inner">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M14.3378 3.00678C14.0492 2.74694 13.6046 2.77024 13.3447 3.05882L5.46602 11.809L2.66657 8.69993C2.40673 8.41135 1.96215 8.38805 1.67357 8.64789C1.38498 8.90773 1.36168 9.35232 1.62153 9.6409L4.93385 13.3196C5.11955 13.5259 5.39962 13.5966 5.64967 13.5253C5.78192 13.4929 5.90618 13.4218 6.00416 13.313L14.3898 3.99979C14.6496 3.7112 14.6263 3.26662 14.3378 3.00678Z"
                  fill="white"
                ></path>
                <path
                  d="M13.3447 3.05882L13.9021 3.56067L13.9021 3.56067L13.3447 3.05882ZM14.3378 3.00678L13.8359 3.56414L14.3378 3.00678ZM5.46602 11.809L4.90866 12.3109L5.46602 12.9299L6.02338 12.3109L5.46602 11.809ZM2.66657 8.69993L3.22393 8.19809L3.22393 8.19809L2.66657 8.69993ZM1.67357 8.64789L1.17172 8.09053L1.17172 8.09053L1.67357 8.64789ZM1.62153 9.6409L2.17888 9.13905L2.17888 9.13905L1.62153 9.6409ZM4.93385 13.3196L5.4912 12.8178L5.4912 12.8178L4.93385 13.3196ZM5.64967 13.5253L5.47111 12.7969L5.45752 12.8002L5.44406 12.8041L5.64967 13.5253ZM6.00416 13.313L6.56152 13.8148L6.56152 13.8148L6.00416 13.313ZM14.3898 3.99979L14.9472 4.50163L14.9472 4.50163L14.3898 3.99979ZM13.9021 3.56067C13.8848 3.57991 13.8551 3.58146 13.8359 3.56414L14.8396 2.44942C14.2432 1.91242 13.3244 1.96057 12.7874 2.55697L13.9021 3.56067ZM6.02338 12.3109L13.9021 3.56067L12.7874 2.55697L4.90866 11.3072L6.02338 12.3109ZM6.02338 11.3072L3.22393 8.19809L2.10921 9.20178L4.90866 12.3109L6.02338 11.3072ZM3.22393 8.19809C2.68693 7.60168 1.76812 7.55353 1.17172 8.09053L2.17541 9.20525C2.15618 9.22257 2.12654 9.22102 2.10921 9.20178L3.22393 8.19809ZM1.17172 8.09053C0.575316 8.62754 0.527163 9.54634 1.06417 10.1427L2.17888 9.13905C2.19621 9.15829 2.19465 9.18793 2.17541 9.20525L1.17172 8.09053ZM1.06417 10.1427L4.37649 13.8215L5.4912 12.8178L2.17888 9.13905L1.06417 10.1427ZM4.37649 13.8215C4.76102 14.2485 5.34044 14.3933 5.85527 14.2466L5.44406 12.8041C5.45258 12.8016 5.46061 12.8017 5.46824 12.8039C5.47717 12.8063 5.48577 12.8117 5.4912 12.8178L4.37649 13.8215ZM5.4468 12.8111C5.44921 12.8085 5.45292 12.8052 5.45767 12.8024C5.46225 12.7997 5.46684 12.7979 5.47111 12.7969L5.82823 14.2538C6.10199 14.1866 6.35971 14.039 6.56152 13.8148L5.4468 12.8111ZM13.8324 3.49794L5.4468 12.8111L6.56152 13.8148L14.9472 4.50163L13.8324 3.49794ZM13.8359 3.56414C13.8167 3.54681 13.8151 3.51718 13.8324 3.49794L14.9472 4.50163C15.4842 3.90523 15.436 2.98642 14.8396 2.44942L13.8359 3.56414Z"
                  fill="white"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="bili-video-card__details">
          <div
            class="bili-video-card__title bili-video-card__title--pr"
            :title="item.type === 24 ? item.intro : item.title"
          >
            <a
              :href="`https://www.bilibili.com/video/${item.bvid}?spm_id_from=333.1387.favlist.content.click`"
              target="_blank"
            >
              {{ item.type === 24 ? item.intro : item.title }}
            </a>
            <div
              class="bili-card-dropdown"
              @mouseenter="mouseenterDropdown"
              @mouseleave="mouseleaveDropdown"
              v-if="isSelf"
            >
              <i
                class="sic-BDC-more_vertical_fill"
                style="font-variation-settings: 'strk' 1.5"
              ></i>
            </div>
          </div>
          <div class="bili-video-card__subtitle">
            <span
              v-if="item.type === 24"
              :title="`${item.title} · 收藏于${dateUtil.timestampToDate[2](
                item.fav_time * 1000
              )}`"
            >
              {{ item.title }} · 收藏于{{
                dateUtil.timestampToDate[2](item.fav_time * 1000)
              }}
            </span>
            <a
              v-else
              class="bili-video-card__author"
              :href="`https://space.bilibili.com/${item.upper.mid}?spm_id_from=333.1387.favlist.content.click`"
              target="_blank"
            >
              <div class="bili-video-card__text">
                <i class="sic-BDC-uploader_name_square_line"></i><span></span>
              </div>
              <div class="bili-video-card__text">
                <span
                  :title="`${item.upper.name} · 收藏于${dateUtil.timestampToDate[2](
                    item.fav_time * 1000
                  )}`"
                >
                  {{ item.upper.name }} · 收藏于{{
                    dateUtil.timestampToDate[2](item.fav_time * 1000)
                  }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div
        class="bili-card-checkbox-overlay"
        style="z-index: 1036"
        @click="(event) => handleSelect(item, event)"
        v-if="isShowBatch"
      ></div>
    </div>

    <div
      class="bili-card-dropdown-popper"
      style="
        position: absolute;
        inset: 0px 0px auto auto;
        margin: 0px;
        z-index: 1005;
        transform: translate(0px, 151px);
      "
      data-popper-placement="bottom-end"
      @mouseenter="mouseenterPopper"
      @mouseleave="mouseleavePopper"
      v-if="isSelf"
    >
      <div
        class="bili-card-dropdown-popper__item"
        data-key="CANCEL"
        @click="(event) => handleDel(item, event)"
      >
        取消收藏
      </div>
      <div
        class="bili-card-dropdown-popper__item"
        data-key="COPY"
        @click="(event) => handleCopy(item, event)"
      >
        复制至
      </div>
      <div
        class="bili-card-dropdown-popper__item"
        data-key="MOVE"
        @click="(event) => handleMove(item, event)"
      >
        移动至
      </div>
    </div>
  </div>
</template>

<style scoped>
.items__item {
  position: relative;
}
</style>
