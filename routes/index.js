import homepageRoutes from './homepage.js'
import userRoutes from './users.js'
const constructorMethod = (app) => {
    
    app.use('/', homepageRoutes);
    app.use('/', userRoutes);
    
  
    app.use('*', (req, res) => {
      res.render('error',{pageTitle:'404: Page Not Found'});
    });
  };
  
  export default constructorMethod;