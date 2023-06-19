const router = require("express").Router();
const res = require("express/lib/response");
const conn = require("../DB/dbConnection");
const { body ,validationResult } = require("express-validator");
const req = require("express/lib/request");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const upload = require("../middleware/uploadimages");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const mysql = require("mysql");
const { url } = require("inspector");
const util=require("util"); //helper
const app = express();
// Route for adding a book to the database
router.post(
  "/",
  admin,
  upload.single("image"),
  async (req, res) => {
    try {

      // Upload book cover image to "/upload" directory
     const image_url = req.file.filename;
      
     // prepare bookInstance
     const bookInestance={
      Title:req.body.title,
      Author:req.body.author,
      subject:req.body.subject,
      image_url:image_url,
      rack_Number:req.body.rack_Number
     }

      // Add book to database
      const query = util.promisify(conn.query).bind(conn);
     const result = await query(
      "insert into books (Title, Author, subject , image_url , rack_Number ) values (?,?,?,?,?)",
      [
        bookInestance.Title,
        bookInestance.Author,
        bookInestance.subject,
        bookInestance.image_url,
        bookInestance.rack_Number
      
      ]
    );


 
       res.status(201).json({ msg: "Book added successfully" });

      // Check if all required fields are present in the request body
      if (!req.file || !bookInestance) {
        return res.status(400).json({ msg: "Please provide all required fields" });
      }
  
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

//update book
router.put(
  "/:id",
 admin,
  upload.single("image"),
  body("title")
    .isString()
    .withMessage("Please enter a valid book title"),
  body("author")
    .isString()
    .withMessage("Please enter a valid book author"),
  async (req, res) => {
    try {
      // Validate request (manually or using Express Validator)
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if book exists or not
      const book = await query("SELECT * FROM books WHERE id = ?", [req.params.id]);
      if (!book[0]) {
        return res.status(404).json({ msg: "Book not found" });
      }

      // Prepare book object
      const bookObj = {
        title: req.body.title,
        author: req.body.author,
        subject: req.body.subject,
        rack_Number: req.body.rack_Number
      };
      if (req.file) {
        bookObj.image_url = req.file.filename;
        fs.unlinkSync("./upload/" + book[0].image_url);
      }

      // Update book in database
      await query("UPDATE books SET Title = ?, Author = ?, subject = ?, image_url = ? , rack_Number = ? WHERE id = ?", [
        bookObj.title,
        bookObj.author,
        bookObj.subject,
        bookObj.image_url,
        bookObj.rack_Number,
        book[0].id,
      ]);

      res.status(200).json({ msg: "Book updated successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// Route for deleting a book from the database
router.delete(
  "/:id",
  admin,
  async (req, res) => {
    try {
      // Check if book exists
      const query = util.promisify(conn.query).bind(conn);
      const book = await query("SELECT * FROM books WHERE id = ?", [req.params.id]);
      if (!book[0]) {
        return res.status(404).json({ msg: "Book not found" });
      }
      
      // Delete book cover image
      fs.unlinkSync("./upload/" + book[0].image_url);
      
      // Delete book from database
      await query("DELETE FROM books WHERE id = ?", [book[0].id]);
      
      res.status(200).json({ msg: "Book deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
);

// Start server

app.listen(4000, () => console.log("Server started on port "));


/////////////////////////////////////////////////////////////////////////
//List & Search {Admin, user}
router.get("",async (req,res)=>{
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if(req.query.search){
        search = `where Title LIKE '%${req.query.search}%' or Author LIKE '%${req.query.search}%' or subject LIKE '%${req.query.search}%' or rack_Number LIKE '%${req.query.search}%' or id LIKE '%${req.query.search}%'`
    }
    const Books = await query(`select * from books ${search}`);
    Books.map(Books =>{
        Books.image_url = "http://" + req.hostname  +":4000/" + Books.image_url;
    });
    res.status(200).json({Books});
});
// Show Movie {Admin, user}
router.get("/:id",async (req,res)=>{
    const query = util.promisify(conn.query).bind(conn);
    const Books = await query("select * from books where id = ?" , req.params.id );
    if(!Books[0]) {
        res.status(404).json({ms:"Book not found !"});
    }
    Books.image_url = "http://" + req.hostname  +":4000/" + Books.image_url;
    Books[0].borrow_request = await query("select * from user_borrow_book where books_id = ?",Books[0].id);
    res.status(200).json(Books[0]);
});

// Make Request borrow
router.post("/borrow",
 authorized ,
 body("books_id").isNumeric().withMessage("please enter a valied Book ID"),
 body("borrow_request").isBoolean("0"),
 async (req,res)=>{
    try{
    const query = util.promisify(conn.query).bind(conn);
     //1- Valodation requests [manual , express validation]
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     //2- check if book exist or not
     const books_id = await query("SELECT * FROM books WHERE id = ?", [req.books_id]);
     if (!books_id) {
       return res.status(404).json({ msg: "Book not found" });
     } 
    
     //3- prepare borrow request 
     const borrowObj = {
        users_id: res.locals.user.id, 
        books_id:req.body.books_id,
        borrow_request: req.body.borrow_request
     };
     //4- Insert borrow object into db
     await query("insert into user_borrow_book set?",borrowObj);
     res.status(200).json({
        msg: "requested added successfully !",
     });
      
    }catch(err){
      console.log(err);
        res.status(500).json(err);
    }
    });
   

module.exports = router;