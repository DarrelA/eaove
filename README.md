## About

- Eaove: What are the Earthlings doing today?
- Suggest something for someone to do!

## Features

### Implemented

- Google Login

### Coming Soon

- Ideas Page
- User Account Dashboard
- Reputation System
- https://colorpalettes.earth/
- @TODO

## Issues

### Critical

1. ObjectParameterError in ideaController.js: new HttpError passed via next() will break the app
   - Might be something to do with authMiddleware as req.user data is being passed to errorMiddleware

### Non-Critical

2. InternalOAuthError in errorMiddleware.js
