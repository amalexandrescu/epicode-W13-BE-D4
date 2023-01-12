import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveUsersAvatars,
  getBlogPosts,
  writeBlogPosts,
} from "../../library/fs-tools.js";
import { pipeline } from "stream";
import { createGzip } from "zlib";
import json2csv from "json2csv";
import { getBlogPostsJsonReadableStream } from "../../library/fs-tools.js";
import { getPDFReadableStream } from "../../library/pdf-tools.js";
// import { from } from "json2csv/JSON2CSVTransform.js";

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

filesRouter.get("/blogPostsJSON", (req, res, next) => {
  try {
    console.log("files router test");
    // SOURCES (file on disk, http request, ...) --> DESTINATION (file on disk, terminal, http response, ...)

    // SOURCE (READABLE STREAM on blogposts.json file) --> DESTINATION (WRITABLE STREAM http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=blogPosts.json.gz"
    );
    // without this header the browser will try to open (not save) the file.
    // This header will tell the browser to open the "save file as" dialog
    const source = getBlogPostsJsonReadableStream();
    const transform = createGzip();
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
    // res.send("trying to fix this");
  } catch (error) {
    console.log("error", error);
    next(error);
  }
});

filesRouter.get("/blogsPdf", async (req, res, next) => {
  res.setHeader("Content-Disposition", "attachment; filename=test.pdf");

  const blogs = await getBlogPosts();
  const source = getPDFReadableStream(blogs);
  const destination = res;
  pipeline(source, destination, (err) => {
    if (err) console.log(err);
  });
});

filesRouter.get("/blogsCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogs.csv");
    // SOURCE (readable stream on blogs.json) --> TRANSFORM (json into csv) --> DESTINATION (response)
    const source = getBlogPostsJsonReadableStream();
    const transform = new json2csv.Transform({
      fields: ["title", "category"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
