require('./config');

const express = require('express')
const app = express()
const PORT = 3400 || process.env.PORT;
const bodyParser = require('body-parser')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const AngieSoSmurt = async (email, sender,subject, message)=>{
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

app.post('/angieSmurt', async(req, res)=>{
  let email = req.body.email;
  let sender = req.body.sender;
  let message = req.body.message;
  let subject = req.body.subject;
   await AngieSoSmurt(email, sender, subject, message);
  res.sendFile(__dirname + '/sent.html')
});

app.listen(PORT, (err) => {
    err ? console.log("There was an error " + err) : console.log("Port is up on " + PORT)
})