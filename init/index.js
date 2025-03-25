const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASDB_URL


main() 
    .then(() => {
        console.log("connect to db");
    })
    .catch(err => {
        console.log(err);
    });

async function main(){
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"67bfdf9470e96731bf97b2d9"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
