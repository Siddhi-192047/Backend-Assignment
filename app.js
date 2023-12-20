const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Movie = require('./models/movie');

mongoose.connect('mongodb://localhost:27017/moviebox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/movies', async (req, res) => {
    const movies = await Movie.find({});
    if (!movies) {
        res.send('No movie found add new movie')
    }else {
    res.render('/index', { movies })
    }
});

app.get('/movies/new', (req, res) => {
    res.render('/new');
})

app.post('/movies', async (req, res) => {
    const movie = new Movie(req.body);
    await movie.save();
    res.redirect(`/movies/${movie._id}`)
})

app.get('/movies/:id', async (req, res,) => {
    const movies = await Movie.findById(req.params.id)
    res.render('/show', { movies });
});

app.get('/movies/:id/edit', async (req, res) => {
    const movies = await Movie.findById(req.params.id)
    res.render('movies/edit', {movies });
})

app.put('/movies/:id', async (req, res) => {
    const { id } = req.params;
    const movies = await Movie.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/movies/${movies._id}`)
});

app.delete('/movies/:id', async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.redirect('/movies');
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})