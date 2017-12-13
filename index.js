const mongoose=require('mongoose');

const dummyData = require('./dummy-data');
const companySchema = require('./schema/company');
const fs=require('fs');
const waterfall = require('async/waterfall');

mongoose.connect('mongodb://localhost:27017/task1');

const company = mongoose.model('company', companySchema);
// company.create(dummyData, function () {
//     mongoose.disconnect();
// });

function cleanCompany(callback) {
    //Step 1: Clean the mongo collection attached to above schema
    company.remove({})
      .then(function () {
        callback(null);
      })
      .catch(err => console.log(err))
    
}
function insertDummy(callback) {
    //Step 2: Insert dummy data in above collection
    company.insertMany(dummyData)
      .then(function() {
          callback(null);
      })
      .catch(err=> console.log(err))
    
}
function writeAllcompany(callback) {

  company.find({})
    .then(function(company) {
        fs.writeFile('allCompany.json', JSON.stringify(company), (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
          });
    })
      .catch(err => console.log(err))
   
}
function writePubliccompany(callback) {
    company.find( { isPublic: "true" } ) 
        .then(function( company ) {
            console.log('kkkkkkkkkkkkkkkkkkkkkkk')
            fs.writeFile('publicCompany.json', JSON.stringify(company), (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
        })
        .catch(err => console.log(err))
     callback(null,'Done,Now Cleaning the collection');
 }


const init = () => {
    waterfall( [cleanCompany, insertDummy,writeAllcompany,writePubliccompany],
        function (err, result) {
        console.log(result);
        console.log(company.count());
        company.remove({});
        mongoose.disconnect();
        //command to Clean the collection and log the number of documents present in collection
    });
};

init();