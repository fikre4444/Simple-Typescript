export enum Status { NOT_STARTED, IN_PROGRESS, FINISHED };

export interface Todo {
  name: string,
  urgency: "normal" | "urgent",
  description: string,
  status: Status
};