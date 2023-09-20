const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorsRoute");
const path = require("path");
const multer = require('multer');
const fileUpload = require('express-fileupload')
app.use(fileUpload(
  {
    useTempFiles: true,
    // tempFileDir: '/tmp/',
    // createParentPath: true
  }
));
app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using crypto
    const filename = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Serve uploaded files statically (for testing)
app.use('/uploads', express.static('uploads'));

// Handle file uploads
app.post('/upload', upload.single('photo'), (req, res) => {
  try {
    // Assuming the file has been successfully uploaded and saved

    // Construct the file URL
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Calculate MD5 hash of the uploaded file (you can use a library like crypto)
    const fileData = fs.readFileSync(req.file.path);
    const md5 = crypto.createHash('md5').update(fileData).digest('hex');

    // Respond with the file data and URL
    res.json({
      name: req.file.originalname,
      data: fileData,
      size: req.file.size,
      encoding: req.file.encoding,
      tempFilePath: req.file.path,
      truncated: req.file.truncated,
      mimetype: req.file.mimetype,
      md5,
      url: fileUrl,
    });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Node Express Server Started at ${port}!`));
