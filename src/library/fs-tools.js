import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
// console.log("test", join(dirname(fileURLToPath(import.meta.url)), "."));

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/users");
// console.log(join(publicFolderPath, "../.."));

console.log("ROOT OF THE PROJECT:", process.cwd());
console.log("PUBLIC FOLDER:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);
const blogPostsJSONPath = join(dataFolderPath, "blogposts.json");
console.log("blogPostsJSONPath", blogPostsJSONPath);

export const getBlogPosts = () => readJSON(blogPostsJSONPath);
export const writeBlogPosts = (blogPostsArray) =>
  writeJSON(blogPostsJSONPath, blogPostsArray);

export const saveUsersAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);

export const getBlogPostsJsonReadableStream = () =>
  createReadStream(blogPostsJSONPath);
