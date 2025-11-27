# Skedadel Fleet Management - Hostinger VPS Deployment Guide

## Prerequisites

- Hostinger VPS with Ubuntu 20.04 or later
- SSH access to your VPS
- Domain name pointed to your VPS IP (optional but recommended)

## Step 1: Prepare Your VPS

SSH into your Hostinger VPS:

```bash
ssh root@your-vps-ip
```

Update system packages:

```bash
apt update && apt upgrade -y
```

## Step 2: Install Docker and Docker Compose

Install Docker:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

Install Docker Compose:

```bash
apt install docker-compose -y
```

Verify installations:

```bash
docker --version
docker-compose --version
```

## Step 3: Upload Your Application

### Option A: Using Git (Recommended)

```bash
cd /var/www
git clone <your-repo-url> skedadel
cd skedadel
```

### Option B: Using SCP/SFTP

From your local machine:

```bash
scp -r "c:\Users\trist\Downloads\Skedadel fleet Management system" root@your-vps-ip:/var/www/skedadel
```

## Step 4: Configure Environment Variables

```bash
cd /var/www/skedadel
cp .env.production .env
nano .env
```

Update these critical values:
- `MYSQL_ROOT_PASSWORD` - Strong password for MySQL root
- `MYSQL_PASSWORD` - Strong password for app database user
- `JWT_SECRET` - Long random string (use: `openssl rand -base64 32`)

Save and exit (Ctrl+X, Y, Enter)

## Step 5: Build and Start Services

```bash
docker-compose up -d --build
```

Check if containers are running:

```bash
docker-compose ps
```

You should see 3 containers:
- skedadel-mysql
- skedadel-app
- skedadel-nginx

## Step 6: Seed the Database

Run the database seeder:

```bash
docker-compose exec app node server/seedDatabase.js
```

## Step 7: Configure Firewall

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw enable
```

## Step 8: Access Your Application

Open your browser and navigate to:
- `http://your-vps-ip` or
- `http://your-domain.com` (if domain is configured)

## Step 9: SSL Certificate (Optional but Recommended)

### Using Let's Encrypt with Certbot

Install Certbot:

```bash
apt install certbot python3-certbot-nginx -y
```

Stop nginx container temporarily:

```bash
docker-compose stop nginx
```

Get SSL certificate:

```bash
certbot certonly --standalone -d your-domain.com
```

Certificates will be in `/etc/letsencrypt/live/your-domain.com/`

Create SSL directory and copy certificates:

```bash
mkdir -p /var/www/skedadel/ssl
cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /var/www/skedadel/ssl/cert.pem
cp /etc/letsencrypt/live/your-domain.com/privkey.pem /var/www/skedadel/ssl/key.pem
```

Update `nginx.conf`:

```bash
nano nginx.conf
```

Uncomment the HTTPS server block and update `server_name` to your domain.

Restart nginx:

```bash
docker-compose up -d nginx
```

## Useful Commands

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
docker-compose logs -f nginx
```

### Restart services

```bash
docker-compose restart
```

### Stop services

```bash
docker-compose down
```

### Update application

```bash
git pull
docker-compose up -d --build
```

### Backup database

```bash
docker-compose exec mysql mysqldump -u skedadel -p skedadel_fleet > backup_$(date +%Y%m%d).sql
```

### Restore database

```bash
docker-compose exec -T mysql mysql -u skedadel -p skedadel_fleet < backup_20250127.sql
```

## Troubleshooting

### Check if containers are running

```bash
docker-compose ps
```

### Check container logs

```bash
docker-compose logs app
```

### Restart a specific container

```bash
docker-compose restart app
```

### Access MySQL directly

```bash
docker-compose exec mysql mysql -u skedadel -p
```

### Check disk space

```bash
df -h
```

### Clean up Docker resources

```bash
docker system prune -a
```

## Security Recommendations

1. **Change default passwords** in `.env`
2. **Enable firewall** (ufw)
3. **Use SSL certificates** (Let's Encrypt)
4. **Regular backups** of database
5. **Keep Docker images updated**
6. **Monitor logs** regularly
7. **Disable root SSH** login (use sudo user)

## Performance Optimization

1. **Increase MySQL buffer pool size** if you have enough RAM
2. **Enable gzip compression** in nginx
3. **Set up CDN** for static assets
4. **Monitor resource usage** with `htop` or `docker stats`

## Support

For issues or questions, check the logs first:

```bash
docker-compose logs -f
```

Common issues:
- **Port already in use**: Check if another service is using port 80/443
- **Database connection failed**: Verify MySQL container is healthy
- **Permission denied**: Run commands with `sudo` or as root
