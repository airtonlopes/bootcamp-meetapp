import { Router } from 'express';
import multer from 'multer';
import multerconfig from './config/multer';
const upload = multer(multerconfig);

const Route = new Router();

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import Auth from './app/middlewares/Auth';

Route.get('/', UserController.index);
Route.post('/api/session', SessionController.store);

//Route.use(Auth);
Route.post('/api/user', UserController.store);
Route.put('/api/user', UserController.update);

Route.post('/api/file', upload.single('file'), FileController.store);

Route.get('/api/meetup', MeetupController.index);
Route.post('/api/meetup', MeetupController.store);
Route.put('/api/meetup/:id', MeetupController.update);
Route.delete('/api/meetup/:id', MeetupController.delete);

export default Route;
