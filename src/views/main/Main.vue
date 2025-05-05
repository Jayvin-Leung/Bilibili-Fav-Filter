<script setup>
import { ref, watch } from 'vue';
import biliUtil from '@/utils/biliUtil';
import { all as allFavApi } from '@/service/bilibili/api/fav';
import {
  list as resourceListApi,
  del as delResourceApi,
  copy as copyResourceApi,
  move as moveResourceApi,
  clean as cleanResourceApi,
} from '@/service/bilibili/api/fav/resource';
import message from '@/components/bilibili/message';
import modal from '@/components/bilibili/modal';
import Modify from '@/views/template/Modify.vue';
import Filter from './header/filter/Filter.vue';
import Batch from './header/batch/Batch.vue';
import Empty from './list/Empty.vue';
import List from './list/List.vue';
import Pagination from './list/Pagination.vue';

const mode = defineModel('mode');
const props = defineProps({
  mid: {
    type: String,
    required: true,
    default: '',
  },
  mediaId: {
    type: Number,
    required: true,
    default: 0,
  },
});

let uid = biliUtil.getUid();
const filterRef = ref(null);
const params = ref({
  pn: 1,
  ps: 36,
  type: 0,
  tid: 0,
  keyword: '',
  order: 'mtime',
});
const total = ref(0);
const list = ref([]);
const selected = ref([]);

const search = () => {
  resourceListApi({ mediaId: props.mediaId, ...params.value }, (result) => {
    total.value = result.info.media_count;
    list.value = result.medias;
  });
};
const del = (resources) => {
  delResourceApi({ mediaId: props.mediaId, resources }, () => {
    message.info({ text: '操作成功' });
    setTimeout(() => {
      mode.value = 'list';
      selected.value = [];
      search();
    }, 200);
  });
};
const copy = (count, resources) => {
  allFavApi({ upMid: uid }, (result) => {
    const tarMediaId = ref(0);
    const close = modal.open({
      wrapClassName: 'fav-modify-modal-content',
      title: `将${count}个视频复制至`,
      template: Modify,
      templateProps: {
        selected: tarMediaId,
        'onUpdate:selected': (newValue) => {
          tarMediaId.value = newValue;
        },
        favs: result?.list || [],
      },
      $ok: () => {
        if (!tarMediaId.value) {
          message.info({ text: '请选择目标收藏夹' });
          return;
        }
        copyResourceApi(
          {
            mid: props.mid,
            srcMediaId: props.mediaId,
            tarMediaId: tarMediaId.value,
            resources,
          },
          () => {
            close && close();
            message.info({ text: '操作成功' });
            setTimeout(() => {
              mode.value = 'list';
              selected.value = [];
            }, 200);
          }
        );
      },
      $close: () => {
        tarMediaId.value = 0;
      },
    });
  });
};
const move = (count, resources) => {
  allFavApi({ upMid: uid }, (result) => {
    const tarMediaId = ref(0);
    const close = modal.open({
      wrapClassName: 'fav-modify-modal-content',
      title: `将${count}个视频移动至`,
      template: Modify,
      templateProps: {
        selected: tarMediaId,
        'onUpdate:selected': (newValue) => {
          tarMediaId.value = newValue;
        },
        favs: result?.list || [],
      },
      $ok: () => {
        if (!tarMediaId.value) {
          message.info({ text: '请选择目标收藏夹' });
          return;
        }
        moveResourceApi(
          {
            mid: props.mid,
            srcMediaId: props.mediaId,
            tarMediaId: tarMediaId.value,
            resources,
          },
          () => {
            close && close();
            message.info({ text: '操作成功' });
            setTimeout(() => {
              mode.value = 'list';
              selected.value = [];
              search();
            }, 200);
          }
        );
      },
      $close: () => {
        tarMediaId.value = 0;
      },
    });
  });
};
const clean = () => {
  const close = modal.open({
    title: '清除失效内容',
    template: 'span',
    templateProps: {
      innerHTML: '是否一键清除当前文件夹所有失效内容？',
    },
    $ok: () => {
      cleanResourceApi(
        {
          mediaId: props.mediaId,
        },
        () => {
          close && close();
          message.info({ text: '操作成功' });
          setTimeout(() => {
            mode.value = 'list';
            selected.value = [];
            search();
          }, 200);
        }
      );
    },
    $cancel: () => {},
  });
};
const handleFilter = (items) => {
  items.forEach((item) => {
    params.value[item.key] = item.value;
  });
  params.value.pn = 1;
  search();
};
const handleBatchAction = ({ type }) => {
  if (!type) return;
  if (type === 'clean') {
    clean();
  } else {
    if (!selected.value || selected.value.length === 0) {
      message.info({ text: '请先选择视频' });
      return;
    }

    const conut = selected.value.length;
    const resources = selected.value.join(',');
    if (type === 'del') {
      if (conut > 1) {
        const close = modal.open({
          title: '取消收藏',
          template: 'span',
          templateProps: {
            innerHTML: `是否确认取消 ${conut} 个视频？`,
          },
          $ok: () => {
            close && close();
            del(resources);
          },
          $cancel: () => {},
        });
      } else {
        del(resources);
      }
    }
    if (type === 'copy') copy(conut, resources);
    if (type === 'move') move(conut, resources);
  }
};
const handleAction = ({ type, resources }) => {
  if (!type || !resources) return;
  if (type === 'del') del(resources);
  if (type === 'copy') copy(1, resources);
  if (type === 'move') move(1, resources);
};
const handleJump = (to) => {
  params.value.pn = to;
  search();
};

watch(
  () => props.mediaId,
  () => {
    params.value = {
      pn: 1,
      ps: 36,
      type: 0,
      tid: 0,
      keyword: '',
      order: 'mtime',
    };
    filterRef.value?.reset && filterRef.value.reset();
    mode.value = 'list';
    selected.value = [];
    search();
  }
);
watch(
  () => mode.value,
  () => {
    if (mode.value === 'list') selected.value = [];
  }
);
</script>

<template>
  <div v-bind="$attrs" class="fav-list-header">
    <Filter
      v-bind="$attrs"
      ref="filterRef"
      @change="handleFilter"
      v-show="mode === 'list'"
    />
    <Batch
      v-bind="$attrs"
      :list="list || []"
      :isSelf="mid === uid"
      v-model:selected="selected"
      @batchAction="handleBatchAction"
      v-show="mode === 'batch'"
    />
  </div>
  <div v-bind="$attrs" class="items">
    <List
      v-bind="$attrs"
      :list="list || []"
      :isSelf="mid === uid"
      :isShowBatch="mode === 'batch'"
      v-model:selected="selected"
      @action="handleAction"
      v-if="list && list.length > 0"
    />
  </div>
  <Pagination
    v-bind="$attrs"
    :total="total"
    :currPage="params.pn"
    :pageSize="params.ps"
    @change="handleJump"
    v-if="list && list.length > 0"
  />
  <Empty v-bind="$attrs" :keyword="params.keyword" v-if="!list || list.length === 0" />
</template>

<style scoped></style>
