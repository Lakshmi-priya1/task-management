import { useState } from "react";


function ChangePassword() {

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    alert("Password changed successfully!");
  };

  return (
    <div className="change-password-container">

      <div className="card shadow change-password-card">

        <div className="card-body">

          <h3 className="text-center mb-4">Change Password</h3>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Old Password</label>
              <input
                type="password"
                name="oldPassword"
                className="form-control"
                placeholder="Enter old password"
                value={form.oldPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Update Password
            </button>

          </form>

        </div>
      </div>

    </div>
  );
}

export default ChangePassword;