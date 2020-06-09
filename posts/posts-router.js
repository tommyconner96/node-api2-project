//imports
const express = require("express")
const posts = require("../data/db")

const router = express.Router()
//POST a new post to posts
router.post("/api/posts", (req, res) => {
    if (!req.body.title || !req.body.contents) {
      return res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    }
    posts
      .insert(req.body)
      .then((post) => {
        posts.findById(post.id).then((post) => {
            res.status(201).json(post)
        })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          error: "There was an error while saving the post to the database."
        })
      })
  })

router.post("/api/posts/:id/comments", (req, res) => {
    const comment = { post_id: req.params.id, ...req.body }

    if (!req.body.text) {
        res.status(400).json({message: "Please provide text for the comment"})
    }
  
    posts
      .insertComment(comment)
      .then((data) => {
        if (data) {
            res.status(201).json(data)
        } else  {
           res.status(404).json({error: "the post with the specified ID does not exist."})
        }
      })
      .catch((err) => {
        res.status(500).json(err, {
          message: "There was an error while saving the comment to the database.",
        })
      })
  })

//GET posts
  router.get("/api/posts", (req, res) => {
    posts
      .find({
        sortBy: req.query.sortBy,
        limit: req.query.limit,
      })
      .then((posts) => {
        res.status(200).json(posts)
      })
      .catch((error) => {
        console.log(error)
        return res.status(500).json({
          error: "The posts information could not be retrieved."
        })
      })
  })

//GET post by id
router.get("/api/posts/:id", (req, res) => {
	posts
		.findById(req.params.id)
		.then((post) => {
			if (post[0]) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist."
				})
            }
		})
		.catch((error) => {
			console.log(error)
			res.status(500).json({
				error: "The post information could not be retrieved."
			})
		})
})

router.get('/api/posts/:id/comments', (req, res) => {

    posts.findPostComments(req.params.id)
        .then(comments => {
            if (comments[0]) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({
                    error: "The post with the specified ID does not exist!"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                err,
                error: "The comments information could not be retrieved!"
            })
        })
})

router.delete("/api/posts/:id", (req, res) => {
	posts
		.remove(req.params.id)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({message: "The post has been deleted"});
			} else {
				res.status(404).json({
					message: "The post with specified ID doesn't exist."
				})
			}
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json({
				error: "The post could not be removed."
			})
		})
})

router.put("/api/posts/:id", (req, res) => {
	if (!req.body.title || !req.body.contents) {
		return res.status(400).json({
			errorMessage: "Please provide title and contents for the post.",
		});
    }
    

	posts
		.update(req.params.id, req.body)
		.then((post) => {
			if (post) {
				res.status(200).json({message: "Post successfully updated"});
			} else {
				res.status(404).json({
					message: "The post with the specified ID does not exist.",
				});
			}
		})
		.catch((error) => {
			console.log(error);
			res
				.status(500)
				.json({ error: "The post information could not be modified." });
		});
});


module.exports = router