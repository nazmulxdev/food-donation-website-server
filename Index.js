import express from "express";
import cors from "cors";
import "dotenv/config";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import admin from "firebase-admin";

const decoded = Buffer.from(process.env.FIREBASE_SDK, "base64").toString(
  "utf-8",
);

const serviceAccount = JSON.parse(decoded);
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// firebase middleware to verify token
const fireBaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).send({ message: "Unauthorize access" });
  }

  // firebase token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Unauthorize access" });
  }

  try {
    const tokenInfo = await admin.auth().verifyIdToken(token);
    req.fireBaseVerifiedEmail = tokenInfo.email;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorize access" });
  }
};

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

    const requestedFoodsCollection = dataBase.collection(
      "requestedFoodsCollections",
    );

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

    // get specific food by its id
    app.get("/foodDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };

      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    // post method for adding requested food in the requestedFoodsCollection
    app.post("/requestedFoods", fireBaseToken, async (req, res) => {
      const userEmail = req.body.userEmail;
      if (req.fireBaseVerifiedEmail !== userEmail) {
        return res.status(403).send({ message: "forbidden access" });
      }
      // starting crud methods
      const requestedFood = req.body;
      const foodId = requestedFood.foodId;
      const query = { _id: new ObjectId(foodId) };
      const updateDoc = {
        $set: {
          status: "requested",
        },
      };
      const insertRequestedFood = await requestedFoodsCollection.insertOne(
        requestedFood,
      );

      const updateStatus = await foodCollection.updateOne(query, updateDoc);

      res.send({
        message: "Food requested successfully",
        insertRequestedFood,
        updateStatus,
      });
    });

    // get method to get donated food by the donner email
    app.get("/donatedFoods", fireBaseToken, async (req, res) => {
      const email = req.query.email;
      if (req.fireBaseVerifiedEmail !== email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { donarEmail: email };
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });

    // get all requested food by email address
    app.get("/requestedFoods", fireBaseToken, async (req, res) => {
      const email = req.query.email;
      if (req.fireBaseVerifiedEmail !== email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const query = { userEmail: email };
      const result = await requestedFoodsCollection.find(query).toArray();
      res.send(result);
    });

    // put method to update the donated food
    app.put("/foodCollection/:id", fireBaseToken, async (req, res) => {
      const { id } = req.params;
      const filter = { _id: new ObjectId(id) };
      const { userEmail, ...updatedData } = req.body;
      if (req.fireBaseVerifiedEmail !== userEmail) {
        return res.status(403).send({ message: "forbidden access" });
      }

      if (updatedData.quantity) {
        updatedData.quantity = parseInt(updatedData.quantity);
      }

      if (updatedData.expiry) {
        updatedData.expiry = new Date(updatedData.expiry);
      }

      console.log(updatedData);
      const updatedDoc = {
        $set: updatedData,
      };

      const result = await foodCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // delete method to delete donated food from api
    app.delete("/foodCollection/:id", fireBaseToken, async (req, res) => {
      const { id } = req.params;
      const email = req.query.email;
      if (req.fireBaseVerifiedEmail !== email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = {
        _id: new ObjectId(id),
      };

      const result = await foodCollection.deleteOne(query);
      res.send(result);
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
