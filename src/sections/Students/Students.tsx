import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Modal, Button, Input, Select } from 'antd'; 
import { db } from '@/firebase'; 
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Pencil, Trash, Eye } from 'lucide-react';
import './StudentsPage.css'; 


interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  address: string;
  phone: string;
  email: string;
  guardianName: string;
  dob: string;
  gender: string;
  admissionDate: string;
  bloodGroup: string;
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Student>({
    id: '',
    name: '',
    class: '',
    section: '',
    rollNumber: '',
    address: '',
    phone: '',
    email: '',
    guardianName: '',
    dob: '',
    gender: '',
    admissionDate: '',
    bloodGroup: '',
  });
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const studentsCollection = collection(db, 'students');

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await getDocs(studentsCollection);
        setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Student[]);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (selectedStudentId) {
        // Update existing student
        await updateDoc(doc(db, 'students', selectedStudentId), formData);
      } else {
        // Add new student
        await addDoc(studentsCollection, formData);
      }
      // Refresh students list
      const updatedStudents = await getDocs(studentsCollection);
      setStudents(
        updatedStudents.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Student[]
      );
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = (student: Student) => {
    setSelectedStudentId(student.id);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (student: Student) => {
    try {
      await deleteDoc(doc(db, 'students', student.id));
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      class: '',
      section: '',
      rollNumber: '',
      address: '',
      phone: '',
      email: '',
      guardianName: '',
      dob: '',
      gender: '',
      admissionDate: '',
      bloodGroup: '',
    });
    setSelectedStudentId(null);
  };

  return (
    <div className="students-page">
      <div className="header">
        <h1>Students List</h1>
        <button onClick={() => setIsModalOpen(true)} className="add-button">
          Add Student
        </button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>{student.section}</td>
              <td>{student.rollNumber}</td>
              <td>
                <Eye className="icon view-icon" />
                <Pencil className="icon edit-icon" onClick={() => handleEdit(student)} />
                <Trash className="icon delete-icon" onClick={() => handleDelete(student)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
          <form onSubmit={handleSubmit} className="student-form">
            <h2>{selectedStudentId ? 'Edit Student' : 'Add New Student'}</h2>
            {Object.keys(formData).map((field) => (
              <div key={field} className="form-group">
                <label>{field}</label>
                <Input
                  type={field === 'dob' || field === 'admissionDate' ? 'date' : 'text'}
                  name={field}
                  value={formData[field as keyof Student]}
                  onChange={handleInputChange}
                  required
                />
              </div>
            ))}
            <div className="form-actions">
              <Button type="primary" htmlType="submit">
                {selectedStudentId ? 'Update' : 'Submit'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentsPage;
