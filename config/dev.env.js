'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '""',
  UPLOAD_API: '""',
  OFFICE_API: '"http://192.168.2.91:9528"',
  USER: {
    name: '"13588043792"',
    password: '"863063lv"'
  }
})
