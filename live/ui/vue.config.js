module.exports = {
    devServer: {
        proxy: 'https://localhost:44336/'
    },
    transpileDependencies: [
        'vuetify'
    ],
    publicPath: process.env.NODE_ENV === 'production' ? '/andon/' : '/'
}
