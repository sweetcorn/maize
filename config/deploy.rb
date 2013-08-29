set :application, "ibm-knowledge-editions-app"
set :deploy_to, "/srv/#{application}"   #capper defaults to "/var/app/#{application}"
set :repository, "git@github.com:crushlovely/ibm-knowledge-editions-app.git"

set :scm, :git                                      #capper default
set :user, 'deploy'

set :use_sudo, false                                #capper default
set :keep_releases, 5                               #capper default
set :deploy_via, :remote_cache                      #capper default

set :main_js, "app.js"
set :forever_cmd, "./node_modules/.bin/forever"           #use the forever that is installed along with the app

# your log folder to share between different releases
# you can add more folders here...
set :symlinks, {"log" => "log"}

stage :production do
  set :node_env, 'production'
  server "192.168.33.10", :app, :primary => true
end

desc "tail the application logfile"
task :log do
  log = "#{application_dir}/current/log/#{node_env}.log"
  run "tail -f #{log}"
end

ssh_options[:forward_agent] = true
default_run_options[:pty] = true
on :start do
  `ssh-add`
end

after 'deploy:update_code', "npm:install"

namespace :npm do
  desc <<-DESC
    Install the current npm environment. \
    Note it is recommended to check in npm-shrinkwrap.json into version control\
    and to put node_module into .gitignore to manage dependencies. \
    See http://blog.nodejs.org/2012/02/27/managing-node-js-dependencies-with-shrinkwrap \
    If no npm-shrinkwrap.json is found packages are installed from package.json with no guarantee\
    about the version beeing installed
    If the npm cmd cannot be found then you can override the npm_cmd variable to specifiy \
    which one it should use.

    You can override any of these defaults by setting the variables shown below.

      set :npm_cmd,      "npm" # e.g. "/usr/local/bin/npm"
      set :npm_flags,    "--production --loglevel warn" # e.g. "--production --loglevel info"
  DESC
  task :install, :roles => :app, :except => { :no_release => true } do
    run("cd #{latest_release} && #{fetch(:npm_cmd, "npm")} install #{fetch(:npm_flags, "--production --loglevel warn")} ")
  end
end

