import React from "react";

const education = [
  { id: 1, name: "XYZ", place: "Bengaluru", stddeg: "PG", grade: "A+" },
  { id: 2, name: "ABC", place: "Bengaluru", stddeg: "UG", grade: "B" },
];

function Education() {
  return (
    <table>
      <thead>
        <tr>
          <th>id</th><th>name</th><th>place</th><th>education</th><th>grade</th>
        </tr>
      </thead>
      <tbody>
        {education.map(e => (
          <tr key={e.id}>
            <td>{e.id}</td>
            <td>{e.name}</td>
            <td>{e.place}</td>
            <td>{e.stddeg}</td>
            <td>{e.grade}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Education;