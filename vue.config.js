module.exports = {
    devServer: {
      disableHostCheck: true,
        proxy: {
          '/rb': {
            target: 'http://localhost:9090',
            changeOrigin: true,
            pathRewrite:{
                '^/rb':''
            }
          },
          '/ws': {
            target: 'http://localhost:6767',
            ws: true,
            changeOrigin: true,
            pathRewrite:{
                '^/ws':''
            }
          },
          '/oss': {
            target: 'http://192.168.1.118:9000',
            changeOrigin: true,
            pathRewrite:{
                '^/oss':'/oss'
            }
          }
        }
    }
}