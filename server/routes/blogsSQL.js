import Router from "express";
import multer from "multer";
import connection from "../db.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blog");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const Blog = Router();

Blog.route("/addBlog").post(upload.single("image"), (req, res, err) => {
  if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    res.send({ msg: "Not an Image File." });
  } else {
    const title = req.body.title;
    const desc = req.body.desc;
    const memberID = req.body.memberId;
    const date = req.body.date;
    const about = req.body.about;
  

    const image = req.file.filename;
    console.log(image);

    connection.query(
      `INSERT INTO blog (memberId,title,description,content,publishedDate,image) VALUES (?,?,?,?,?,?)`,
      [memberID, title,about, desc, date, image],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json("success");
        }
      }
    );
  }
});

Blog.post("/getAllBloggers", (req, res) => {
  const mid = req.body.memberId;
  const sqlSelect =

    "SELECT blog.image, user.id , user.firstName,COUNT(user.firstName) as number, user.lastName from member Inner JOIN user on user.id = member.id INNER join blog on blog.memberId = member.memberId GROUP by(firstName) ORDER BY number  DESC";
  connection.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

Blog.post("/getAllBlogs", (req, res) => {

 
  const mid = req.body.memberId;
  const title=req.body.title;
  const firstName=req.body.firstName;

  const sqlSelect = "SELECT blog.*, user.id , user.profileImage, user.firstName , user.lastName , user.email , member.id from member Inner JOIN user on user.id = member.id RIGHT join blog on blog.memberId = member.memberId  where user.firstName like '"+firstName+"%' and blog.title like '"+title+"%'  ORDER BY `blog`.`publishedDate` DESC ";
  
  //const sqlSelect = "SELECT blogId, title, image, publishedDate FROM blog";
  //"SELECT DISTINCT user.firstName,user.lastName FROM ((user INNER JOIN member ON user.id=member.id ) INNER JOIN blog ON member.memberId=blog.memberId )"
  connection.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

Blog.post("/getMyBlogs", (req, res) => {
  console.log("get all blogs line -700");
  const mid = req.body.mId;
  console.log(mid);
  connection.query(
    "SELECT blogId, title,description,image, content FROM blog WHERE memberId = ?;",
    [mid],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        res.send(result);
      }
      }
    );
  });

 // get Blog details to display on the blogView.js
Blog.post("/getBlog", (req, res) => {
  const bid = req.body.bId;
  connection.query(
    " SELECT blog.title,blog.description,blog.content,blog.publishedDate,blog.image,user.email, user.title, user.firstName, user.lastName, user.profileImage FROM ((blog INNER JOIN member ON member.memberId = blog.memberId) INNER JOIN user ON user.id = member.id) WHERE blogId= ?;",
    [bid],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        res.send(result);
      }
    }
  );
});


Blog.post("/getBloggerBlogs", (req, res) => {
  const mid = req.body.mId;
  connection.query(
    " SELECT blog.blogId, blog.title,blog.content,blog.publishedDate,blog.image,user.email, user.title, user.firstName, user.lastName, user.profileImage FROM ((blog INNER JOIN member ON member.memberId = blog.memberId) INNER JOIN user ON user.id = member.id) WHERE blog.memberId = ?;",
    [mid],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        res.send(result);
      }
    }
  );
});

Blog.post("/deleteItem", (req, res) => {
  const tableName = req.body.tableName;
  const qid = req.body.qid;
  const coloum = req.body.coloum;
console.log(qid);
  const sqlSelect =
    "delete from " + tableName + " where " + coloum + "  =" + qid;

  connection.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

Blog.route("/updateBlog").post(
  upload.single("image"),
  (req, res, err) => {
    // if (!req.file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    //   res.send({ msg: "Not an Image File." });
    // } else {
      const bId = req.body.blogId;
      

      const title = req.body.title;
      const about = req.body.description;

      const desc = req.body.content;
      // const memberID = req.body.memberId;
      const image = req.file.filename;

     console.log(image);
      
      

      connection.query(
        "UPDATE blog SET title = ?, description = ? ,image = ?, content = ? WHERE blogId = ?;",
        [
          title,
          about,
          image,
          desc,
          bId,
        ],
        (error, result, feilds) => {
          if (error) console.log(error);
          else {
            res.send({
              data: result,
              msg: "Successfully Updated.",
            });
          }
        }
      );
    
  }
);

//to update

Blog.post("/getBlogView", (req, res) => {
  const bid = req.body.id;
  connection.query(
    "SELECT blog.* from blog where blogId = ?;",
    [bid],
    (error, result, feilds) => {
      if (error) console.log(error);
      else {
        res.send(result);
      }
    }
  );
})
 
  
  export default Blog;

