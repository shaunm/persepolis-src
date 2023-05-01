/* eslint-disable */
import * as functions from "firebase-functions";
import * as express from "express";
import { Application, Request, Response } from "express";
import { FieldValue } from "firebase-admin/firestore";
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app: Application = express();

// [END import]

// [START middleware]
const cors = require("cors")({ origin: true });
app.use(cors);
app.use(express.json());

initializeApp();

const db = getFirestore();



// [END middleware]

// [START index]
// This endpoint provides displays the index page.
app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello, World!",
  });
});
// [END index]


app.get("/translate", async (req: Request, res: Response): Promise<Response> => {

  //get index of number
  const num = Math.floor(Math.random() * 1220);
  console.log("Randomly selected:", num)
  let phrase = null
  try {
    // Create a reference to the cities collection
    const snapshot = await db.collection("phrases").where("number", "==", num).get();
    // Create a query against the collection

    if (!snapshot.empty) {
      console.log(snapshot)
    }
    snapshot.forEach((doc: { id: any; data: () => any; }) => {
      console.log(doc.id, "=>", doc.data())
      phrase = [doc.id, doc.data()]
    });

  } catch (e) {
    console.error(e)
  }


  // Return random document from phrases collection
  return res.status(200).send({
    "translate": phrase
  });
});

app.post("/translate", async (req: Request, res: Response): Promise<Response> => {

  // Request Details
  const id = req.body.id
  const translation = req.body.translation
  const user = req.body.user
  console.log(user, id, translation)


  let userObj = null
  let translationObj = null
  let karmaOwner = user


  // Fetch User Data
  try {
    const usr = await db.collection("users").doc(user).get();

    if (usr.exists) {
      console.log("Found user")
      userObj = JSON.parse(JSON.stringify(usr.data())) //Deepcopy
    }
    else {
      userObj = {
        "contributions": [],
        "karma": 1,
      }
    } 
  }
  catch (e) {
    console.error(e)
    return res.status(400).send({
      error: e,
    });
  }





  //Fetch and Update Translation Data
  try {
    const doc = await db.collection("phrases").doc(id).get();

    if (doc.exists) {
      console.log("Found doc", doc.data())
      translationObj = JSON.parse(JSON.stringify(doc.data())) //Deepcopy

      let found = translationObj["translations"].findIndex((item: { text: any; }) => item.text === translation);

      if (found > -1) {
        translationObj["translations"][found]["votes"] = translationObj["translations"]["votes"] + userObj["karma"]
        karmaOwner = translationObj["translations"][found]["contributer"]
      }
      else {
        translationObj["translations"].push({ "votes": 1, "text": translation, "contributer": user })
      }

      await db.collection('phrases').doc(id).update(translationObj);

    }
  }
  catch (e) {
    console.error(e)
    return res.status(400).send({
      error: e,
    });
  }



  //Reward User
  try {
    //Update the user karma by 1
    //Update the contributer karma by user karma
    if (karmaOwner == user) {
      userObj["contributions"].push(id)
      userObj["karma"] += 1
    }
    else {
      userObj["karma"] += 1
    }
    await db.collection('users').doc(user).set(userObj);


    await db.collection('users').doc(karmaOwner).update({
      karma: FieldValue.increment(userObj["karma"])
    });

   
  }
  catch (e) {
    console.error(e)
    return res.status(400).send({
      error: e,
    });
  }
  return res.status(200).send({
    "success": id
  });



});
// [END index]



app.get("/user/:id", async (req: Request, res: Response): Promise<Response> => {

  const user = req.params.id
  let userObj = null
  try {
    const usr = await db.collection("users").doc(user).get();

    if (usr.exists) {
      console.log("Found user")
      userObj = JSON.parse(JSON.stringify(usr.data())) //Deepcopy
    }
    else {
      userObj = {
        "contributions": [],
        "karma": 1,
      }
    } 
  }
  catch (e) {
    console.error(e)
    return res.status(400).send({
      error: e,
    });
  }

  return res.status(200).send(userObj);
});
// [START export]
// Export the express app as an HTTP Cloud Function
exports.app = functions.https.onRequest(app);
// [END export]


