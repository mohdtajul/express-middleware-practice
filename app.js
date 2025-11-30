const express = require("express")
const app = express()
const ExpressError = require('./ExpressError')

const port = 3000;

// Built in middleware
app.use(express.urlencoded({extended:true}));

// normal middleware
app.use((req,res,next)=>{
    console.log("middleware executed")
    next()
})

// logger middleware 
app.use((req,res,next)=>{
    console.log(req.method, req.url)
    next()
});

// Authentication middleware or route level middleware
function isLoggedIn(req,res,next){
    if(!req.user){
        return res.send("you need to log in first");
    }
    next();
}

app.get("/dashboard",isLoggedIn,(req,res)=>{
    res.send("welcome to the dashboard");
})

// validation middleware example
function validatingListing(req,res,next){
    const {title,price} = req.body;
    if(!title || !price){
        res.send("not a valid listing")
    }
    next()
}

app.get("/listing/new",validatingListing,(req,res)=>{
    res.send("listing created")
})

// Error handling middleware
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(404).send("somthing broke")
}) 

app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"access to admin is forbidden")
})

const checkToken = (req,res,next)=>{
    const {token } = req.query;
    if(token == "giveaccess"){
        next()
    }
    throw new ExpressError(404,"access denied")
}

app.get("/api",checkToken,(req,res)=>{
    res.send("data received")
});



app.listen(port,()=>{
    console.log(`server is running on" ${port}`);
})