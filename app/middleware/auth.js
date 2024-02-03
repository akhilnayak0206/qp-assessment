const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Access token is expired or invalid
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshUser) => {
        if (refreshErr) {
          // Refresh token is expired or invalid
          return res.status(403).json({ message: 'Forbidden' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ userId: refreshUser.userId, role: refreshUser.role }, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: '12h'
        });

        // Update the access token in the cookie
        res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 12 * 60 * 60 * 1000 }); // 12h
        req.user = refreshUser;

        return next();
      });
    } else {
      // Access token is valid, proceed with the request
      req.user = user;
      return next();
    }
  });
};

module.exports = { authMiddleware };
