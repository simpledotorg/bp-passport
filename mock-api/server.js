const express = require('express')
const MockApi = require('simple-mock-api')
const path = require('path')

const mockapi = new MockApi({
  apiEndpoint: '/api',
  responsesDir: path.resolve(__dirname, './responses/'),
  useTimeout: true,
  timeout: 3000,
})

const app = express()
const port = process.env.PORT || 3000
app.use('/', mockapi.router)

app.listen(port, (err) => {
  if (err) throw err
  // console.log(`> Mock API Ready on http://localhost:${port}`)
  //This should now resolve: http://localhost:3000/api/patient
})
