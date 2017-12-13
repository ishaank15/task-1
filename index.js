const mongoose=require('mongoose');

const dummyData = require('./dummy-data');
const companySchema = require('./schema/company');
const fs=require('fs');
const waterfall = require('async/waterfall');

mongoose.connect('mongodb://localhost:27017/task1');

const company = mongoose.model('companies', companySchema);

function cleanCompany(callback) {
    //Step 1: Clean the mongo collection attached to above schema
    company.remove({})
      .then(function () {
        callback(null);
      })
      .catch(err => callback(err))
    
}
function insertDummyCompanies(callback) {
    //Step 2: Insert dummy data in above collection
    company.insertMany(dummyData)
      .then(function() {
          callback(null);
      })
      .catch(err=> callback(err))
    
}
function writeAllCompany(callback) {

  company.find({})
    .then(function(company) {
        fs.writeFile('allCompany.json', JSON.stringify(company), (err) => {
            if (err) throw err;
            console.log('allCompany.json file has been saved!');
            callback(null);
          });
    })
      .catch(err => callback(err))
   
}
function writePublicCompany(callback) {
    company.find({ isPublic: "true" }) 
        .then(function( company ) {
            fs.writeFile('publicCompany.json', JSON.stringify(company), (err) => {
                if (err) throw err;
                console.log('publicCompany.json file has been saved!');
                callback(null);
            });
        })
        .catch(err => callback(err))
 }


const init = () => {
    waterfall([
        cleanCompany,
        insertDummyCompanies,
        writeAllCompany,
        writePublicCompany
    ], (err, result) => {
        if (err) {
            console.log(err);
            return false;
        }
        return company.count((err, companyCount) => {
            console.log(companyCount)
            return company.remove({}, () => mongoose.disconnect());
        })
    });
};

init();