import { Router } from 'express';
import multer from 'multer';
import Auth from './app/middlewares/Auth';
import multerconfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import SubscribeController from './app/controllers/SubscribeController';

const upload = multer(multerconfig);

const Route = new Router();

Route.get('/', UserController.index);
Route.post('/api/session', SessionController.store);

Route.use(Auth);
Route.get('/api/user/meetups', UserController.meetups);
Route.post('/api/user', UserController.store);
Route.put('/api/user', UserController.update);

Route.post('/api/file', upload.single('file'), FileController.store);

Route.get('/api/meetup', MeetupController.index);
Route.post('/api/meetup', MeetupController.store);
Route.put('/api/meetup/:id', MeetupController.update);
Route.delete('/api/meetup/:id', MeetupController.delete);

Route.post('/api/subscribe', SubscribeController.store);

export default Route;
