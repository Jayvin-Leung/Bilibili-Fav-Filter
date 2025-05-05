import request from '@/service/bilibili/request';

export const list = (
  { mediaId, pn = 1, ps = 36, tid = 0, type = 0, keyword = '', order = 'mtime' },
  success,
  failure
) => {
  if (!mediaId) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/list';
  let params = {
    media_id: mediaId,
    pn,
    ps,
    tid,
    type,
    keyword,
    order,
  };
  return request.get(url, params, success, failure);
};

export const del = ({ mediaId, resources }, success, failure) => {
  if (!mediaId || !resources) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/batch-del';
  let params = {
    media_id: mediaId,
    resources,
  };
  return request.post(url, params, success, failure);
};

export const copy = ({ mid, srcMediaId, tarMediaId, resources }, success, failure) => {
  if (!mid || !srcMediaId || !tarMediaId || !resources) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/copy';
  let params = {
    mid,
    src_media_id: srcMediaId,
    tar_media_id: tarMediaId,
    resources,
  };
  return request.post(url, params, success, failure);
};

export const move = ({ mid, srcMediaId, tarMediaId, resources }, success, failure) => {
  if (!mid || !srcMediaId || !tarMediaId || !resources) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/move';
  let params = {
    mid,
    src_media_id: srcMediaId,
    tar_media_id: tarMediaId,
    resources,
  };
  return request.post(url, params, success, failure);
};

export const clean = ({ mediaId }, success, failure) => {
  if (!mediaId) return;

  let url = 'https://api.bilibili.com/x/v3/fav/resource/clean';
  let params = {
    media_id: mediaId,
  };
  return request.post(url, params, success, failure);
};
