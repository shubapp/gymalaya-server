// Drop all collections
db.users.drop()

// Keys defenition
docKey1 = new ObjectId();


// Collections
db.users.insert({_id:"deanshub@gmail.com",firstName:"Dean",lastName:"Shub",registration:new Date(),birthday:new Date()});
db.users.insert({_id:"isyaniv@gmail.com",firstName:"Yaniv",lastName:"Israel",registration:new Date()})

db.mgroups.insert({_id:"Chest"});
db.mgroups.insert({_id:"Back Hand"});
db.mgroups.insert({_id:"Shoulders"});
db.mgroups.insert({_id:"Back"});
db.mgroups.insert({_id:"Legs"});
db.mgroups.insert({_id:"Front Hand"});
db.mgroups.insert({_id:"Abs"});

db.workouts.insert({_id:docKey1,user:"deanshub@gmail.com",name:"A",creation:new Date()});

db.exercises.insert({name:"upper pully",workout:docKey1,weight:80,sets:3,repetitions:10,startDate:new Date(),mgroup:"Back"});