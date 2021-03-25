import { getPageSetting } from '../utils';

const shell = require('shelljs');

const checkIfGitRight = () => {
  if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
    return false;
  }
  return true;
};

const gitCheckBranch = async ({ targetBranch = 'master' } = {}) => {
  const { own_blog_service_path } = await getPageSetting();
  shell.cd(own_blog_service_path);
  if (checkIfGitRight()) {
    if (shell.exec(`git checkout ${targetBranch}`).code !== 0) {
      shell.echo('Error: Git checkout failed');
      shell.exit(1);
    }
  }
};

const gitPull = async ({ targetBranch = 'master' } = {}) => {
  const { own_blog_service_path } = await getPageSetting();
  shell.cd(own_blog_service_path);
  if (checkIfGitRight()) {
    if (shell.exec(`git pull origin ${targetBranch}`).code !== 0) {
      shell.echo('Error: Git pull failed');
      shell.exit(1);
    }
  }
};

const gitAdd = async () => {
  const { own_blog_service_path } = await getPageSetting();
  shell.cd(own_blog_service_path);
  if (checkIfGitRight()) {
    if (shell.exec('git add .').code !== 0) {
      shell.echo('Error: Git add failed');
      shell.exit(1);
    }
  }
};

const gitCommit = async ({ message }) => {
  const { own_blog_service_path } = await getPageSetting();
  shell.cd(own_blog_service_path);
  if (checkIfGitRight()) {
    if (shell.exec(`git commit -m '${message}'`).code !== 0) {
      shell.echo('Error: Git commit failed');
      // shell.exit(1);
    }
  }
};

const gitPush = async ({ targetBranch = 'master' } = {}) => {
  const { own_blog_service_path } = await getPageSetting();
  shell.cd(own_blog_service_path);
  if (checkIfGitRight()) {
    if (shell.exec(`git push -u origin ${targetBranch}`).code !== 0) {
      // 默认往master push
      shell.echo('Error: Git push failed');
      // shell.exit(1);
    }
  }
};

export { gitAdd, gitCommit, gitPush, gitCheckBranch, gitPull };
