const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/unfazed";
        const conn = await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        if (error.message.includes("ECONNREFUSED") || error.name === "MongooseServerSelectionError") {
            console.error(
                "Tip: Local MongoDB service may not be running. Start it in Windows Services (MongoDB), run 'net start MongoDB' as Administrator, or set a MongoDB Atlas URI in .env."
            );
        }
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
});

module.exports = connectDB;
