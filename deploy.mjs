// import path from 'path'
import { NodeSSH } from 'node-ssh'

const main = async () => {
  const ssh = new NodeSSH()

  await ssh.connect({
    host: '47.99.188.89',
    username: 'root',
    password: 'Szlc123456'
  })

  console.log('上传中...')

  // eslint-disable-next-line no-undef
  await ssh.putDirectory('dist', '/home/gjf/digital_workbench/h5/h5')

  console.log('上传成功')

  // eslint-disable-next-line no-undef
  globalThis.process.exit(0)
}

main()
