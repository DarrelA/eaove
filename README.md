## About

- Eaove: What are the Earthlings doing today?
- Suggest something for someone to do!

## Features

### Implemented

- Google Login
- Submit new idea to database
- Get all ideas from database
- Update creator's idea in database
- Upvote & downvote ideas

### WIP

- Ideas Page

### Coming Soon

- User Account Dashboard
- Reputation System
- https://colorpalettes.earth/
- @TODO

## Issues

### Critical

1. ObjectParameterError in ideaController.js: new HttpError passed via next() will break the app
   - Might be something to do with authMiddleware as req.user data is being passed to errorMiddleware

### Non-Critical

1. useEffect deep compare to rerender issue in Landing.js
2. InternalOAuthError in errorMiddleware.js
