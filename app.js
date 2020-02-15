require('./config/config');

const express = require('express')
var {mongoose} = require('./db/mongoose');
var {Mail} = require('./models/mail');
const app = express()
const PORT = 3400 || process.env.PORT;
const path = require('path');
const bodyParser = require('body-parser')
mongoose.connect('mongodb://localhost:27017/SpamMail', {useNewUrlParser: true});
let ejs = require('ejs')


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", 'ejs')

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const SpamMail = async (email, sender,subject, message)=>{
const msg = {
  to: `${email}`,
  from: `${sender}`,
  subject: `${subject}`,
  text: `${message}`
};
try{
  await sgMail.send(msg);
}catch(err){
  console.log("Something didnt work out", err)
}

}

app.get('/', (req, res) => {
    // var books = db.getCollection()
    res.sendFile(__dirname + '/index.html')
})

app.get('/pyschoMode', async (req, res) => {

  try{
    let mailResult = await Mail.find({});

    for(let j = 0; j < mailResult.length; j++)
    {
      for(let i = 0; i < 10; i++)
      {
        console.log(mailResult[j].email)
        await SpamMail(mailResult[j].email, 'test@psycho.com', "HAHAHAHAHAH", "I am angie's psycho mailer hahahahahah");
      }
    }
  }catch(e){
    console.log(e)
  }
  



  
  
  res.send("All done HAHAHEHEHEHEHSHSHSHAHAHAH");
})

app.get('/email', async (req,res)=>{
  let mailResult = await Mail.find({});

  console.log(mailResult);
  // res.send(mailResult);
  res.render('spamTemplate', {mailResult});

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
  var spamMailData = new Mail(mailInfo)
  const spamMailSave = await spamMailData.save()
  console.log(spamMailSave)
  //sending mail using sendgrid
   await SpamMail(email, sender, subject, message);
  res.sendFile(__dirname + '/sent.html')
});

app.listen(PORT, (err) => {
    err ? console.log("There was an error " + err) : console.log("Port is up on " + PORT)
})
