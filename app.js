require('./config/config');

const express = require('express')
var {mongoose} = require('./db/mongoose');
var {Mail} = require('./models/mail');
const app = express()
const PORT = 3400 || process.env.PORT;
const bodyParser = require('body-parser')
mongoose.connect('mongodb://localhost:27017/SpamMail', {useNewUrlParser: true});


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const SpamMail = async (email, sender,subject, message)=>{
const msg = {
  to: `${email}`,
  from: `${sender}`,
  subject: `${subject}`,
  text: `${message}`,
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
try{
  await sgMail.send(msg);
}catch(err){
  console.log("Something didnt work out", err)
}

}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/sendMail', async(req, res)=>{
  let email = req.body.email;
  let sender = req.body.sender;
  let message = req.body.message;
  let subject = req.body.subject;
  let mailInfo = {
    email: email,
    sender: sender,
    message: message,
    subject: subject
  }
  //saving mail to db
  let spamMailData = new Mail(mailInfo)
  const spamMailSave = await spamMailData.save()
  console.log(spamMailSave)
  //sending mail using sendgrid
   await SpamMail(email, sender, subject, message);
  res.sendFile(__dirname + '/sent.html')
});

app.listen(PORT, (err) => {
    err ? console.log("There was an error " + err) : console.log("Port is up on " + PORT)
})