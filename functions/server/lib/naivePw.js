const naivePw = (length) => {
    let res = '';
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}"?><.,/;[]';
    const dictLength = dict.length;
    for (let i = 0; i < length; i++) {
      res += dict[Math.floor(Math.random() * dictLength)];
    };
    return res;
};

module.exports = naivePw;