# <img src="https://cloud.githubusercontent.com/assets/7833470/10899314/63829980-8188-11e5-8cdd-4ded5bcb6e36.png" height="60">

# Passport Auth with React

### Why is this important?

We already know how to do auth with MEN stack apps, but we want to have options of doing auth if we use a framework as well. Because React scripts run on a separate server from the backend, we need to identify what changes should be made to use Passport with React.

### What are the Objectives:

* See how we adjust our usual Passport auth implementation for a React app
* identify the steps needed to use Passport with React

### Where should we be now?

* Should already have implemented simple auth and/or Passport auth with a MEN stack app
* Should have a good understanding of hashing and salting as it relates to passwords and auth
* Should be able to successfully build a basic React app


### Passport Review

We're going to use [passport.js](http://passportjs.org/) for auth. If you want a more detailed tutorial on passport itself, check out the lab [here](https://github.com/SF-WDI-LABS/express-microblog-add-auth).

Passport is a useful middleware library auth in node apps. We will use a local auth strategy, which means we will have the user enter a username and password (not going through Google or FB auth). We're also using `passport-local-mongoose`, which simplifies building username and password auth with passport.

### Investigate the Code


Clone this repo, `npm install`, and navigate around. You'll see that this is a basic React App, and it's a veggie farm meetup. Check out the models. You should see two, Vegetable and User. Vegetable has a reference to User:

```js
var VegetableSchema = new Schema({
  name: String,
  description: String,
  username: String,
  user:
  {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});
```

Now let's look at the User. We've required the relevant mongoose middleware and set up a basic User model with a password and string. Passport is going to handle the hashing and salting of the password for us.

```js
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
  username: String,
  password: String
});

UserSchema.plugin(passportLocalMongoose);
```
