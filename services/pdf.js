const options = {};
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/rental_app';
const db = pgp(connectionString);
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

// THIS IS A TEST (not sure if I should call the backend to generate PDF or just do this in the front-end)


router.post('/generate-PDF', (req, res, next) => {
  const doc = new PDFDocument();
  let filename = "new_file";
  filename = encodeURIComponent(filename) + '.pdf';
  res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  const content = "Hello world, this is a test PDF Hello world, this is a test PDF";
  doc.y = 300;
  doc.text(content, 50, 50);
  doc.pipe(res);
  doc.end()
})

module.exports = router;