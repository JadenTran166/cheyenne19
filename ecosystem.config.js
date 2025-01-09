const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : '';
// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : '';
// Target server application path
const TARGET_SERVER_APP_PATH = `/home/${TARGET_SERVER_USER}/app`;
// Your repository
const REPO = 'git@gitlab.com:siphu1997/cheyenne19.git';

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
        name      : 'my_react_app',
        script    : 'npm',
        args      : 'run start',
        env_production : {
          NODE_ENV: 'production'
        }
      },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: TARGET_SERVER_USER,
      host: TARGET_SERVER_HOST,
      port: "7878",
      ref: 'origin/master',
      repo: REPO,
      path: '/apps/nodejs/germany_server/cheyenne19',
      ssh_options: 'StrictHostKeyChecking=no',
      key: 'root/.ssh/id_rsa.pub',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};