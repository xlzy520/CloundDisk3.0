'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api_zhq"',
  UPLOAD_API: '"/api_zhq"',
  USER: {
    name: '"13588043792"',
    password: '"dj123456"'
  }
})
