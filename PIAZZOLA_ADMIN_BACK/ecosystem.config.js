module.exports = {
  apps: [{
    name: "piazzola_admin",
    script: './dist/app.js',
    exec_mode: "cluster",      // Mode cluster
    instances: 2,             // 2 instances au lieu de 4
    max_memory_restart: "800M", // Redémarre si une instance dépasse 800 Mo de RAM
    watch: false,
    out_file: "/dev/null",
    error_file: "/dev/null",
    env: {
      NODE_ENV: "production"
    },
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true
  }]
};
