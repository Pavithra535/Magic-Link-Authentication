const express=require("express")
const nodemailer=require("nodemailer")
const uuid = require("uuid")
const transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user: // user e-mail,
        accessToken: // provide the acccess token,
    },
    });
const users=[
    {
        id:1,email: //mail to which magic link has to be sent,magicCode:null

    },
    {
        id:2,email:// mail to which magic link has to be sent,magicCode:null

    }

]
const app=express()
const path=require("path")
const hbs=require("hbs") 
const collection=require("./mongodb")
 
const templatePath=path.join(__dirname,'../templates')

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.render("login")
})

app.post('/login',async(req,res)=> {
     const{email} = req.body
     const user=users.find((u)=> u.email === email)
     if(!user){
        return res.send("user not found")  
       }

       const magicCode = uuid.v4().substr(0,8)
       user.magicCode = magicCode
       const mailOptions = {
        from:// user mail,
        to:email,
        subject:'Magic Link Login Auth',
        html:`
        <p>Click below to login in </p>
        <a href = "http://localhost:3000/home.hbs?email=${encodeURIComponent(
          email
          )}&code=${encodeURIComponent(magicCode)}">Log in</a>
          `,
       };
       try{
          await transport.sendMail(mailOptions)
          res.send("Magic Link sent to your email")
       }
       catch(err){
         console.log(err)
         res.send("Error sending email") 
       }

});
app.get("/dashboard",(req,res)=>{
    const{email,code} = req.query;
    const user= users.find((u)=> u.email === email && u.magicCode===code);

    if(!user){
        res.send("Your details link is not correct")
    }
    user.magicCode=null;
    res.send("Welcome to dashboard");
});

    

app.listen(3000,()=>{
    console.log("port connected");
})
