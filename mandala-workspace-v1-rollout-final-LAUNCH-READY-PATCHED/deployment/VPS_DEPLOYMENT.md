# VPS Deployment

## Requirements
- Linux VPS
- SSH access
- Node.js 20+
- npm
- PM2
- Nginx
- SSL certificate

## Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## Install PM2

```bash
sudo npm install -g pm2
```

## Build and Run

```bash
npm install
npm run build
pm2 start npm --name mandala-workspace -- start
pm2 save
```

## Nginx

Proxy workspace.mandalacreative.com to:

http://127.0.0.1:3000
