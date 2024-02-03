const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // access token is expired or invalid
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
        if (refreshErr) {
          // Refresh token is expired or invalid
          return res.status(403).json({ message: 'Forbidden' });
        }

        // get a new access token
        const newAccessToken = jwt.sign({ userId: refreshUser.userId, role: refreshUser.role }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '12h'
        });

        // update the access token in the cookie
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 }); // 12h
        req.user = refreshUser;

        return next();
      });
    } else {
      // access token is valid, proceed with the request
      req.user = user;
      return next();
    }
  });
};

const checkAdminMiddleware = (req, res, next) => {
  // user will be present after auth middleware
  const user = req.user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admin access required.' });
  }

  next();
};

module.exports = { authMiddleware, checkAdminMiddleware };
