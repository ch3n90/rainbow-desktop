module.exports = {
    lintOnSave:false,
    devServer: {
      disableHostCheck: true,
        proxy: {
          '/rb': {
            target: 'http://192.168.1.118:9090',
            changeOrigin: true,
            pathRewrite:{
                '^/rb':''
            }
          },
          '/ws': {
            target: 'http://192.168.1.118:6767',
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
    },
    pluginOptions:{
      electronBuilder:{
        nodeIntegration: true
      }
    }
}