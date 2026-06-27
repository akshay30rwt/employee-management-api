const express = require('express');
const mongoose = require('mongoose');
const Employee = require('./models/employee');

const app = express();
app.use(express.json());
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/employeedb').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Connection failed', error);
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Employee Management API is running'
    });
});

app.get('/employees', async (req, res) => {  
    try {
        const employees = await Employee.find();
        const { department } = req.query;

        if(!department) {
            if(employees.length === 0) {
                return res.status(404).json({
                    message: 'There are no employees'
                });
            }
            return res.status(200).json(employees);
        }

        const filteredEmployees = employees.filter(employee => 
            employee.department.toLowerCase().includes(department.toLowerCase())
        );
        if(filteredEmployees.length === 0) {
            return res.status(404).json({
                message: `No employees in ${department} department`
            });
        }

        res.status(200).json(filteredEmployees);
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.get('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findById(id);
        if(!employee) {
            return res.status(404).json({
                message: `Employee with ID: ${id} not found`
            });
        }

        res.status(200).json(employee);
    }
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.post('/employees', async (req, res) => {
    try {
        const { name, department, salary, position } = req.body;
        const employee = new Employee({ name, department, salary, position });
        await employee.save();

        res.status(201).json({
            message: 'Employee added successfully',
            employee
        });
    }
    catch(error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.put('/employees/:id', async (req, res) => {
    try {
        const { name, department, salary, position } = req.body;
        const { id } = req.params;

        const updatedEmployee = await Employee.findByIdAndUpdate(id, { name, department, salary, position }, { new: true });
        if(!updatedEmployee) {
            return res.status(404).json({
                message: `Employee with ID: ${id} not found`
            });
        }

        res.status(200).json({
            message: 'Employee updated successfully',
            updatedEmployee
        });
    }
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.delete('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if(!deletedEmployee) {
            return res.status(404).json({
                message: `Employee with ID: ${id} not found`
            });
        }

        res.status(200).json({
            message: 'Employee deleted successfully',
            deletedEmployee
        });
    }
    catch(error) {
        if(error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
});