// Drop all collections
db.users.drop()

// Keys defenition
docKey1 = new ObjectId();


// Collections
db.users.insert({_id:"deanshub@gmail.com",firstName:"Dean",lastName:"Shub",registration:new Date(),birthday:new Date()});

db.mgroups.insert({_id:"Chest"});
db.mgroups.insert({_id:"Back Hand"});
db.mgroups.insert({_id:"Shoulders"});
db.mgroups.insert({_id:"Back"});
db.mgroups.insert({_id:"Legs"});
db.mgroups.insert({_id:"Front Hand"});
db.mgroups.insert({_id:"Abs"});

db.workout.insert({user:"deanshub@gmail.com",name:"A",creation:new Date(),end:new Date()});