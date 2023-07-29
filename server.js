const express = require('express');
const app = express();
const port = 3001;
const bs = require('browser-sync').create();

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    bs.init({
        files: ['public/**/*.*'],
        server: {
            "baseDir": "public"
        },
        browser: 'default',
        notify: false,
        reloadDelay: 1000 // Ritardo per consentire al server di riavviarsi completamente prima del reload
    });
});


app.use(express.static('public'));
