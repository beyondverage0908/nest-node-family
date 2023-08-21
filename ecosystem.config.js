module.exports = {
  apps: [
    {
      name: 'website-filtering-spider',
      script: '/opt/nginx/nodejs/website-filtering-spider/dist/main.js',
      cwd: '/opt/nginx/nodejs/website-filtering-spider',
      instances: '1',
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'nest-node-family',
      script: '/opt/nginx/nodejs/nest-node-family/dist/main.js',
      cwd: '/opt/nginx/nodejs/nest-node-family',
      instances: '2',
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
