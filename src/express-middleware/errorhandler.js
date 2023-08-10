const errorHandler = (err, req, res, next) => {
    // console.error(err.stack);
  
    // if (err instanceof multer.MulterError) {
    //   return res.status(400).send({ error: "File size is too large" });
    // }

    if (err.name === "TypeError") {
      return res.status(404).send({ error: err.message })
    }

    if (err.name === "ValidationError") {
      return res.status(400).send({ error: err.message });
    }

    if (err.name === "CastError") {
      return res.status(400).send({ error: "Invalid parameter" });
    }
  
    if (err.name === "JsonWebTokenError") {
      return res.status(401).send({ error: "Invalid token" });
    }
  
    if (err.message === "User not found!") {
      return res.status(404).send({ error: err.message });
    }
    
    if (err.message === "invalid credential") {
      return res.status(404).send({ error: err.message });
    }
  
    if (err.message === "only admin can access all user information") {
      return res.status(403).send({ error: err.message });
    }
  
    if (err.message === "Invalid or expired token") {
      return res.status(400).send({ error: err.message });
    }

    if(err.message === "Please upload a jpg, jpeg or png file"){
      return res.status(400).send({error: err.message})
    }

    if(err.name === "MulterError"){
      return res.status(403).send({error: err.message})
    }
    
    if(err.name === "ReferenceError"){
      return res.status(403).send({error: err.message})
    }

    res.status(500).send({ error: err.message });
};


module.exports = errorHandler