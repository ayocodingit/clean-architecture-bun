// ecosystem.config.js
module.exports = {
    apps: [
      {
        name: "clean-architecture-bun",
        script: "./build/app.js",
        interpreter: "bun",
        instances: 1,
        exec_mode: "fork", // atau "cluster" jika ingin multi-core
        watch: false,
      },
    ],
  };
  
