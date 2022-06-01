## About

- Eaove: What are the Earthlings doing today?
- Suggest something for someone to do!

## Features

### Implemented

- Google Login
- Submit new idea to database
- Get all ideas from database
- Update creator's idea in database
- Delete creator's idea in database
- Upvote & downvote ideas
- Challenge ideas
- Search ideas by tag

### WIP

- Reputation System
  - User has completed the challenge
  - Creator may place a bounty
    - Creator set a time limit for it
  - If user reports that creator has yet to donate after a week is true
  - User may downvote creator after stating the reason
  - Creator may choose to response
  - Communication will be public to allow other challengers to decide if they want to commit to challenges posted by creator at their own discretion

### Coming Soon

- User Account Dashboard
- More Idea Pages: Challenging & Completed
- https://colorpalettes.earth/
- @TODO

## Issues

### Critical

👍🏻

### Non-Critical

1. useEffect deep compare to rerender issue in Landing.js
2. InternalOAuthError in errorMiddleware.js
3. Instead of navigating to Landing.js from thisIdea.js after casting vote, rerender page so user can continue viewing comments.
