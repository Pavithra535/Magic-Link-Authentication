const express=require("express")
const nodemailer=require("nodemailer")
const uuid = require("uuid")
const transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        type:'OAuth2',
        user:'pavithramk535@gmail.com',
        accessToken:"ya29.a0Ad52N38pt07QAzilKmlBLD8kjW-E6fCbFBlXBJV1Kpf5z_j3hz5sqjun2LKr237LH4U3WMclJD39ni3or-KJsfHM6v_sayP45-FiuurxlCWHmpm-ZEy_da8HcU6_odvq2LNKqyDIqg08Lm-TCahPUhCxvOnfxacHHN7GaCgYKAecSARASFQHGX2MikcYeMbf19MauZAu0BHSXnQ0171",
    },
    });
const users=[
    {
        id:1,email:'chravija@gmail.com',magicCode:null

    },
    {
        id:2,email:'nandikamaheshwar6@gmail.com',magicCode:null

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
        from:'pavithramk535@gmail.com',
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
