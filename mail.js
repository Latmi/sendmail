// Подключение конфига
var config = require('./config.json');
// Использование конфига
console.dir(config);

const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));


// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>E-mail: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>&raquo;${req.body.message}&laquo;</p>
    `;
    
let smtpConfig = {
    host: 'cf716.hc.ru',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'info@c24802.shared.hc.ru',
        pass: 'ou[kDg6{^-Wu'
    }
};
let transporter = nodemailer.createTransport(smtpConfig);

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Cyprus-Event.info" <mail@cyprus-event.info>', // sender address
      to: 'sbezuglii@mail.ru', // list of receivers
      subject: 'New mail from cyprus-event.info', // Subject line
      text: 'Hi!!!', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
});

app.listen(3000, '0.0.0.0', () => console.log('Server started...'));


