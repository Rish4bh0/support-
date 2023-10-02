// middleware/roleMiddleware.js

const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (req.user && roles.includes(req.user.role)) {
        // User has one of the required roles, allow access
        next();
      } else {
        res.status(403).json({ message: 'Access denied. Requires one of these roles: ' + roles.join(', ') });
      }
    };
  };
  
  module.exports = roleMiddleware;
  