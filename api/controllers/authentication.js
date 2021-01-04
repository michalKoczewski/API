const jwt = require("jsonwebtoken");

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token != null) {
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err);
            if(err) return res.status(403);
            req.user = user;
            next()
        })
    } else {
        return res.status(401);
    }
}

export function authenticateToken();