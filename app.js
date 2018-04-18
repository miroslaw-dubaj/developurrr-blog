const express = require('express'),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      app = express();
      
app.use(express.static(__dirname + '/'));

mongoose.connect('mongodb://localhost/developurr', (err) => {
  console.log('Mongoose connection:', 
  (err)?(false):(true))
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  date: { type: Date, default: Date.now() }
})

const Blog = mongoose.model('Blog', blogSchema);

app.get('/', (req, res) => {
  res.redirect('/blogs');
})

app.get('/blogs', (req, res) => {
  Blog.find({}, (err, dbRes) => {
    (err)?(console.log('Could not find db', err)):(res.render('index', {blogs: dbRes}))
  });
});

app.get('/blogs/new', (req, res) => {
  res.render('new');
})

app.post('/blogs', (req, res) => {
  req.body.blog.content = req.sanitize(req.body.blog.content);
  Blog.create(req.body.blog, (err, newBlog) => {
    (err) ? (console.log('Could not create:', err)) : (res.redirect('/blogs'));
  })
});

app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, dbRes) => {
    (err) ? (console.log('Could not find id:', err)) : (res.render('show', {blog: dbRes}))
  });
});

app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, dbRes) => {
    (err) ? (console.log('Could not find id:', err)) : (res.render('edit', {blog: dbRes}))
  })
});

app.put('/blogs/:id', (req, res) => {
  req.body.blog.content = req.sanitize(req.body.blog.content);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, dbRes) => {
    (err) ? (console.log('Could not update:', err)) : (res.redirect('/blogs/' + dbRes.id))
  })
})

app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, dbRes) => {
    (err) ? (console.log('Could not delete:', err)) : (res.redirect('/blogs'))
  })
})

app.listen(8080, 'localhost', () => {
  console.log('Serving Developurr.pl blog');
});
