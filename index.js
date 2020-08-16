const cors = require('fastify-cors');
const env = require('env-schema');
const fastify = require('fastify');
const helmet = require('fastify-helmet');
const monk = require('monk');
const path = require('path');
const static = require('fastify-static');
const { nanoid } = require('nanoid');

// Config Variables
const config = env({
  dotenv: true,
  schema: {
    type: 'object',
    required: ['MONGODB_URI', 'PORT'],
    properties: {
      MONGODB_URI: { type: 'string' },
      PORT: { type: 'string' },
    },
  },
});

// Connect MongoDB
const db = monk(config.MONGODB_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

// App
const app = fastify({
  logger: { redact: ['hostname', 'pid'] },
});

// Middlewares
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:'],
      'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
      'style-src': ["'self'", 'https://cdnjs.cloudflare.com'],
    },
  },
});

app.register(cors);
app.register(static, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

// Routes
app.get('/:slug', async (request, reply) => {
  try {
    const url = await urls.findOne({ slug: request.params.slug });
    if (url) {
      app.log.info(`Successfully redirected to: ${url.url}`);
      return reply.status(301).redirect(url.url);
    }
    reply.status(404).sendFile('404.html');
  } catch (err) {
    reply.status(400).sendFile('404.html');
  }
});

app.post('/create', async (request, reply) => {
  let { slug, url } = request.body;

  if (!slug) {
    slug = nanoid(8);
  } else {
    const existing = await urls.findOne({ slug });
    if (existing) {
      reply.status(422).send({ message: 'Duplicate slug', statusCode: 422 });
    }
  }

  slug = slug.toLowerCase();
  const created = await urls.insert({ url, slug });
  reply.status(201).send(created);
});

// Start server
(async () => {
  try {
    await app.listen(config.PORT);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    db.close();
    app.log.error(err);
    process.exit(1);
  }
})();
