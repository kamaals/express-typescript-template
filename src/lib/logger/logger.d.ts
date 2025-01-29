export type MorganMessage = {
  body?: Record<string, any>;
  query?: Record<string, any>;
  params?: Record<string, any>;
  validation?: Record<string, any>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "OPTION" | "DELETE";
  url?: string;
  status: string;
  responseTime?: string;
  remote?: string;
  contentLength?: string;
  agent?: string;
  level: "error" | "info" | "http" | "debug" | "success" | "warn";
  stack?: string;
  name?: string;
  message: string;
  timestamp: string;
  subtitle: string;
};
