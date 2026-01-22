import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function DisplaySchedule() {
    const [schedules, setSchedules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('http://localhost:3000/TrainerSchedule/');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const confirmDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) {
            await deleteSchedule(id);
        }
    };

    const deleteSchedule = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/TrainerSchedule/delete/${id}`);
            alert('Schedule deleted successfully');
            fetchSchedules(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Error deleting schedule');
        }
    };

    const downloadReport = () => {
        const doc = new jsPDF();
        
      
        const logoURL = 'Images/Gymflex_Logo_1.jpg'; 
      
        doc.addImage(logoURL, 'PNG', 20, 20, 20, 20); 
        doc.text('Schedule Report', 60, 22); 
      
        doc.autoTable({
          startY: 40, 
          theme: 'striped',
          columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 40 }, 2: { cellWidth: 40 }, 3: { cellWidth: 50 }, 4: { cellWidth: 40 }, 5: { cellWidth: 'auto' } },
          head: [['Date', 'Member ID', 'Timeslot', 'Trainer Name', 'Status']],
          body: schedules.map(schedule => [schedule.Date, schedule.Member_id, schedule.timeslot, schedule.Trainer_name, schedule.status]),
        });
      
        doc.save('schedule_report.pdf');
    };

    const styles = {
        container: {
            backgroundColor: '#222',
            color: '#fff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
        },
        table: { borderCollapse: "collapse" },
        th: {
            backgroundColor: "#343a40",
            color: "#fff",
            padding: "10px"
        },
        td: {
            border: "1px solid #ddd",
            padding: "10px"
        },
        button: {
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
            marginRight: "5px"
        },
        deleteButton: {
            backgroundColor: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.container}>
            <h2>Schedule Details</h2>
            <button onClick={downloadReport}>Download Report</button>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Member ID</th>
                        <th style={styles.th}>Timeslot</th>
                        <th style={styles.th}>Trainer Name</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.map(schedule => (
                        <tr key={schedule._id}>
                            <td style={styles.td}>{schedule.Date}</td>
                            <td style={styles.td}>{schedule.Member_id}</td>
                            <td style={styles.td}>{schedule.timeslot}</td>
                            <td style={styles.td}>{schedule.Trainer_name}</td>
                            <td style={styles.td}>{schedule.status}</td>
                            <td style={styles.td}>
                                <button style={styles.button} onClick={() => navigate(`/updatetsch/${schedule._id}`)}>Edit</button>
                                <button style={styles.deleteButton} onClick={() => confirmDelete(schedule._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DisplaySchedule;
