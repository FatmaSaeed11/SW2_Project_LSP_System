const router=require("express").Router();
const conn=require("../DB/dbConnection");
const { body, validationResult , deleteStatus } = require('express-validator' ,'deleteStatus');
const util=require("util"); //helper
const bcrypt=require("bcrypt");
const crypto=require("crypto");
const authorized = require("../middleware/authorize");

// LOGIN
router.post(
  "/login",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password should be between (8-12) character"),
  async (req, res) => {
    try {
      // 1- VALIDATION REQUEST [manual, express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // 2- CHECK IF EMAIL EXISTS
      const query = util.promisify(conn.query).bind(conn); // transform query mysql --> promise to use [await/async]
      const user = await query("select * from users where email = ?", [
        req.body.email,
      ]);
      if (user.length == 0) {
        res.status(404).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }

      // 3- COMPARE HASHED PASSWORD
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (checkPassword) {
        delete user[0].password;
        res.status(200).json(user[0]);
      } else {
        res.status(404).json({
          errors: [
            {
              msg: "email or password not found !",
            },
          ],
        });
      }
    } catch (err) {
      res.status(500).json({ err: err });
    }
  }
);



//registiration
router.post("/register",
body("email").isEmail().withMessage("please enter a valid email"),
body("name").isString().withMessage("please enter a valid name").isLength({min:10,max:20}).withMessage("name should be between (10-20)character"),
body("password").isLength({min:8,max:12}).withMessage("password should be between (8-12)character"),

async (req,res)=>{
    try{
       //1-validation request[manual-package]
       const errors=validationResult(req);
       if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
       }

       //2- check if email exists
       // awit/async
       const query=util.promisify(conn.query).bind(conn);  ///transform query mysql ---->promis to use (await/async)
       const checkEmailExists=await query("select *from users where email=?",[req.body.email]
       );
      if(checkEmailExists.length > 0){
        res.status(400).json({
            errors:[
               {
                 msg:"email already exists",
               }, 
            ],
      });
      }
      //3-prepare object user to save 
      const userData={
        name:req.body.name,
        email:req.body.email,
        password:await bcrypt.hash(req.body.password,10),
        status:crypto.randomBytes(16).toString("hex"), // jason web token-crypto--->random encryption standerd
      };

      //4-insert user object into db
       await query("insert into users set? ",userData); 
       delete userData.password;
       res.status(200).json(userData);
       //res.json("success");
    }
    catch(err){
      console.log(err);
        res.status(500).json({err:err});

    }
});


//logout
// router.get("/logout",(req,res)=>{
// req.user;
//   res.redirect("/");
// });
router.get('/logout',authorized,function(req,res){
  req.user.deleteStatus(req.token,(err,user)=>{
      if(err) return res.status(400).send(err);
      res.sendStatus(200);
  });

}); 

module.exports=router;