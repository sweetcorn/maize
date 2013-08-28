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
