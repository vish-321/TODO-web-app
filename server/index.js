const express =  require ("express") ;
const app = express () ;
const cors = require("cors");
const pool = require ("./db");
const { response } = require("express");

//middleware
app.use(cors());
app.use(express.json());


try {
    app.listen (5003 , ()=> {
        console.log("Server has started on port 5003"); 
    }) ;
} catch (error) {
    console.error(err.message);
}

//ROUTES


// create a todo 
app.post("/todos" , async(req,res)=>{
    try {
        const {description} = req.body ;
        const newentry = await  pool.query(
            "INSERT INTO TODO (description  ) VALUES ($1) RETURNING *",[description]
        );
        res.json(newentry.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

//get all to do
app.get("/todos",async(req,res)=>{
    const list = await pool.query("SELECT * FROM todo");
    res.json(list.rows);
});
// get a todo 
app.get("/todos/:id",async(req,res)=>{
    try {
       const {id}= req.params;
       const list = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
       res.json(list.rows);
    } catch (err) {
        console.error(err.message)
    }
   
});

//update a todo 

app.put("/todos/:id",async(req,res)=>{
    try {
        const {id} = req.params ;
        const {description} = req.body ;
        const response = await pool.query("UPDATE todo SET description=$1 WHERE todo_id =$2 RETURNING *",[description,id]);
        res.json(response.rows);

    } catch (err) {
        console.error(err.message);
    }
});


//delete a todo

app.delete("/todos/:id",async(req,res)=>{
    try {
        const {id}=req.params;
        const r = await pool.query ("DELETE FROM todo WHERE todo_id =$1 RETURNING *",[id]);
        res.json(r.rows);
    } catch (err) {
        console.error(err.message);
    }
})
