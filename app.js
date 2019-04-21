var express = require("express"); // This line calls express framework to action // 
var app = express();
// * NEVER WRITE ABOVE THIS LINE... //

// Call SQL middle ware to action// 
var mysql = require('mysql');


app.set("view engine","ejs");
var fs = require('fs');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

var contact = require("./module/contact.json");

const fileUpload = require("express-fileupload");
app.use(fileUpload());

app.use(express.static("views"));

app.use(express.static("script"));

app.use(express.static("images"));

app.use(express.static("module"));

// create connectivity to sql database

const db = mysql.createConnection ({
    host: 'hostingmysql304.webapps.net', //'den1.mysql4.gear.host', //'hostingmysql304.webapps.net',
    user: 'liamme',//'appvillas', //'liamme',
    password: 'L1Am39??',//'Zq88QjuLS!_5	', //'L1Am39??',
    database: 'liam'//'villas' //'liam'
});

//put some clarity on our connection status
db.connect((err) => {
    if(err){
    console.log("The Database is not connected");
    }
    else {
        console.log("The Database is connected");
    }
});

app.get('/', function(req, res){
    res.render("index")
});

app.get('/reviews', function(req, res){
    res.render("reviews", {contact})
});
app.get('/let', function(req, res){
    res.render("let")
});
app.get('/letvillasql', function(req, res){
    res.render("letvillasql")
});
app.get('/book', function(req, res){
    res.render("book")
});


//*********************** Reviews page JSON Functionality STARTS *************************//
app.get('/editreview/:id', function(req, res){
    function chooseReview(indOne ){
        return indOne.id === parseInt(req.params.id)
    }
    var indOne = contact.filter(chooseReview)
    res.render('editreview', {res:indOne});
});
app.post('/editreview/:id', function(req,res){
    var json = JSON.stringify(contact);
    var keyToFind = parseInt(req.params.id);
    var data = contact
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind)
    var x = req.body.name;
    var y = req.body.comment;
    var z = parseInt(req.params.id)
    
    contact.splice(index, 1, {
        
        name: x, 
        Comment: y,
        id: z,
        stars: req.body.email
        
    });
    
    json = JSON.stringify(contact, null, 4);
    fs.writeFile("./module/contact.json", json, 'utf8');
    res.redirect("/reviews")
});




app.post('/reviews', function(req,res) {
    function getMax(contacts, id) {
        var max
        for (var i=0; i<contacts.length; i++) {
            if(!max || parseInt(contact[i][id]) > parseInt(max[id]))
            max = contacts[i];
        }
        return max;
    }
    var maxCid = getMax(contact, "id");
    newId = maxCid.id +1;
    console.log("New id is: " +newId);
    var json= JSON.stringify(contact)
    var reviewx = {
        name: req.body.name,
        Comment: req.body.comment,
        id: newId,
        stars: req.body.stars
    }
    fs.readFile('./module/contact.json', 'utf8', function readfileCallback(err){
        if(err){
            throw(err)
        } else {
            contact.push(reviewx) 
            json = JSON.stringify(contact, null, 4)
            fs.writeFile('./module/contact.json', json, 'utf8')
        }
    })
    res.redirect('/reviews');
});

//Delete fucntion for jason

app.get('/deletereview/:id', function(req,res){
    var json = JSON.stringify(contact);
    var keyToFind = parseInt(req.params.id);
    var data = contact
    var index = data.map(function(contact){return contact.id;}).indexOf(keyToFind) 
    
    contact.splice(index, 1); 
        json = JSON.stringify(contact, null, 4)
            fs.writeFile('./module/contact.json', json, 'utf8')
            console.log("review is deleted")
            res.redirect('/reviews');
});

//*********************** Reviews page JSON Functionality ENDS *************************//

// ---------------SQL DATA STARTS HERE ________________________//
// to create a databasa table

//app.get('/altertable', function(req, res){
 //   let sql = 'ALTER TABLE denisproducts ADD Description varchar(1000);'
 //   let query = db.query(sql, (err,res) => {
//        if(err) throw err;
 //   });
//    res.send("coulms added");
//});

//app.get('/altertable', function(req, res){
   // let sql = 'CREATE TABLE denisproducts (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), City varchar(255));'
  //  let query = db.query(sql, (err,res) => {
  //      if(err) throw err;
 //   });
  //  res.send("SQL works");
//});

//app.get('/createtablebookings', function(req, res){
 //let sql = 'CREATE TABLE denispbookings (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, Firstname varchar(255), Surname varchar(255), Price int, City varchar(255), Datefrom date, Dateto date )'
//  let query = db.query(sql, (err,res) => {
 //     if(err) throw err;
//   });
//  res.send("SQL Booking Created");
//});

//app.get('/altertablebook', function(req, res){
 //   let sql = 'ALTER TABLE denispbookings ADD Villa_name varchar(255);'
 //   let query = db.query(sql, (err,res) => {
  //      if(err) throw err;
 //   });
 //   res.send("coulms added");
//});

//app.get('/book', function(req, res){
   // let sql = 'INSERT INTO denispbookings (Firstname, Surname, Price, City, Datefrom, Dateto) VALUES ("Denis", "Petrovskij", 500, "Barcelona", 2019/03/02, 2019/03/09)'
 //   let query = db.query(sql, (err,res) => {
 //       if(err) throw err;
 //   });
 // res.send("New Villa booked");
