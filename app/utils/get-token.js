module.exports = {
  // Handle get token from headers
  getToken: (req) => {
    let token =
      // Get token from headers
      // (1) Cek token di headers
      req.headers.authorization
        ? // (a) Jika ada replace dengan ini
          req.headers.authorization.replace("Bearer ", "")
        : // (b) Jika tidak ada return null
          null;

    //   (2) Cek token ada apa tidak
    return token && token.length
      ? // (a) Jika ada masukkan token
        token
      : // (b) jika tidak ada kosongkan
        null;
  },
};
