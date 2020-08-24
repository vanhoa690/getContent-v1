const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const Chap = require("../models/chap.model");
const Story = require("../models/story.model");
const createSlug = require("./createSlug");

const MONGO_URL = "mongodb://localhost:27017/truyenonline";
mongoose.set("useCreateIndex", true);
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    throw err;
  });
async function getLinks(i) {
  const linkStory = "https://truyenonline.info/pham-nhan-tu-tien-2/page/";
  const URL = linkStory.concat(i);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(URL);
  const links = await page.$$eval(".entry-header h3.entry-title a", (link) =>
    link.map((a) => a.href)
  );
  // const links = await page.$eval(
  //   ".entry-header h3.entry-title a",
  //   (a) => a.href
  // );
  //   link.map((a) => a.href)
  // );
  await browser.close();
  return links;
}
async function getPageData(link, page) {
  // try {
  await page.setDefaultNavigationTimeout(0);
  await page.goto(link, {
    waitUntil: "networkidle2",
  });
  await page.waitFor(2000);

  const name = await page.$eval(
    ".entry-header h1.entry-title",
    (tit) => tit.innerText
  );

  const content = await page.$eval(
    "div.entry-content",
    (cont) => cont.innerHTML
  );

  // await browser.close();
  return {
    name,
    content,
  };
  // } catch (err) {
  // await page.waitFor(40000);
  // getPageData(link, page);
  // console.log(err);
  // throw err;
  // }
}
saveData = async function (data) {
  createSlug
    .createSlug(data.name, Chap)
    .then(async (slug) => {
      try {
        // console.log(slug);
        let name, titleSEO, descSEO, fomatCotent;
        const idStory = "5f43bc207cc8010e2410c092";
        const story = await Story.findById(idStory);
        let chaps = story.chaps;
        name = data.name.trim().replace(/[-:?"'><!@#$%\^&*()~`\.,;+ ]+/g, " ");
        titleSEO = "Đọc truyện ".concat(story.name, " Online - ", name);
        fomatCotent = data.content.replace(/<[^>]+>/g, "");
        descSEO = titleSEO.concat(" : ", fomatCotent.slice(0, 100), "...");
        // console.log(titleSEO);
        // console.log(descSEO);
        // console.log(slug);
        const chap = new Chap({
          name,
          slug,
          story: idStory,
          content: data.content,
          titleSEO,
          descSEO,
        });
        // console.log(chap);
        const saveChap = await chap.save();
        // console.log(saveChap);
        chaps.push(saveChap._id);
        const updateStory = await Story.updateOne(
          { _id: story._id },
          // { new: true },
          {
            $set: {
              chaps,
            },
          }
        );
        // console.log(updateStory);
      } catch (errors) {
        console.log(errors);
        // res.render("chaps/chap", { errors });
      }
      // res.redirect("/chaps");
    })
    .catch((err) => console.log(err));
};
getContent = async function () {
  for (let i = 1; i <= 15; i++) {
    let allLinks = await getLinks(i);
    // allLinks = allLinks.slice(71);
    // console.log(allLinks);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const stories = [];
    for (let link of allLinks) {
      // let data;
      // try {
      const data = await getPageData(link, page);
      // } catch (err) {
      // await page.waitFor(20000);
      // data = await getPageData(link, page);
      // console.log(err);
      // throw err;
      // }
      saveData(data);
      console.log("Done " + link);
    }
    console.log("Done " + i);
  }
  console.log("Done All ");
};
getContent();
