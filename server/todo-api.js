var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const { request } = require("express");

var app = express();
app.use(cors());

app.use(express.urlencoded({
    extended:true
}));
app.use(express.json());

var conStr = "mongodb://127.0.0.1:27017";

app.get("/users", (request, response)=>{

    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("projecttodo");
        database.collection("users").find({}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});

app.post("/register-user", (request, response)=>{

    var user = {
        UserId: request.body.UserId,
        Email: request.body.Email,
        Gender: request.body.Gender,
        Password:request.body.Password,
        DOB: request.body.DOB
    };

    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("projecttodo");
        database.collection("users").insertOne(user).then(()=>{
            console.log("New User Added");
        });
    });

});

app.post("/add-task",(request,response)=>{
    var task = {
        Title: request.body.Title,
        Id:parseInt(request.body.Id),
        TaskPriority: request.body.TaskPriority,
        DueDate: new Date(request.body.DueDate),
        Description: request.body.Description,
        UserId: request.body.UserId
    };
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db('projecttodo');
        database.collection('appointments').insertOne(task).then(()=>{
            console.log("Task Added");
            response.end();
        })
    })
})
app.get("/appointments/:UserId", (request, response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("projecttodo");
        database.collection("appointments").find({UserId:request.params.UserId}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
});

app.get("/get-byid/:id", (request, response)=>{
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("projecttodo");
        database.collection("appointments").find({Id:parseInt(request.params.id)}).toArray().then(documents=>{
            response.send(documents);
            response.end();
        });
    });
})

app.delete("/delete-task/:id",(request,response)=>{
    var id = parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObject=>{
        var database = clientObject.db("projecttodo");
        database.collection("appointments").deleteOne({Id:id}).then(()=>{
            console.log("Task Deleted");
            response.end();
        }).catch(()=>{
            alert("data failed to delete");
        });
        
    });
})


app.put("/edit-task/:id", (request, response)=>{
    var id = parseInt(request.params.id);
    mongoClient.connect(conStr).then(clientObj=>{
       var database = clientObj.db("projecttodo");
       var appointment = {  Title:request.body.Title,
                            Id:parseInt(request.body.Id),
                            DueDate: new Date(request.body.DueDate),
                            TaskPriority:request.body.TaskPriority,
                            Description: request.body.Description,
                        };

       database.collection("appointments").updateOne({Id:id},{$set:appointment})
       .then(()=>{
           console.log("Task Updated");
           response.end();
       });
      
  });
});


app.listen(5050);
console.log("Server Started : http://127.0.0.1:5050");