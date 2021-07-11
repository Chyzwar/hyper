import type { 
  Method, 
  Mode, 
  Credentials, 
  Body, 
  Redirect, 
  Headers,
} from "@hyper/http";


interface RequestOptions{
  method?: Method;
  mode?: Mode;
  credentials?: Credentials;
  redirect?: Redirect;
  body?: Body;
  headers?: Headers;
}

export default RequestOptions;
