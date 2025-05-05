import request from '@/service/bilibili/request';

export const all = ({ upMid }, success, failure) => {
  if (!upMid) return;

  let url = 'https://api.bilibili.com/x/v3/fav/folder/created/list-all';
  let params = {
    up_mid: upMid,
  };
  return request.get(url, params, success, failure);
};
