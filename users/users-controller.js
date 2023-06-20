import * as usersDao from './users-dao.js'

const UserController = (app) => {

    const findUserById = async (req, res) => {
        const userId = req.params.id;
        const user = await usersDao.findUserById(userId)
        res.json(user);
    }

    const findAllUsers = async (req, res) => {
        const username = req.query.username;
        const password = req.query.password;
        if (username && password) {
            const user = await usersDao.findUserByCredentials(username, password);
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        } else if (username) {
            const user = await usersDao.findUserByUsername(username);
            if (user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        } else {
            const users = await usersDao.findAllUsers();
            res.json(users);
        }
    };

    const createUser = async(req, res) => {
        const newUser = req.body;
        const insertedUser = await usersDao.createUser(newUser);
        res.json(insertedUser);
    }

    const deleteUser = async (req, res) => {
        const userIdToDelete = req.params.id;
        const status = await usersDao.deleteUser(userIdToDelete);
        res.json(status);
    }

    const updateUser = async (req, res) => {
        const userIdToUpdate = req.params.id;
        const status = await usersDao.updateUser(userIdToUpdate, req.body);
        req.session["currentUser"] = await usersDao.findUserById(userIdToUpdate);
        res.json(status);
    }

    app.get('/api/users', findAllUsers)
    app.get('/api/users/:uid', findUserById);
    app.post('/api/users', createUser);
    app.delete('/api/users/:uid', deleteUser);
    app.put('/api/users/:uid', updateUser);
}

export default UserController
