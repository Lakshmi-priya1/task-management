import {
  Box, Button, Typography, TextField,
  InputAdornment, Card,
} from "@mui/material";
import { AddRounded, SearchRounded, BusinessRounded } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";

import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";
import ViewDrawer from "../components/ViewDrawer";
import useOrganization from "../hooks/useOrganization";
import { getOrganizationStyles } from "../styles/organizationStyles";

const ADMIN = "ADMIN";

export default function Organization() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const sx = getOrganizationStyles(isDark);

  const { role } = useSelector((state) => state.auth);
  const canWrite = role === ADMIN;
  const canDelete = role === ADMIN;

  const {
    organizations,
    loading,
    totalPages,
    keyword,
    page,
    editing,
    form,
    setForm,
    errors,
    modalOpen,
    openAddModal,
    closeModal,
    viewOpen,
    selected,
    handleView,
    closeViewDrawer,
    handleSubmit,
    handleDelete,
    handleEdit,
    setKeyword,
    setPage,
  } = useOrganization();

  return (
    <Box>
      <Box sx={sx.toolbarSx}>
        <TextField
          size="small"
          placeholder="Search organization..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={sx.inputSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRounded />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: "auto" }}>
          {canWrite && (
            <Button startIcon={<AddRounded />} onClick={openAddModal} sx={sx.addButtonSx}>
              Add Organization
            </Button>
          )}
        </Box>
      </Box>

      <Card sx={sx.cardSx}>
        <Box sx={sx.cardHeaderSx}>
          <BusinessRounded sx={sx.cardIconSx} />
          <Typography sx={sx.cardTitleSx}>Organization List</Typography>
        </Box>

        <DataTable
           data={organizations || []}
  columns={["Organization", "Address"]}
  fields={["companyName", "address"]}
  idField="orgId"
          loading={loading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          handleDelete={handleDelete}
          handleView={handleView}
          handleEdit={handleEdit}
          hideEdit={!canWrite}
          hideDelete={!canDelete}
        />
      </Card>

      <ViewDrawer
        isOpen={viewOpen}
        onClose={closeViewDrawer}
        title="Organization Details"
        sections={
          selected ? [
            {
              heading: "Organization Info",
              fields: [
                { label: "Organization ID", value: selected.orgId, badge: true },
                { label: "Company Name", value: selected.companyName },
                { label: "Address", value: selected.address },
              ],
            },
          ] : []
        }
      />

      {canWrite && (
        <FormModal
          isOpen={modalOpen}
          handleClose={closeModal}
          title={editing ? "Edit Organization" : "Add Organization"}
          subtitle={editing ? "Update organization details" : "Fill in details to add organization"}
          formData={form}
          setFormData={setForm}
          handleSubmit={handleSubmit}
          submitLabel={editing ? "Save Changes" : "Add Organization"}
          errors={errors}
          sections={[
            {
              label: "Basic Info",
              fields: [
                { name: "companyName", label: "Company Name", type: "text" },
                { name: "address", label: "Address", type: "text", multiline: true, rows: 3 },
              ],
            },
          ]}
        />
      )}
    </Box>
  );
}
