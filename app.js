const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express()
app.use(bodyParser.json());
const port = 3000
let Todos = [];



function findIndex(arr , indx){
    for(var i = 0 ; i < arr.length; i++){
        if(arr[i].id == indx){
            return i;
        }
    }
    return -1;

}



function removeIndex(arr, indx){
    let newArray = [];
    for(var i = 0 ; i < arr.length ; i++){
         if(i !== indx) newArray.push(arr[i]);
    }
    return newArray;
}



// app.get('/todos' , (req , res) =>{
//     console.log(Todos);
//     res.json(Todos);

// });




app.get('/todos' , (req, res)=>{
    
    fs.readFile("todos.json" , "utf-8" , (err , data) =>{
        if(err) throw err;
        res.status(201).json(JSON.parse(data));
    });
});



app.get('/todos/:id' , (req , res) =>{
      
     fs.readFile("todos.json" , "utf-8",(err,data)=>{
        if(err) throw err;
        const Todos = JSON.parse(data);
        const todoIndex = findIndex(Todos , parseInt(req.params.id));
        if(todoIndex == -1){
            res.status(404).send();
        }
        
      else{
        fs.writeFile("todos.json",JSON.stringify(Todos),(err)=>{
            if(err) throw err;
            res.json(Todos[todoIndex]);
        }) 
     }
    });
});


app.post('/todos', (req, res) => {  
  
    var ID = Math.floor(Math.random() * 100000);
    var Title = req.body.title;
    var Description = req.body.description;

    var newTodo = {
    id : ID,
    title : Title,
    description : Description
   }
   
   fs.readFile("todos.json" , "utf-8" , (err, data)=>{

     const Todos = JSON.parse(data);
     Todos.push(newTodo); 
     fs.writeFile("todos.json",JSON.stringify(Todos),(err)=>{
      if(err) throw err;
      res.status(201).json(newTodo);
     });
   });
})

app.put('/todos/:id', (req, res) =>{
    fs.readFile("todos.json", 'utf-8', (err,data)=>{
        if(err) throw err;
     const Todos = JSON.parse(data);
     const todoIndex = findIndex(Todos , parseInt(req.params.id));
     if(todoIndex == -1){
        res.status(404).send("Invalid ID");
    }
else{
    
    const updatedTodo = {
       id : Todos[todoIndex].id,
       title : req.body.title,
       description: req.body.description
    }

    Todos[todoIndex] = updatedTodo;
    fs.writeFile("todos.json" , JSON.stringify(Todos) , ()=>{
     if(err) throw err;
     res.status(201).json(updatedTodo);

    });
  
}
    
    });

});

app.delete('/todos  /:id', (req , res)=>{
const todoIndex = findIndex(Todos , parseInt(req.params.id));
if(todoIndex == -1){
    res.status(404).send("Invalid ID");
}
else{
    Todos = removeIndex(Todos , todoIndex);
    res.status(200).send();
}
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})