//ç});

//Create products by hard code
app.get('/letvilla', function(req, res){
    let sql = 'INSERT INTO denisproducts (Name, Price, Image, City) VALUES ("Villa Greta", 500, "image_4.jpg", "Barcelona")'
    let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
  res.send("New Villa Added");
});

app.get('/letvillas', function(req, res){
    let sql = 'SELECT * FROM denisproducts';
    let query = db.query(sql, (err, res1) => {
        
        if(err) throw err;
        
        res.render('showallproducts', {res1})
    });
   //res.send("New Villa Added");
});
app.get('/bookings', function(req, res){
    let sql = 'SELECT * FROM denispbookings';
    let query = db.query(sql, (err, res1) => {
        
        if(err) throw err;
        
        res.render('bookingsql', {res1})
    });
   //res.send("New Villa Added");
});
//post new villa
app.post('/letvillasql', function(req, res){
    
        let sampleFile = req.files.sampleFile
    
    filename = sampleFile.name;
        sampleFile.mv('./images/'+ filename, function(err){
            if(err)
            return res.status(500).send(err);
            console.log("Image is " + req.files.sampleFile)
                    });
    let sql = 'INSERT INTO denisproducts (Name, Price, Image, City, Description) VALUES ("'+req.body.name+'", '+req.body.price+', "'+filename+'", "'+req.body.city+'", "'+req.body.description+'")'
    let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
  console.log("New Villa Added")
  res.redirect('/letvillas');
});

app.post('/book', function(req, res){
    let sql = 'INSERT INTO denispbookings (Firstname, Surname, Price, City, Datefrom, Dateto) VALUES ("'+req.body.firstname+'", "'+req.body.secondname+'", '+req.body.price+', "'+req.body.city+'", "'+req.body.datefrom+'", "'+req.body.dateto+'")'
    let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
  console.log("Villa Booked")
  res.redirect('/bookings');
});

//edit Villa SLQ

app.get('/edit/:id', function(req, res){
        let sql = 'SELECT * from denisproducts WHERE Id = "'+req.params.id+'" '
        let query = db.query(sql, (err, res1) => {
            if(err) throw err;
            res.render('edit', {res1});
            
        });
});
app.get('/editbook/:id', function(req, res){
        let sql = 'SELECT * from denispbookings WHERE Id = "'+req.params.id+'" '
        let query = db.query(sql, (err, res1) => {
            if(err) throw err;
            res.render('editbook', {res1});
            
        });
});
app.post('/editsql/:id', function(req, res) {
    let sampleFile = req.files.sampleFile
    
    filename = sampleFile.name;
        sampleFile.mv('./images/'+ filename, function(err){
            if(err)
            return res.status(500).send(err);
            console.log("Image is " + req.files.sampleFile)
                    });
    let sql = 'UPDATE denisproducts SET Name ="'+req.body.name+'", Price = '+req.body.price+', Image = "'+filename+'", City = "'+req.body.city+'", "'+req.body.description+'" WHERE Id = '+req.params.id+''
    let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
        res.redirect("/letvillas");
});
app.post('/editbooksql/:id', function(req, res) {
    let sql = 'UPDATE denispbookings SET Firstname ="'+req.body.firstname+'", Surname ="'+req.body.surname+'", Price = '+req.body.price+', City = "'+req.body.city+'", "'+req.body.datefrom+'", "'+req.body.dateto+'" WHERE Id = '+req.params.id+''
    let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
        res.redirect("/bookings");
});
//Delete Villa SQL
app.get('/deletesql/:id', function(req, res) {
    let sql = 'DELETE from denisproducts where Id = '+req.params.id+' '
    let query = db.query(sql, (err,res) => {
        
    });
    res.redirect("/letvillas");
});

app.get('/deletebooksql/:id', function(req, res) {
    let sql = 'DELETE from denispbookings where Id = '+req.params.id+' '
    let query = db.query(sql, (err,res) => {
        
    });
    res.redirect("/bookings");
});


//Show Villa
app.get('/show/:id', function(req, res){
        let sql = 'SELECT * from denisproducts WHERE Id = "'+req.params.id+'" '
        let query = db.query(sql, (err, res1) => {
            if(err) throw err;
            res.render('show', {res1})
        });
});
//for bookings
app.get('/show2/:id', function(req, res){
        let sql = 'SELECT * from denisproducts WHERE Id = "'+req.params.id+'" '
        let query = db.query(sql, (err, res1) => {
            if(err) throw err;
            res.render('show2', {res1})
        });
});

app.get('/market', function(req, res){
    let sql = 'SELECT * FROM denisproducts'
    let query = db.query(sql, (err, res1) => {
        if(err) throw err;
        res.render("market", {res1})
    });
});








//to get upload image

app.get('/upload', function(req, res) {
    
    res.render('upload');
    
});


app.post('/upload', function(req, res){
    let sampleFile = req.files.sampleFile
    
    filename = sampleFile.name;
        sampleFile.mv('./images/'+ filename, function(err){
            if(err)
            return res.status(500).send(err);
            console.log("Image is " + req.files.sampleFile)
            
            res.redirect('/');
        });
});


//-------------------------------------------------------------






// * NEVER WRITE BELOW THIS LINE... //
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Welcome to the holiday will rental!")
    
});