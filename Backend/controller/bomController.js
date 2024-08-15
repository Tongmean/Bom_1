//Connect DB
const { Console } = require('console');
const dbconnect = require('../DbConnect');
//Get All boms
const getBoms = async (req,res) =>{
    dbconnect.query("SELECT * FROM bom",(err, result) =>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send(result);
        }
    });
}
// Post json to database
const postBom = async (req, res) =>{
    //get value form request(Http)
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Remark =req.body.Remark;
    //Insert Data From Rq.body to Database
    dbconnect.query("INSERT INTO bom(Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Remark) VALUES(?, ?, ?, ?, ?, ?, ?)",
        [Code_Fg, Name_Fg, Code_Dr, Name_Dr,Code_Wip, Name_Wip, Remark],
        (Error,result)=>{
            if(Error){
                console.log(Error);
            }else
            res.status(201).send("bom created");
        }
    )
};
const updatebom = async (req, res) =>{
    //get value form request(Http)
    const id = req.body.id;
    const Code_Fg =req.body.Code_Fg;
    const Name_Fg =req.body.Name_Fg;
    const Code_Dr =req.body.Code_Dr;
    const Name_Dr =req.body.Name_Dr;
    const Code_Wip =req.body.Code_Wip;
    const Name_Wip =req.body.Name_Wip;
    const Remark =req.body.Remark;

    dbconnect.query("UPDATE bom SET Code_Fg = ?, Name_Fg = ?, Code_Dr = ?, Name_Dr = ?, Code_Wip = ?, Name_Wip = ?, Remark = ? WHERE id = ? ", 
    [Code_Fg, Name_Fg, Code_Dr, Name_Dr, Code_Wip,Name_Wip, Remark, id], 
    (err, result)=>{
        if(err){
            console.log(err);
        }else{
            res.status(200).send("bom updated");
            console.log(result)
        }
    })
};

module.exports ={
    getBoms,
    postBom,
    updatebom
}