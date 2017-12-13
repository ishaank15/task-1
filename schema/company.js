const mongoose=require('mongoose');

const projectSchema = new mongoose.Schema({
    name: String,
    clientName: String,
    projectManager:String
});

const company = new mongoose.Schema({
    name:String,
    numOfEmployees: Number,
    foundingDate: Date,
    isPublic: Boolean,
    projects:[projectSchema]        
});

module.exports = company;
