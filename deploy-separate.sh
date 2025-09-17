#!/bin/bash

# SalamatLab Separate Deployment Script
# اسکریپت deployment جداگانه برای Frontend و Backend

echo "🚀 SalamatLab Deployment - Separate Architecture"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if liara CLI is installed
if ! command -v liara &> /dev/null; then
    echo -e "${RED}❌ Liara CLI not found. Please install it first:${NC}"
    echo "npm install -g @liara/cli"
    exit 1
fi

echo -e "${BLUE}📋 What would you like to deploy?${NC}"
echo "1. Backend only (PHP API)"
echo "2. Frontend only (React SPA)"  
echo "3. Both (recommended for first time)"
echo "4. Setup environment variables guide"

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo -e "${YELLOW}🔧 Deploying Backend...${NC}"
        
        # Create backend directory if not exists
        if [ ! -d "salamatlab-backend" ]; then
            echo -e "${BLUE}📁 Creating backend directory...${NC}"
            mkdir salamatlab-backend
            
            # Copy backend files
            cp -r public/ salamatlab-backend/
            cp liara-backend.json salamatlab-backend/liara.json
            cp database-schema.sql salamatlab-backend/
            cp BACKEND_SETUP_GUIDE.md salamatlab-backend/
            cp SMS_SETUP_GUIDE.md salamatlab-backend/
            cp env.example salamatlab-backend/
            
            echo -e "${GREEN}✅ Backend files copied${NC}"
        fi
        
        cd salamatlab-backend
        echo -e "${BLUE}🚀 Deploying to Liara...${NC}"
        liara deploy --app salamatlab-backend --platform php
        
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        echo -e "${BLUE}🔗 Test URLs:${NC}"
        echo "https://salamatlab-backend.liara.run/api/test-connection.php"
        echo "https://salamatlab-backend.liara.run/api/test-sms.php"
        ;;
        
    2)
        echo -e "${YELLOW}🎨 Deploying Frontend...${NC}"
        
        # Build frontend
        echo -e "${BLUE}🔨 Building frontend...${NC}"
        npm install
        npm run build
        
        # Deploy frontend
        echo -e "${BLUE}🚀 Deploying to Liara...${NC}"
        liara deploy --app salamatlab-frontend --platform static
        
        echo -e "${GREEN}✅ Frontend deployed!${NC}"
        echo -e "${BLUE}🔗 Test URLs:${NC}"
        echo "https://salamatlab-frontend.liara.run/"
        echo "https://salamatlab-frontend.liara.run/auth/login"
        ;;
        
    3)
        echo -e "${YELLOW}🔄 Deploying Both Frontend and Backend...${NC}"
        
        # Deploy Backend first
        echo -e "${BLUE}🔧 Step 1: Backend...${NC}"
        
        if [ ! -d "salamatlab-backend" ]; then
            mkdir salamatlab-backend
            cp -r public/ salamatlab-backend/
            cp liara-backend.json salamatlab-backend/liara.json
            cp database-schema.sql salamatlab-backend/
            cp BACKEND_SETUP_GUIDE.md salamatlab-backend/
            cp SMS_SETUP_GUIDE.md salamatlab-backend/
            cp env.example salamatlab-backend/
        fi
        
        cd salamatlab-backend
        liara deploy --app salamatlab-backend --platform php
        cd ..
        
        echo -e "${GREEN}✅ Backend deployed!${NC}"
        
        # Deploy Frontend
        echo -e "${BLUE}🎨 Step 2: Frontend...${NC}"
        npm install
        npm run build
        liara deploy --app salamatlab-frontend --platform static
        
        echo -e "${GREEN}✅ Both deployed successfully!${NC}"
        echo -e "${BLUE}🔗 Your URLs:${NC}"
        echo "Frontend: https://salamatlab-frontend.liara.run/"
        echo "Backend:  https://salamatlab-backend.liara.run/api/"
        ;;
        
    4)
        echo -e "${BLUE}📝 Environment Variables Setup Guide${NC}"
        echo "================================================"
        echo "Go to Liara panel for 'salamatlab-backend' app and add these:"
        echo ""
        echo -e "${YELLOW}Database:${NC}"
        echo "DB_HOST=your_database_host"
        echo "DB_NAME=your_database_name"
        echo "DB_USER=your_database_user"
        echo "DB_PASS=your_database_password"
        echo ""
        echo -e "${YELLOW}SMS.ir:${NC}"
        echo "SMSIR_API_KEY=your_sms_api_key"
        echo "SMSIR_TEMPLATE_ID=your_template_id"
        echo ""
        echo -e "${YELLOW}Security:${NC}"
        echo "OTP_SECRET=your_32_character_secret"
        echo "ADMIN_USERNAME=your_admin_username"
        echo "ADMIN_PASSWORD_HASH=your_bcrypt_hash"
        echo ""
        echo -e "${YELLOW}CORS:${NC}"
        echo "ALLOWED_ORIGINS=https://salamatlab-frontend.liara.run"
        echo ""
        echo -e "${GREEN}💡 Tip: Use the env.example file as reference!${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo -e "${BLUE}📚 Check LIARA_DEPLOYMENT_FIXED.md for more details${NC}"
