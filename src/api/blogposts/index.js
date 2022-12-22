import express from "express";
import uniqid from "uniqid"; //3rd party module
import httpErrors from "http-errors";
import { checksBlogPostSchema, triggerBadRequest } from "./validator.js";
import { getBlogPosts, writeBlogPosts } from "../../library/fs-tools.js";

const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogPostsRouter = express.Router();

// const blogPostsJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "blogposts.json"
// );

// const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
// const writeBlogPosts = (blogPostsArray) =>
//   fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

//POST

blogPostsRouter.post(
  "/",
  checksBlogPostSchema,
  triggerBadRequest,
  async (req, res, next) => {
    //you can use bad request here
    try {
      const newBlogPost = { ...req.body, createdAt: new Date(), id: uniqid() };
      const blogPostsArray = await getBlogPosts();
      blogPostsArray.push(newBlogPost);
      await writeBlogPosts(blogPostsArray);
      res.status(201).send({ newBlogPost: newBlogPost });
    } catch (error) {
      next(error); //this sends the error to the errorHandlers
    }
  }
);

//GET ALL POSTS

blogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    res.send(blogPostsArray);
    console.log("this is the simple get method");
  } catch (error) {
    next(error);
  }
});

//GET SINGLE POST

blogPostsRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const singleBlogPost = blogPostsArray.find(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (singleBlogPost) {
      res.send(singleBlogPost);
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//PUT

blogPostsRouter.put("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const index = blogPostsArray.findIndex(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (index !== -1) {
      const oldBlogPost = blogPostsArray[index];
      const updatedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };
      blogPostsArray[index] = updatedBlogPost;
      await writeBlogPosts(blogPostsArray);
      res.send(updatedBlogPost);
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE

blogPostsRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogPostsArray = await getBlogPosts();
    const remainingBlogPosts = blogPostsArray.filter(
      (blogPost) => blogPost.id !== req.params.blogPostId
    );

    if (blogPostsArray.length !== remainingBlogPosts.length) {
      await writeBlogPosts(remainingBlogPosts);
      res.status(204).send();
    } else {
      next(NotFound(`Blog post with id ${req.params.blogPostId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostsRouter;

// GET /blogPosts => returns the list of blogposts
// GET /blogPosts /123 => returns a single blogpost
// POST /blogPosts => create a new blogpost
// PUT /blogPosts /123 => edit the blogpost with the given id
// DELETE /blogPosts /123 => delete the blogpost with the given id
