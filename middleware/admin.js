const req = require("express/lib/request");
const conn = require("../DB/dbConnection");
const util=require("util"); //helper
const res = require("express/lib/response");

const admin = async (req, res , next) => {

    const query=util.promisify(conn.query).bind(conn);
    const {status} = req.headers; 
    const admin = await query("Select * from users where status " , status);
    if(admin[0] && admin[0].role == 1){
        next();
    }
    else{
        res.status(403).json({
            msg:"you are not authorized to access this route !",
        });
    }

};
module.exports = admin;