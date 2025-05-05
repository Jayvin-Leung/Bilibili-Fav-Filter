import biliUtil from '@/utils/biliUtil';

const request = async (url, option, success, failure) => {
  if (!url || !option) {
    throw new Error('invaild url or option');
  }

  return fetch(url, option)
    .then((response) => response.json())
    .then((result) => {
      if (result.code === 0) {
        success && success(result.data);
        return result.data;
      } else {
        failure && failure(result.message);
        return result.message;
      }
    })
    .catch((e) => {
      failure && failure('请求发生错误：' + e);
      return e;
    });
};

class Request {
  get(url, params = {}, success, failure) {
    params.platform = 'web';
    const keys = Object.keys(params).sort();
    const query = keys.map((k) => `${k}=${params[k]}`).join('&');

    return request(
      query ? `${url}?${query}` : url,
      {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
      },
      success,
      failure
    );
  }

  post(url, params = {}, success, failure) {
    params.platform = 'web';
    params.csrf = biliUtil.getCsrf();
    const keys = Object.keys(params).sort();
    const query = new URLSearchParams();
    keys.forEach((k) => query.append(k, params[k]));

    return request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: query.toString(),
        credentials: 'include',
        mode: 'cors',
      },
      success,
      failure
    );
  }
}

export default new Request();
