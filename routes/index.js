exports.index = function(req, res){
  res.render('index', { title: 'Express', params: req.params , user: req.user });
};

exports.login = function(req, res){
  res.render('login', { title: 'Express login', params: req.params });
};

exports.newAccount = function(req, res){

};
