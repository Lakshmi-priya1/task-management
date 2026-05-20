import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  fetchOrganizations,
  addOrganizationThunk,
  updateOrganizationThunk,
  softDeleteOrganizationThunk,
  setKeyword,
  setPage,
} from "../store/slices/organizationSlice";

import { parseValidationErrors, hasFieldErrors } from "../utils/validationErrorHandler";

export const Toast = Swal.mixin({
  toast: true, position: "top-end",
  showConfirmButton: false, timer: 2500,
  didOpen: (t) => { t.style.marginTop = "70px"; },
});

export const emptyForm = { companyName: "", address: "" };

export default function useOrganization() {
  const dispatch = useDispatch();

  const { list: organizations, loading, totalPages, keyword, page } =
    useSelector((state) => state.organizations);

  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen,  setViewOpen]  = useState(false);
  const [selected,  setSelected]  = useState(null);
  const [errors,    setErrors]    = useState({});

  const resetForm   = useCallback(() => { setEditing(null); setForm(emptyForm); }, []);
  const clearErrors = () => setErrors({});

  useEffect(() => {
    dispatch(fetchOrganizations({ keyword, page }));
  }, [dispatch, keyword, page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const payload = { companyName: form.companyName, address: form.address };

    if (editing) {
      const result = await dispatch(updateOrganizationThunk({ id: editing.orgId, data: payload }));
      if (updateOrganizationThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Updated Successfully" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchOrganizations({ keyword, page }));
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) setErrors(fieldErrors);
        else Toast.fire({ icon: "error", title: fieldErrors._general || "Update failed" });
      }
    } else {
      const result = await dispatch(addOrganizationThunk(payload));
      if (addOrganizationThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Added Successfully" });
        setModalOpen(false);
        resetForm();
        dispatch(fetchOrganizations({ keyword, page }));
      } else {
        const fieldErrors = parseValidationErrors(result.payload);
        if (hasFieldErrors(fieldErrors)) setErrors(fieldErrors);
        else Toast.fire({ icon: "error", title: fieldErrors._general || "Add failed" });
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: "Delete Organization?", icon: "warning", showCancelButton: true });
    if (res.isConfirmed) {
      const result = await dispatch(softDeleteOrganizationThunk(id));
      if (softDeleteOrganizationThunk.fulfilled.match(result)) {
        Toast.fire({ icon: "success", title: "Deleted" });
        dispatch(fetchOrganizations({ keyword, page }));
      } else {
        Toast.fire({ icon: "error", title: "Delete failed" });
      }
    }
  };

  const handleView = (id) => {
    setSelected(organizations.find((o) => o.orgId === id));
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setEditing(row);
    clearErrors();
    setForm({ companyName: row.companyName || "", address: row.address || "" });
    setModalOpen(true);
  };

  const openAddModal  = () => { resetForm(); clearErrors(); setModalOpen(true); };
  const closeModal    = () => { setModalOpen(false); resetForm(); clearErrors(); };
  const closeViewDrawer = () => setViewOpen(false);

  return {
    organizations, loading, totalPages, keyword, page,
    setKeyword: (val) => dispatch(setKeyword(val)),
    setPage:    (val) => dispatch(setPage(val)),
    editing, form, setForm, errors,
    modalOpen, openAddModal, closeModal,
    viewOpen, selected, handleView, closeViewDrawer,
    handleSubmit, handleDelete, handleEdit,
  };
}
