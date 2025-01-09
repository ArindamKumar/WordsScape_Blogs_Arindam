import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";
import methodOverride from "method-override";
import sanitizeHtml from "sanitize-html";
import {getPosts,setPosts} from "./posts.js";

let dirName=dirname(fileURLToPath(import.meta.url));
const port=3000;
const app=express();

app.use(express.static('public'));
app.use(`/posts/:id/styles`,express.static('public/styles'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));

//Displaying the posts on the home page
let posts=getPosts();
app.get("/",(req,res)=>{
	res.render('index.ejs',{posts});
});

//Create New Post form
app.get("/new",(req,res)=>{
	res.render('newPostForm.ejs');
});

app.post("/posts", (req,res)=>{
	console.log(req.body);
	let {title,author,content,imageRequired,imageUrl}=req.body; // Destructuring the req body
	title=`<h2>${title}</h2>`;
	content=`<p>${content}</p>`;
	author=`<p class="author">${author}</p>`;

	const posts=getPosts();
	let newPost={
		id:posts.length+1,
		title,
		content,
		author,
		image: (imageRequired)?imageUrl:null
	};
	posts.push(newPost);
	setPosts(posts);
	res.redirect("/");
});

//Edit Post Form
app.get("/posts/:id/edit", (req,res)=>{
	let post=posts.find((p)=>p.id===parseInt(req.params.id));
	if(!post)
		return res.status(404).send(`Post not found!`);
	res.render(`postEdit.ejs`,{post});
});


app.put("/posts/:id", (req,res)=>{
	let {title,content,author}=req.body;
	let post=posts.find((p)=>{
		return p.id===parseInt(req.params.id);
	});
	if(!post)
		return res.status(404).send(`Post not found!`);
	post.title=title;
	post.content=content;
	post.author=author;
	res.redirect("/");
});

// app.delete("/posts/:id", (req,res)=>{
// 	let post=posts.find((p)=>{
// 		return p.id===parseInt(req.params.id);
// 	});
// 	if(!post)
// 		return res.status(404).send(`Post not found!`);
// 	posts=posts.filter(p=>p.id!=parseInt(req.params.id));
// 	res.redirect("/");
// });

app.delete("/posts/:id", (req, res) => {
  console.log("Before deletion:", posts); // Log posts before deletion
  const postIndex = posts.findIndex((p) => p.id === parseInt(req.params.id));
  if (postIndex === -1) return res.status(404).send(`Post not found!`);
  posts.splice(postIndex, 1);
  console.log("After deletion:", posts); // Log posts after deletion
  res.redirect("/");
});


app.listen(port,()=>{
	console.log(`Server running on port ${port}`);
});