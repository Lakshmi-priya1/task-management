// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer      from "./slices/authSlice";
import employeeReducer  from "./slices/employeeSlice";
import projectReducer   from "./slices/projectSlice";
import milestoneReducer from "./slices/milestoneSlice";
import taskReducer      from "./slices/taskSlice";

export default configureStore({
  reducer: {
    auth:       authReducer,
    employees:  employeeReducer,
    projects:   projectReducer,
    milestones: milestoneReducer,
    tasks:      taskReducer,
  },
});