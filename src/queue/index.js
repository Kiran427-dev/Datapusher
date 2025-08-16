import { env } from "../config/env.js";

export const DISPATCH_QUEUE = "dispatch-queue";

const jobs = [];

export function addJob(data) {
  jobs.push(data);
  processJobs();
}

async function processJobs() {
  while (jobs.length > 0) {
    const jobData = jobs.shift();
    try {
      const { handler } = await import("./dispatch.worker.js");
      await handler(jobData);
    } catch (err) {
      console.error("Job failed", err);
    }
  }
}

export function initWorker() {
  console.log("Worker initialized ");
}