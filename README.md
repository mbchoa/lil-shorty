# 🩳 shorty

A little weekend project/challenge to create my own URL shortener. I was inspired by [Coding Garden with CJ](https://www.youtube.com/channel/UCLNgu_OupwoeESgtab33CCw) who built one during his [live stream](https://www.youtube.com/watch?v=gq5yubc1u18). 
You can check it out [**here**](https://lil-shorty.glitch.me)!

I was mainly interested in learning to use the following libraries/frameworks I haven't used before:
- [x] [Vue](https://vuejs.org/)
- [x] [Fastify](https://www.fastify.io/)
- [x] [Monk](https://github.com/Automattic/monk)

## Development

1. Create a free tier MongoDB cluster with [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    * Save the `MONGODB_URI` connection string
    * Make sure to whitelist IP addresses you expect to connect to the database cluster
3. Create a `.env` file in the root directory of your project
    * Add a `PORT` variable where the Node server will accept requests
    * Add a `MONGODB_URI` variable with the previously saved connection string
2. Run `npm run dev` to spin up Fastify server
3. Visit `http://localhost:3000`