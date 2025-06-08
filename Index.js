import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    // start coding

    // creating database and collection

    const dataBase = client.db("karamPlate");
    const foodCollection = dataBase.collection("foodCollection");

    // starting crud method

    app.post("/foodCollection", async (req, res) => {
      const foodDetails = req.body;
      foodDetails.quantity = parseInt(foodDetails.quantity);
      foodDetails.expiry = new Date(foodDetails.expiry);
      console.log(foodDetails);
      const result = await foodCollection.insertOne(foodDetails);
      res.send(result);
    });

    // most 6 food having most available quantity

    app.get("/featureFoods", async (req, res) => {
      const now = new Date();
      const trendingFoods = await foodCollection
        .find({
          status: "available",
          expiry: { $gte: now },
        })
        .sort({ quantity: -1 })
        .limit(6)
        .toArray();

      res.send(trendingFoods);
    });

    // get all available foods api
    app.get("/foodCollection", async (req, res) => {
      const sortBY = req.query.sort || "all";
      const searchBY = req.query.search || "";

      let sorting = {};

      if (sortBY === "ascending") {
        sorting = { expiry: 1 };
      } else if (sortBY === "descending") {
        sorting = { expiry: -1 };
      }

      const query = {
        status: "available",
      };

      if (searchBY) {
        query.foodName = { $regex: searchBY, $options: "i" };
      }

      let availableFoodsCursor = foodCollection.find(query);

      if (sortBY !== "all") {
        availableFoodsCursor = availableFoodsCursor.sort(sorting);
      }

      const availAbleFoods = await availableFoodsCursor.toArray();
      res.send(availAbleFoods);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Karma Plate food sharing server is Active.");
});

app.listen(port, () => {
  console.log("This server is running on port", port);
});
