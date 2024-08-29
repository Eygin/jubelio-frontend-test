import { AxiosResponse } from "axios";
import axios from "./axios";
import Cookies from "js-cookie";

type ApiConfig = {
  url: string;
  headers?: Record<string, string | number | Array<object | string | number>>;
  auth?: boolean;
};

type getApiProps = ApiConfig & {
  params?: object;
};

type postApiProps = ApiConfig & {
  data:
    | FormData
    | Record<string, string | number | Array<object | string | number>>;
};

type putApiProps = ApiConfig & {
  data:
    | FormData
    | Record<string, string | number | Array<object | string | number>>;
  params?: object;
};

export const getApi = async ({
  url,
  headers,
  auth = true,
  params = {},
}: getApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        console.log("user_data?.token", user_data?.token)

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "GET",
      headers: headers_custom,
      params: params,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const downloadApi = async ({
  url,
  headers,
  auth = true,
  params = {},
}: getApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {};

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "GET",
      headers: headers_custom,
      params: params,
      responseType: "blob",
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const postApi = async ({
  url,
  headers,
  auth = false,
  data = {},
}: postApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "POST",
      headers: headers_custom,
      data: data as Record<
        string,
        string | number | Array<object | string | number>
      >,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const postApiForm = async ({
  url,
  headers,
  auth = false,
  data = {},
}: postApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "POST",
      headers: headers_custom,
      data: data as FormData,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const putApi = async ({
  url,
  headers,
  data = {},
  auth = false,
  params = {},
}: putApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "PUT",
      headers: headers_custom,
      data: data as Record<
        string,
        string | number | Array<object | string | number>
      >,
      params: params,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const putApiForm = async ({
  url,
  headers,
  data = {},
  auth = false,
  params = {},
}: putApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "PUT",
      headers: headers_custom,
      data: data as FormData,
      params: params,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const deleteApi = async ({
  url,
  headers,
  auth = false,
  params = {},
}: getApiProps): Promise<AxiosResponse> => {
  return new Promise((res, rej) => {
    let headers_custom: Record<string, string> = {
      Accept: "application/json",
    };

    if (auth) {
      const user = Cookies.get("token");
      if (user !== undefined) {
        const user_data = JSON.parse(user);

        headers_custom = {
          ...headers,
          Authorization: "Bearer " + user_data?.token,
        };
      }
    }

    axios({
      url: url,
      method: "DELETE",
      headers: headers_custom,
      params: params,
    })
      .then((result) => {
        res(result);
      })
      .catch((err) => {
        rej(err);
      });
  });
};
