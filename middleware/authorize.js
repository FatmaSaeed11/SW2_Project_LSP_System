const req = require("express/lib/request");
const conn = require("../DB/dbConnection");
const util=require("util"); //helper
const res = require("express/lib/response");

const authorized = async (req, res , next) => {

    const query=util.promisify(conn.query).bind(conn);
    const {status} = req.headers; 
    const user = await query("select * from users where status " , status);
    if(user[0]){
        res.locals.user = user[0];
        next();
    }
    else{
        res.status(403).json({
            msg:"you are not authorized to access this route !",
        });
    }

};
module.exports = authorized;