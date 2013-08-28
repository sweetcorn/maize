set :application, "ibm-knowledge-editions-app"

set :repository, "git@github.com:crushlovely/ibm-knowledge-editions-app.git"
ssh_options[:forward_agent] = true
set :scm, :git                                      #capper default
set :user, 'deploy'

set :use_sudo, false                                #capper default
set :keep_releases, 5                               #capper default
set :deploy_via, :remote_cache                      #capper default
set :main_js, "app.js"

# your log folder to share between different releases
# you can add more folders here...
set :symlinks, {"log" => "log"}

stage :production do
  set :node_env, 'production'
  server "em-sj1.valuedrivenprovocation.com", :app, :primary => true
end

desc "tail the application logfile"
task :log do
  log = "#{application_dir}/current/log/#{node_env}.log"
  run "tail -f #{log}"
end
