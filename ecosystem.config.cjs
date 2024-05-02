module.exports = {
  apps: [
    {
      name: 'Shiro',
      script: 'npx next start -p 2323',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        NEXT_SHARP_PATH: process.env.NEXT_SHARP_PATH,
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
