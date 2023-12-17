module.exports = {
  apps: [
    {
      name: 'shiro',
      script: 'server.js',
      autorestart: true,
      watch: false,
      max_memory_restart: '180M',
      env: {
        PORT: 2323,
        NODE_ENV: 'production',
        ...require('dotenv').config().parsed,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
