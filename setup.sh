#!/bin/bash
# ============================================================
#  Flaky Fantasies — One-shot Setup Script
#  Run: bash setup.sh
# ============================================================

set -e
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}"
echo "  🍰 Flaky Fantasies — Setup"
echo "================================${NC}"

# Check Node
if ! command -v node &>/dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org${NC}"; exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check npm
if ! command -v npm &>/dev/null; then
  echo -e "${RED}✗ npm not found.${NC}"; exit 1
fi
echo -e "${GREEN}✓ npm $(npm -v)${NC}"

# ── Backend ─────────────────────────────────────────────────
echo -e "\n${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Create images folder
mkdir -p public/images
echo -e "${GREEN}✓ backend/public/images/ folder ready${NC}"
echo -e "${YELLOW}  ⚠  Copy ALL your pastry images into: backend/public/images/${NC}"

# .env check
if [ ! -f .env ]; then
  cp .env.example .env 2>/dev/null || true
  echo -e "${YELLOW}  ⚠  .env not found. Created from template — please edit it!${NC}"
else
  echo -e "${GREEN}✓ .env exists${NC}"
fi
cd ..

# ── Frontend ─────────────────────────────────────────────────
echo -e "\n${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
cd ..

# ── Done ─────────────────────────────────────────────────────
echo -e "\n${GREEN}✅ Setup complete!${NC}\n"
echo -e "Next steps:"
echo -e "  1. ${CYAN}Copy your images to:${NC}  backend/public/images/"
echo -e "  2. ${CYAN}Edit your .env:${NC}       backend/.env  (set DB_PASSWORD)"
echo -e "  3. ${CYAN}Start backend:${NC}         cd backend && npm run dev"
echo -e "  4. ${CYAN}Start frontend:${NC}        cd frontend && npm run dev"
echo -e "  5. ${CYAN}Open browser:${NC}          http://localhost:5173\n"
