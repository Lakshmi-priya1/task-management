// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer      from "./slices/authSlice";
import employeeReducer  from "./slices/employeeSlice";
import organizationReducer from "./slices/organizationSlice";
import projectReducer   from "./slices/projectSlice";
import milestoneReducer from "./slices/milestoneSlice";
import taskReducer      from "./slices/taskSlice";
import userReducer      from "./slices/userSlice";

export default configureStore({
  reducer: {
    auth:           authReducer,
    employees:      employeeReducer,
    organizations:  organizationReducer,
    projects:       projectReducer,
    milestones:     milestoneReducer,
    tasks:          taskReducer,
    users:          userReducer,
  },
});