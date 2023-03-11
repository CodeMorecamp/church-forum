const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 4000;

const { Novu } = require("@novu/node");
const novu = new Novu("<c8cf261bea8650d00cac54646cbeae16>");

//To be able use Express and CORS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//render something to test the server
app.get("./api", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

//hold all the existing users
const users = [];

//generate random string as an ID
const generateID = () => Math.random().toString(36).substring(2, 10);

app.post("/api/register", async (req, res) => {
  const [email, password, username] = req.body;

  //holds the ID
  const id = generateID;
  //ensure there is no existing user with thesame credentials
  const result = users.filter(
    (user) => user.email === email && user.password === password
  );

  //if true
  if (result.length === 0) {
    const newUser = { id, email, password, username };
    //adds the user to the database (array)
    users.push(newUser);
    //success messgae
    return res.json({
      message: "Account created successfully",
    });
  } else {
    res.json({
      error_message: "User already exists",
    });
  }
  //log the credentials to the console
  console.log({ email, password, username, id });
});

//login into the application

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  //check if th user exist
  let result = users.filter(
    (user) => user.email === email && user.password === password
  );
  //if the user doesn't exist
  if (result.length !== 1) {
    return res.json({
      error_message: "Incorrect credentials",
    });
  } //returns the id if successfully logged in
  res.json({
    message: "Login Successful",
    id: result[0].id,
  });
});

//acepts post and user idfrom the user
app.post("/api/create/thread", async (req, res) => {
  const { thread, userId } = req.body;
  const threadId = generateID();

  console.log({ thread, userId, threadId });
});

const threadList = [];

//👇🏻 holds all the posts created
app.post("/api/create/thread", async (req, res) => {
  const { thread, userId } = req.body;
  const threadId = generateID();

  //👇🏻 add post details to the array
  threadList.unshift({
    id: threadId,
    title: thread,
    userId,
    replies: [],
    likes: [],
  });

  //👇🏻 Returns a response containing the posts
  res.json({
    message: "Thread created successfully!",
    threads: threadList,
  });
});

app.get("/api/all/threads", (req, res) => {
  res.json({
    threads: threadList,
  });
});

app.post("/api/thread/like", (req, res) => {
  //👇🏻 accepts the post id and the user id
  const { threadId, userId } = req.body;
  //👇🏻 gets the reacted post
  const result = threadList.filter((thread) => thread.id === threadId);
  //👇🏻 gets the likes property
  const threadLikes = result[0].likes;
  //👇🏻 authenticates the reaction
  const authenticateReaction = threadLikes.filter((user) => user === userId);
  //👇🏻 adds the users to the likes array
  if (authenticateReaction.length === 0) {
    threadLikes.push(userId);
    return res.json({
      message: "You've reacted to the post!",
    });
  }
  //👇🏻 Returns an error user has reacted to the post earlier
  res.json({
    error_message: "You can only react once!",
  });
});

app.post("/api/thread/replies", (req, res) => {
  //👇🏻 The post ID
  const { id } = req.body;
  //👇🏻 searches for the post
  const result = threadList.filter((thread) => thread.id === id);
  //👇🏻 return the title and replies
  res.json({
    replies: result[0].replies,
    title: result[0].title,
  });
});

app.post("/api/create/reply", async (req, res) => {
  //👇🏻 accepts the post id, user id, and reply
  const { id, userId, reply } = req.body;
  //👇🏻 search for the exact post that was replied to
  const result = threadList.filter((thread) => thread.id === id);
  //👇🏻 search for the user via its id
  const user = users.filter((user) => user.id === userId);
  //👇🏻 saves the user name and reply
  result[0].replies.unshift({
    userId: user[0].id,
    name: user[0].username,
    text: reply,
  });

  res.json({
    message: "Response added successfully!",
  });
});
