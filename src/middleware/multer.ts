import path from 'path';
import multer from 'multer';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.resolve(__dirname, '..', '..', 'public/images'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname.split(' ').join(''));
	},
});
const upload = multer({ storage: storage });

export default upload;
