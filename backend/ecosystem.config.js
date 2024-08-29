module.exports = {
  apps: [
    {
      name: "nodeapp",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
