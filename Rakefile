task :deploy

task :deploy do |t|
  sh "git push origin master"
  sh "dandelion ddeploy"
end

task :default => [:deploy]
