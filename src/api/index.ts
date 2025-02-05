import { heartBeat } from "@/api/status/heart-beat";
import { Router } from "express";

export const getApiRouter = () => {
  const router = Router();
  heartBeat(router);

  return router;
};
