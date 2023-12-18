//Here you will import route files and export the constructor method as shown in lecture code and worked in previous labs.

// import authRoutes from './auth_routes.js';
import router from "./auth_routes.js";

const constructorMethod = (app) => {
    app.use('/', router);
    // app.use('*', (req, res) => {
    //     res.sendStatus(404);
    // });
};

export default constructorMethod;