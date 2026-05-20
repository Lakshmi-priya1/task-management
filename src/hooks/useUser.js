import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  fetchUsers, createUserThunk, updateUserThunk, deleteUserThunk,
} from "../store/slices/userSlice";
import { getUserById } from "../services/userService";
import { parseValidationErrors, hasFieldErrors } from "../utils/validationErrorHandler";

export const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (t) => { t.style.marginTop = "70px"; },
});

export const USER_ROLES = ["ADMIN", "PROJECT_MANAGER", "TEAM_LEAD", "EMPLOYEE"];

export const emptyForm = {
  name: "", email: "", password: "", role: "EMPLOYEE",
};

export function useUser() {
  const dispatch = useDispatch();

  const rawList = useSelector((state) => state.users.list);
  const loading  = useSelector((state) => state.users.loading);
  const users    = Array.isArray(rawList)
    ? rawList
    : Array.isArray(rawList?.content)
      ? rawList.content
      : [];

  const [keyword,   setKeywordLocal] = useState("");
  const [role,      setRoleLocal]    = useState("");
  const [page,      setPageLocal]    = useState(0);
  const [editing,   setEditing]      = useState(null);   // holds userId when editing
  const [form,      setForm]         = useState(emptyForm);
  const [errors,    setErrors]       = useState({});
  const [modalOpen, setModalOpen]    = useState(false);
  const [viewOpen,  setViewOpen]     = useState(false);
  const [selected,  setSelected]     = useState(null);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const resetForm = useCallback(() => { setEditing(null); setForm(emptyForm); }, []);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // client-side filter
  const filteredUsers = users.filter((u) => {
    const matchesKeyword = !keyword ||
      u.name?.toLowerCase().includes(keyword.toLowerCase()) ||
      u.email?.toLowerCase().includes(keyword.toLowerCase());
    const matchesRole = !role || u.role === role;
    return matchesKeyword && matchesRole;
  });

  // client-side pagination
  const PAGE_SIZE  = 5;
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pagedUsers = filteredUsers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleView = (row) => { setSelected(row); setViewOpen(true); };

  // ✅ Populate form with existing data and open modal in edit mode.
  // If the user object does not include password, fetch the full record.
  const handleEdit = async (row) => {
    setEditing(row.userId);
    setErrors({});

    const populateForm = (user) => {
      setForm({
        name:     user.name     ?? "",
        email:    user.email    ?? "",
        password: user.password ?? "",
        role:     user.role     ?? "EMPLOYEE",
      });
      setModalOpen(true);
    };

    if (row.password) {
      populateForm(row);
      return;
    }

    try {
      const userDetails = await getUserById(row.userId);
      populateForm(userDetails);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      Toast.fire({ icon: "error", title: "Unable to load user details" });
    }
  };

  // ✅ Handles both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (editing) {
      // ── UPDATE ──
      const result = await dispatch(updateUserThunk({ id: editing, data: form }));
      if (updateUserThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "User updated" });
        setModalOpen(false);
        resetForm();
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) setErrors(fieldErrors);
        else Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
      }
    } else {
      // ── CREATE ──
      const result = await dispatch(createUserThunk(form));
      if (createUserThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "User created" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchUsers());
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) setErrors(fieldErrors);
        else Toast.fire({ icon: "error", title: fieldErrors._general || "Create failed" });
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete User?", icon: "warning", showCancelButton: true });
    if (res.isConfirmed) {
      const result = await dispatch(deleteUserThunk(id));
      if (deleteUserThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchUsers());
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  const openAddModal    = () => { resetForm(); setModalOpen(true); };
  const closeModal      = () => { setModalOpen(false); resetForm(); setErrors({}); };
  const closeViewDrawer = () => setViewOpen(false);

  return {
    users: pagedUsers, allUsers: users, loading, totalPages, keyword, role, page,
    setKeyword:  (v) => { setKeywordLocal(v); setPageLocal(0); },
    setRole:     (v) => { setRoleLocal(v);    setPageLocal(0); },
    setPage:     setPageLocal,
    editing, form, setForm, errors,
    modalOpen, openAddModal, closeModal,
    viewOpen, selected, handleView, closeViewDrawer,
    handleEdit, handleSubmit, handleDelete,
  };
}