import {
  Box, Button, Typography, TextField,
  InputAdornment, Select, MenuItem, FormControl, Card,
} from "@mui/material";
import {
  AddRounded, SearchRounded, FilterListRounded, ManageAccountsRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import DataTable  from "../components/DataTable";
import FormModal  from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";

import { useUser, USER_ROLES } from "../hooks/useUser";
import { getUserStyles }       from "../styles/userStyles";

export default function Users() {
  const theme  = useTheme();
  const isDark = theme.palette.mode === "dark";
  const sx     = getUserStyles(isDark);

  const {
    users, allUsers, loading, totalPages, keyword, role, page,
    setKeyword, setRole, setPage,
    editing, form, setForm, errors,
    modalOpen, openAddModal, closeModal,
    viewOpen, selected, handleView, closeViewDrawer,
    handleEdit, handleSubmit, handleDelete,
  } = useUser();

  return (
    <Box>
      {/* TOOLBAR */}
      <Box sx={sx.toolbarSx}>
        <TextField
          size="small" placeholder="Search user..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={sx.inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchRounded /></InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={sx.filterSx}>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start"><FilterListRounded /></InputAdornment>
            }
          >
            <MenuItem value="">All Roles</MenuItem>
            {USER_ROLES.map((r) => (
              <MenuItem key={r} value={r}>{r.replace(/_/g, " ")}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button startIcon={<AddRounded />} onClick={openAddModal} sx={sx.addButtonSx}>
          Add User
        </Button>
      </Box>

      {/* TABLE */}
      <Card sx={sx.cardSx}>
        <Box sx={sx.cardHeaderSx}>
          <ManageAccountsRounded sx={sx.cardIconSx} />
          <Typography sx={sx.cardTitleSx}>User List</Typography>
        </Box>
        <DataTable
          data={users}
          columns={["Name", "Email", "Role"]}
          fields={["name", "email", "role"]}
          idField="userId"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={(id) => {
            const row = allUsers.find((u) => String(u.userId) === String(id));
            if (row) handleView(row);
          }}
          // ✅ wire edit — DataTable passes the full row object
          handleEdit={handleEdit}
        />
      </Card>

      {/* VIEW DRAWER */}
      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="User Details"
        status={selected?.role}
        sections={
          selected ? [
            {
              heading: "Account Info",
              fields: [
                { label: "User ID", value: selected.userId },
                { label: "Name",    value: selected.name },
                { label: "Email",   value: selected.email },
                { label: "Role",    value: selected.role, badge: true },
              ],
            },
          ] : []
        }
      />

      {/* FORM MODAL — title & submitLabel change based on edit vs create */}
      <FormModal
        isOpen={modalOpen}
        handleClose={closeModal}
        title={editing ? "Edit User" : "Add User"}
        subtitle={editing ? "Update the user's details" : "Create a new system user with a role"}
        formData={form}
        setFormData={setForm}
        handleSubmit={handleSubmit}
        submitLabel={editing ? "Update User" : "Create User"}
        errors={errors}
        sections={[
          {
            label: "Account Info",
            fields: [
              { name: "name",     label: "Name",     type: "text",     half: true },
              { name: "email",    label: "Email",    type: "email",    half: true },
              { name: "password", label: "Password (leave blank to keep)", type: "password", half: true },
              {
                name: "role", label: "Role", type: "select", half: true,
                options: USER_ROLES.map((r) => ({ value: r, label: r.replace(/_/g, " ") })),
              },
            ],
          },
        ]}
      />
    </Box>
  );
}