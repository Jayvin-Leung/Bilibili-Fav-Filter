import { createApp, h, ref } from 'vue';
import { all as allFavApi } from '@/service/bilibili/api/fav';
import Main from './views/main/Main.vue';

let attr = null;
let mid = location.pathname.split('/')[1];
let originInfoBatch = null;
let customInfoBatch = null;
let originListMain = null;
let customListMain = null;
const mediaId = ref(0);
const mode = ref('list');

const render = () => {
  originInfoBatch = document.querySelector('.favlist-main .favlist-info-batch');
  if (customInfoBatch) customInfoBatch.parentNode.removeChild(customInfoBatch);
  customInfoBatch = originInfoBatch.cloneNode(true);
  customInfoBatch.id = 'custom-batch-btn';
  customInfoBatch.addEventListener('click', () => {
    if (mode.value === 'list') {
      mode.value = 'batch';
      customInfoBatch.innerHTML = '返回';
    } else {
      mode.value = 'list';
      customInfoBatch.innerHTML = '批量操作';
    }
  });
  originInfoBatch.parentNode.append(customInfoBatch);

  createApp({
    render: () => {
      return h(Main, {
        [attr.name]: attr.value,
        mid,
        mediaId: mediaId.value,
        mode: mode.value,
        'onUpdate:mode': (newValue) => {
          mode.value = newValue;
          if (newValue === 'list') {
            customInfoBatch.innerHTML = '批量操作';
          } else {
            customInfoBatch.innerHTML = '返回';
          }
        },
      });
    },
  }).mount(
    (() => {
      originListMain = document.querySelector('.favlist-main .fav-list-main');
      attr = Object.values(originListMain.attributes).find((item) => {
        return item.name.startsWith('data-v-');
      });
      if (customListMain) customListMain.parentNode.removeChild(customListMain);
      customListMain = originListMain.cloneNode();
      customListMain.id = 'custom-list-main';
      originListMain.parentNode.append(customListMain);
      return customListMain;
    })()
  );
};

const replace = () => {
  if (originInfoBatch) originInfoBatch.style.display = 'none';
  if (originListMain) originListMain.style.display = 'none';
  if (customInfoBatch) customInfoBatch.style.display = '';
  if (customListMain) customListMain.style.display = '';
};

const restore = () => {
  if (originInfoBatch) originInfoBatch.style.display = '';
  if (originListMain) originListMain.style.display = '';
  if (customInfoBatch) customInfoBatch.style.display = 'none';
  if (customListMain) customListMain.style.display = 'none';
};

(async () => {
  const result = await allFavApi({ upMid: mid });
  const favs = result?.list;

  const load_observer = new MutationObserver(() => {
    let items = null;
    const sidebar = document.querySelector('.favlist-aside .vui_sidebar');
    if (!sidebar || !sidebar.querySelector('.vui_sidebar-item--active')) return;

    load_observer.disconnect();
    render();

    const _ = () => {
      if (!items) items = Array.from(sidebar.querySelectorAll('.fav-sidebar-item'));
      const actived = sidebar.querySelector('.vui_sidebar-item--active');
      if (actived) {
        replace();
        const fid = favs[items.indexOf(actived.parentNode)]?.id;
        if (mediaId.value !== fid) mediaId.value = fid;
      } else {
        restore();
      }
    };

    _();
    new MutationObserver(_).observe(sidebar, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true,
    });
  });
  load_observer.observe(document.body, { childList: true, subtree: true });
})();
