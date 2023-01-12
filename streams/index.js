import { pipeline } from "stream";
import fs from "fs-extra";
import { join } from "path";
import request from "request";

const source = fs.createReadStream(
  join(process.cwd(), "./src/data/blogposts.json")
); // READABLE STREAM (data.json file)
const destination = process.stdout;

// const source = request.get("http://parrot.live");
// const destination = process.stdout;

pipeline(source, destination, (err) => {
  if (err) console.log(err);
  else console.log("STREAM ENDED SUCCESFULLY!");
});
