const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://motaz:motaz%40%4077@learning-mongo.yk44rkc.mongodb.net/";
const client = new MongoClient(url);

const main = async () => {
  await client.connect();
  console.log("connected ya basha");
  const db = client.db("codeZone");
  const data = db.collection("courses");
  const dataFind = await data.find({}).toArray();
  console.log(dataFind);
};
main();
