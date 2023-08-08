import homepageRoutes from './homepage.js'
import registerRoutes from './register.js'
import loginRoutes from './login.js'
const constructorMethod = (app) => {
    
    app.use('/', homepageRoutes);
    //app.use('/register', registerRoutes);
    //app.use('/login', loginRoutes);
    app.use('*', (req, res) => {
      res.render('error',{pageTitle:'404: Page Not Found'});
    });
  };
  
  export default constructorMethod;