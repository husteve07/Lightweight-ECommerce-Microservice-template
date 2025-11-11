import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    // @ts-ignore
    req.session = null;

    res.send({});
});

export { router as signOutRouter };