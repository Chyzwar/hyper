import type ResponseOptions from "../types/ResponseOptions";

export const defaultResponseOptions: Readonly<ResponseOptions> = {
  etag: false,
  compression: false,
};
