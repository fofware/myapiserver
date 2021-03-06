import { Router, Request, Response } from "express";
import { userCtrl } from '../controlers/userController'
//import passport from "passport";

const router = Router();

/*
router.get('/special', 
  passport.authenticate('jwt', {session:false}), 
  (req: Request, res: Response) =>
  {
    res.send("Aca ta");
  })
*/
router.use( userCtrl.router );
/*
  router.get('/api/user/list',passport.authenticate('jwt', {session:false}), list );
  router.get('/api/users/search/:search',passport.authenticate('jwt', {session:false}), buscar );
  router.delete('/api/user/:id',passport.authenticate('jwt', {session:false}), del );
  router.get('/api/user/:id',passport.authenticate('jwt', {session:false}), get );
  router.put('/api/user/:id',passport.authenticate('jwt', {session:false}), put );
  router.post('/api/user/add',passport.authenticate('jwt', {session:false}), add );
*/
export default router;