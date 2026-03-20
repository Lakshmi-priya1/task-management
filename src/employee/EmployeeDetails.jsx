import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEmployeeById } from "../services/employeeService";

function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    getEmployeeById(id)
      .then(setEmployee)
      .catch(console.error);
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Employee Details</h3>
      <div className="card p-3">
        <p><strong>ID:</strong> {employee.id}</p>
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Username:</strong> {employee.username}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Phone:</strong> {employee.phone}</p>
        <p><strong>Website:</strong> {employee.website}</p>

        <hr />
        <h5>Address</h5>
        <p><strong>Street:</strong> {employee.address.street}</p>
        <p><strong>City:</strong> {employee.address.city}</p>
        <p><strong>Zipcode:</strong> {employee.address.zipcode}</p>

        <hr />
        <h5>Company</h5>
        <p><strong>Name:</strong> {employee.company.name}</p>
        <p><strong>Catch Phrase:</strong> {employee.company.catchPhrase}</p>
      </div>
    </div>
  );
}

export default EmployeeDetails;