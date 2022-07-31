const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'longluucong1308@gmail.com',
    pass: 'qmdutxakkhjqsnmf',
  },
});

const from = 'MobileS <longluucong1308@gmail.com>';

exports.sendAnEmail = (to, subject, body) => {
  mailer.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: body,
  });
};

exports.sendMultipleEmails = (mails, subject, text) => {
    mailer.sendMail({
      from: from,
      to: mails,
      subject: subject,
      text: text
    })
};
