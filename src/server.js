import Fastify from 'fastify';

import {getData } from "./api.js";
import fastifyStatic from "@fastify/static";
import path from "path";
import handlebars from 'handlebars';
import fastifyView from '@fastify/view';



const app = Fastify();
const __dirname = path.resolve();

app.register(fastifyStatic, {
    root: path.join(__dirname, 'templates')
});
app.register(fastifyView, {
    engine: {
        handlebars: handlebars
    },
    templates: 'templates',
    options: {
        partials: {
            header: path.join('header.hbs'),
            footer: path.join('footer.hbs')
        }
    }
});

app.get('/', (request, response) => {

    response.headers({'Content-Type': 'text/html'});
    getData("https://gateway.marvel.com:443/v1/public/characters").then(data => {
        response.view("index.hbs", { data: data });
    }).catch(err => {
        console.error("Erreur : ", err);
        response.status(500).send(err.message);
    });

});

app.listen({ port: 3000, host: 'localhost' });