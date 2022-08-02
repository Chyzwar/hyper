import type ResponseOptions from "../types/ResponseOptions.js";

export const defaultResponseOptions: Readonly<ResponseOptions> = {
  etag: false,
  compression: false,
};
