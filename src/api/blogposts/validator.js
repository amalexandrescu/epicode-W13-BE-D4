import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const blogPostSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and needs to be a string!",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "author.name is a mandatory field and needs to be a string",
    },
  },
  "author.avatar": {
    in: ["body"],
    isString: {
      errorMessage:
        "author.avatar is a mandatory field and needs to be a string",
    },
  },
  "readTime.value": {
    in: ["body"],
    isNumeric: {
      errorMessage:
        "readTime.value is a mandatory field and needs to be a number",
    },
  },
  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage:
        "readTime.unit is a mandatory field and needs to be a string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover is a mandatory field and needs to be a string",
    },
  },
};

export const checksBlogPostSchema = checkSchema(blogPostSchema); //middleware

//middleware
export const triggerBadRequest = (req, res, next) => {
  // 1. Check if previous middleware ( checksBlogPostSchema) has detected any error in req.body
  const errors = validationResult(req);

  console.log(errors.array());

  if (!errors.isEmpty()) {
    // 2.1 If we have any error --> trigger error handler 400
    next(
      createHttpError(400, "Errors during blog post validation", {
        errorsList: errors.array(),
      })
    );
  } else {
    // 2.2 Else (no errors) --> normal flow (next)
    next();
  }
};

// VALIDATION CHAIN 1. checksBlogPostSchema --> 2. triggerBadRequest
