const express = require('express');
const app = express();
const multer = require('multer');
const xlsx = require('xlsx');

const upload = multer({ dest: './uploads/' });

app.post('/uploadExcelFile', upload.single('excelFile'), (req, res) => {
  const excelFile = req.file;
  const workbook = xlsx.readFile(excelFile.path);
  const data = [];

  // Parse the Excel file and store the data in the database
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    data.push(...jsonData);
  });

  // Store the data in the database (e.g., MongoDB)
  // ...

  res.send('File uploaded successfully');
});

app.get('/searchData', (req, res) => {
  const searchQuery = req.query.searchQuery;

  // Retrieve the data from the database based on the search query
  // ...

  const searchData = [];
  // ...

  res.json(searchData);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});