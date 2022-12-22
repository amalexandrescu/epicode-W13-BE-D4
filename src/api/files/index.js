import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveUsersAvatars,
  getBlogPosts,
  writeBlogPosts,
} from "../../library/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:id/uploadCover",
  multer().single("avatar"),
  async (req, res, next) => {
    // "avatar" needs to match exactly to the name of the field appended in the FormData object coming from the FE
    // If they do not match, multer will not find the file
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.id + originalFileExtension;

      await saveUsersAvatars(fileName, req.file.buffer);

      const url = `http://localhost:3001/img/users/${fileName}`;
      console.log("url", url);

      const blogPostsArray = await getBlogPosts();

      const index = blogPostsArray.findIndex(
        (blogPost) => blogPost.id === req.params.id
      );
      if (index !== -1) {
        const oldBlogPost = blogPostsArray[index];
        const author = { ...oldBlogPost.author, avatar: url };
        const updatedBlogPost = {
          ...oldBlogPost,
          author,
          updatedAt: new Date(),
        };

        blogPostsArray[index] = updatedBlogPost;

        await writeBlogPosts(blogPostsArray);
      }

      res.send("File uploaded");
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post("/:id/comments", async (req, res, next) => {
  console.log("hello");
  //you can use bad request here
  try {
    const blogPostsArray = await getBlogPosts();

    const index = blogPostsArray.findIndex(
      (blogPost) => blogPost.id === req.params.id
    );
    if (index !== -1) {
      const oldBlogPost = blogPostsArray[index];
      // const author = { ...oldBlogPost.author, avatar: url };
      const updatedBlogPost = {
        ...oldBlogPost,
        comments: req.body,
        updatedAt: new Date(),
      };

      blogPostsArray[index] = updatedBlogPost;

      await writeBlogPosts(blogPostsArray);
      res.status(201).send({ newBlogPost: updatedBlogPost.comments });
    }
  } catch (error) {
    next(error); //this sends the error to the errorHandlers
  }
});

// filesRouter.post(
//   "/multiple",
//   multer().array("avatars"),
//   async (req, res, next) => {
//     try {
//       console.log("FILES:", req.files);
//       await Promise.all(
//         req.files.map((file) =>
//           saveUsersAvatars(file.originalname, file.buffer)
//         )
//       );
//       res.send("File uploaded");
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default filesRouter;
