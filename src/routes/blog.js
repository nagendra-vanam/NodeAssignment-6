const router = require("express").Router();
const Blog = require("../models/Blog");

// Your routing code goes here
////////////////////get
router.get("/blog", async (req, res) => {
  try {
    const pagenumber = Number(req.query.page);
    const topic = req.query.search;
    if (pagenumber <= 0 || "") {
      return res.json({
        status: "failed",
        message: "enter a valid number",
      });
    }
    const blogdata = await Blog.find({ topic: topic });

    const length = blogdata.length;
    if (length == 0) {
      return res.json({
        status: "error",
        message: "unavailable",
      });
    }
    let numberofpages = Math.ceil(length / 5);
    if (pagenumber > numberofpages) {
      return res.json({
        status: "failed",
        message: `enter page number below ${numberofpages}`,
      });
    }
    const outputblog = await Blog.find({ topic: topic })
      .skip((pagenumber - 1) * 5)
      .limit(5);
    res.json({
      status: "success",
      result: outputblog,
    });
  } catch (e) {
    res.json({
      status: "something went wrong",
      message: e.message,
    });
  }
});

////////////////////////////////////////////////////////////////
////////post
router.post("/blog", async (req, res) => {
  try {
    const data = req.body;
    const blogdata = await Blog.create(data);
    res.json({
      status: "success",
      result: blogdata,
    });
  } catch (e) {
    res.json({
      status: "something went wrong",
      message: e.message,
    });
  }
});

///-------------------------------------
router.put("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let data = req.body;
    const blogdata = await Blog.updateOne({ _id: id }, data);
    res.json({
      status: "success",
      result: blogdata,
    });
  } catch (e) {
    res.json({
      status: "something went wrong",
      message: e.message,
    });
  }
});
//------------------------------------------
router.delete("/blog/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blogdata = await Blog.deleteOne({ _id: id });
    res.json({
      status: "success",
      result: blogdata,
    });
  } catch (e) {
    res.json({
      status: "something went wrong",
      message: e.message,
    });
  }
});

module.exports = router;
