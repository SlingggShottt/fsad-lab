import React from "react";
class EdTable extends React.Component {
    render() {
        const education = [
            {
                id: 1,      
                name: "ABC",           
                place: "Jaipur",
                degree: "MCA",       
                grade: "A+",
            },
            {
                id: 2,       
                name: "XYZ",     
                place: "Bangalore",
                degree: "Btech",  
                grade: "O",
            },
        ]
        const edudetails = education.map(educ => <EdRow id={educ.id}
name={educ.name} place={educ.place} degree={educ.degree} grade={educ.grade} />);
        return (
            <table>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>place</th>
                    <th>education</th>
                    <th>grade</th>
                </tr>
                <tbody>
                    {edudetails}
                </tbody>
            </table>
        );
    }
}
class EdRow extends React.Component {
    render() {
        return (
            <tr>
                <td>{this.props.id}</td>   
                <td>{this.props.name}</td>   
                <td>{this.props.place}</td>
                <td>{this.props.degree}</td>   
                <td>{this.props.grade}</td>
            </tr>
        );
    }
}
class Education extends React.Component {
    render() {
        return (
            <section>
                <EdTable />
            </section>
        );
    }
}
export default Education;
