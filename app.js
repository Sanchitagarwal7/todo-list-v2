//jshint esversion:6

const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname+'/date.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://sanchit893:Sanchit1@cluster0.4x3iyrn.mongodb.net/todoListDB", {useNewUrlParser: true});

const Schema = mongoose.Schema;

const itemsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "Get Bath"
});

const item2 = new Item ({
    name: "Complete Homework"
});

const item3 = new Item ({
    name: "Eat Breakfast"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



app.get('/', function(req, res){

    let todate = date.getDate();


    Item.find()
        .then((foundItems)=>{
            if(foundItems.length === 0){
                Item.insertMany(defaultItems);
                res.redirect('/');
            }else{
                res.render('list', {TodayDate: todate, ListTitle: "Today", newListitems: foundItems});
            }
        })
        .catch((err)=>{
        console.log(err);
        });
    ;
});

app.post('/', function(req, res){

    const item = req.body.new;
    const listname = req.body.button;

    const newItem = new Item({
        name: item
    });

    if(listname === 'Today'){
        newItem.save();
        res.redirect('/');
    }else{
        List.findOne({name: listname})
          .then((foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+listname);
          })
          .catch((err)=>{
            console.log(err);
          });
        ;
    }
});

app.post('/delete', function(req, res){
    const checkedItemID = req.body.checkbox;

    const ListName = req.body.listName;

    if(ListName === 'Today'){
        Item.findByIdAndDelete(checkedItemID)
        .then(()=>{
          console.log("Success");
        })
        .catch((err)=>{
          console.log(err);
        });
        ;
        res.redirect('/');
    }else{
        List.findOne({name: ListName})
          .then((foundList)=>{
            foundList.items.pull({_id: checkedItemID});
            foundList.save();
            res.redirect('/'+ListName);
          })
          .catch((err)=>{
            console.log(err);
          });
        ;
    }
});

app.get('/about', function(req, res){
    res.render('about');
});

app.get('/:customListName', function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName})
      .then(function(foundLists){
        if(!foundLists)
        {
            //Create a new List
            const listName = new List ({
                name: customListName,
                items: defaultItems
            });
            listName.save();
            res.redirect("/" + customListName);
        }
        else
        {
            //Show the existing List
            res.render("list", {ListTitle: foundLists.name, newListitems: foundLists.items});
        }
      })
      .catch(function(err){
        console.log(err);
      });
    ;
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});