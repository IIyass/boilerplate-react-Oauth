const express = require("express");
const jwt = require("express-jwt"); // Validate JWT and set req.user
const jwksRsa = require("jwks-rsa"); // Retrieve RSA keus from JSON Web Key set (JWKS) endpoint
const checkScope = require("express-jwt-authz"); //Validate JWT scopes
require("dotenv").config(); // getting acces to .env variable into this file.
const app = express();

const checkJwt = jwt({
  //Dynamically provide a signing key based on the kid in the header
  // and the signing keys provided by the JWKS endpoint.

  secret: jwksRsa.expressJwtSecret({
    cache: true, //cache the signing key
    rateLimit: true,
    jwksRequestsPerMinute: 5, //prevent attackers from requesting more than 5 per minute
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  //Validate the audience and the issuer
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

  //This must match the algorithm selected in the AUth0 dashboard under your app's
  // advanced setting under the 0Auth tab
  algorithms: ["RS256"],
});

// Admin middlware.
function checkRole(role) {
  return function (req, res, next) {
    const assignedRoles = req.user["http://localhost:3000/roles"];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send("insufficient role");
    }
  };
}

app.get("/public", function (req, res) {
  res.json({
    message: "hello from public api",
  });
});
// API Require only authantication to access it.
app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "hello from private api",
  });
});

// API require some scoope
app.get("/course", checkJwt, checkScope(["read:courses"]), function (req, res) {
  res.json({
    courses: [
      { id: 1, title: "Hello world" },
      { id: 2, title: "Hello Dude" },
    ],
  });
});

//API require admin role

app.get("/admin", checkJwt, checkRole("admin"), function (req, res) {
  res.json({
    message: "Hey iam an admin",
  });
});

app.listen(3001);
console.log("API server listenin on:" + process.env.REACT_APP_AUTH0_API_URL);
