const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config.json');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.mailer_username, 
    pass: config.mailer_password,
  },
})

const todayDate = () => {
  const today = new Date()
  return today.toDateString();
}

const billsBreakdown = (bills) => {
  return bills.reduce((string, bill) => {
    return string += `<li>${bill.type}: $${bill.amount}</li>`
  }, '')
}

router.post('/send-email', (req, res, next) => {
  const { tenant, bills, totalDue } = req.body;

  const mailOptions = {
    from: config.mailer_username,
    to: tenant.email,
    subject: `*** New Rent Bill: ${todayDate()} ***`,
    html: `<p>Hi ${tenant.first_name},</p>
              <p>Rent + utilities for this month is: <strong>$${totalDue}</strong></p>
              <p>Here is a breakdown of the utilities:</p>
                ${billsBreakdown(bills)}
              <p>Thanks, and let me know if you have questions</p>
              <br/><br/>
            <p>-Lee Chow</p>
          `,
  }
  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      res.status(500).json({
        status: 'error',
        message: err,
      })
    } else {
      res.status(200).json({
        status: 'success',
        message: info,
      })
    }
  })
})


module.exports = router;

