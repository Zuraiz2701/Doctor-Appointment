const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(200).send({ message: 'Auth Failed', success: false });
            }
            else {
                req.body.userId = decoded.id;
                next()
                //  console.log(token);
                console.log("Auth success");
            }
        });
    }
    catch (error) {
        console.log(error.message);
        //console.log(token);
        return res.status(401).send({ message: 'Auth failed', success: false, });
    }
}







//if (!req.headers.authorization) {
//    //return res.status(401).send({ message: 'Auth failed', success: false, });
//    console.log("Auth failed");
//}
//else {
//    try {
//        const token = req.headers['authorization'].split(" ")[1];
//
//        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//            if (err) {
//                return res.status(200).send({ message: 'Auth Failed', success: false });
//            }
//            else {
//                req.body.userId = decoded.id;
//                next()
//            }
//        });
//    }
//    catch (error) {
//        console.log(error.message);
//        //console.log(token);
//        return res.status(401).send({ message: 'Auth failed', success: false, });
//    }
//}

// if (req.headers && req.headers.authorization) {
   //     const token = req.headers['authorization'].split(" ")[1];
   //     JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
   //         if (err) {
   //             return res.status(200).send({ message: 'Auth Failed', success: false });
   //         }
   //         else {
   //             req.body.userId = decoded.id;
   //             next()
   //         }
   //     });
   // }
   // else {
   //     return res.status(401).send({ message: 'Auth failed', success: false, });
   // }