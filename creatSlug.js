// createSlug = function (name) {
//   if (name) {
//     // console.log(name);
//     let slug = name
//       .trim()
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .replace(/đ/g, "d")
//       .replace(/Đ/g, "D")
//       .replace(/[^a-z0-9]+/g, "-");

//     console.log(slug);
//     // return getSlug(slug, model);
//   }
//   // res.redirect("/stories/create");
// };
// createSlug("Chương 1550 Ta muốn… khiêu chiến   ... ## q213 % ! ngươi 1     ");
module.exports.createSlug = async function (name, model) {
  if (name) {
    // console.log(name);
    let slug = name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9]+/g, "-");
    // console.log(getSlug(slug, model));
    return getSlug(slug, model);
  }
  // res.redirect("/stories/create");
};
async function getSlug(slug, model) {
  try {
    let slugFind = await model.findOne({ slug });
    // console.log(slugFind);
    if (slugFind) {
      let randomNumber = Math.floor(Math.random() * 1000000000);
      slug = slug + "-" + randomNumber;
      // console.log(slug);
      return getSlug(slug, model);
    }
    return slug;
  } catch (err) {
    throw err;
  }
}
