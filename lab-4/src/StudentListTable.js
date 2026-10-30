import React, { useState, useEffect } from "react";

const studlist = [
  { slno: 1, name: "stud1", usn: "rvce1", tmarks: 150 },
  { slno: 2, name: "stud2", usn: "rvce2", tmarks: 145 },
];

function StudentListTable() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [usn, setUsn] = useState("");
  const [tmarks, setTmarks] = useState("");

  useEffect(() => {
    setTimeout(() => setStudents(studlist), 5000);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const newStudent = { slno: students.length + 1, name, usn, tmarks };
    setStudents([...students, newStudent]);
    setName(""); setUsn(""); setTmarks("");
  }

  return (
    <>
      <hr />
      <table>
        <thead>
          <tr>
            <th>Sl No</th><th>Student Name</th><th>USN</th><th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.slno}>
              <th>{s.slno}</th><th>{s.name}</th><th>{s.usn}</th><th>{s.tmarks}</th>
            </tr>
          ))}
        </tbody>
      </table>
      <hr />
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={usn} onChange={(e) => setUsn(e.target.value)} placeholder="USN" />
        <input value={tmarks} onChange={(e) => setTmarks(e.target.value)} placeholder="Total Marks" />
        <button>Add</button>
      </form>
    </>
  );
}

export default StudentListTable;