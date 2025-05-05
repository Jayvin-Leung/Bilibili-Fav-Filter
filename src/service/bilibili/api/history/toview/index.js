import request from '@/service/bilibili/request';
import biliUtil from '@/utils/biliUtil';

export const add = ({ bvid }, success, failure) => {
  if (!bvid) return;

  let url = 'https://api.bilibili.com/x/v2/history/toview/add';
  let params = {
    aid: biliUtil.bv2av(bvid),
  };
  return request.post(url, params, success, failure);
};

export const del = ({ bvid }, success, failure) => {
  if (!bvid) return;

  let url = 'https://api.bilibili.com/x/v2/history/toview/del';
  let params = {
    aid: biliUtil.bv2av(bvid),
  };
  return request.post(url, params, success, failure);
};
