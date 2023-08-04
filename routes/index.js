import homepageRoutes from './homepage.js'
import registerRoutes from './register.js'
const constructorMethod = (app) => {
    
    app.use('/', homepageRoutes);
    app.use('*', (req, res) => {
      res.render('error',{pageTitle:'404: Page Not Found'});
    });
  };
  
  export default constructorMethod;