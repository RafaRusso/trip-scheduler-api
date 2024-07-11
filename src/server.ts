import fastify from "fastify"

const app = fastify();

app.get('/test', () => {
  return 'hello world'
})
app.listen({port: 3333}).then(() => {
  console.log('server running!')
})