const Ssh2Client = require('ssh2').Client;

const connect = new Ssh2Client();
connect
  .on('ready', () => {
    console.log('ssh2Client ready');
    connect.shell((err, stream) => {
      if (err) {
        throw err;
      }
      stream
        .on('close', () => {
          connect.end();
        })
        .on('data', data => {
          console.log(`OUTPUT: ${data}`);
        });
      stream.end(
        'cd /home/luo/\ntar -zxvf Learn-note.tgz\nls -al /home/luo/\nexit\n'
      );
    });
  })
  .connect({
    ...global.CONFIG.ssh,
    privateKey: require('fs').readFileSync('/Users/tuxiuluo/Desktop/txyun')
  });

module.exports = connect;
