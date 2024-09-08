const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/TravelRoot";


main()
.then((res) => {
    console.log("Success");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, createdBy:"66d74f780c5cec089379e4e4", geometry: {
        type: "Point",
        coordinates: [77.1025, 28.7041]
    }}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();
