// middleware to check roles
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const role = req.user.role || 'user';
    if (allowedRoles.length && !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}

module.exports = authorize;
