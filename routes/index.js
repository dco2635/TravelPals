import calculatorRoutes from './homepage.js'
const constructorMethod = (app) => {
    app.use('/', calculatorRoutes);
  
    app.use('*', (req, res) => {
      res.render('error',{pageTitle:'404: Page Not Found'});
    });
  };
  
  export default constructorMethod;